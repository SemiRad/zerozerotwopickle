import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '../lib/supabase'

import HomePage from '../pages/HomePage.vue'
import AdminPage from '../pages/AdminPage.vue'
import LoginPage from '../pages/LoginPage.vue'
import AccessDenied from '../pages/AccessDenied.vue'

const allowedEmail = 'radenacompanado@gmail.com'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'Home', component: HomePage },
    { path: '/admin', name: 'Admin', component: AdminPage, meta: { requiresAuth: true } },
    { path: '/login', name: 'Login', component: LoginPage },
    { path: '/access-denied', name: 'AccessDenied', component: AccessDenied },
  ],
})

router.beforeEach(async (to, from, next) => {
  if (!to.meta.requiresAuth) return next()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return next('/login')
  if (user.email !== allowedEmail) return next('/access-denied')

  return next()
})

export default router
