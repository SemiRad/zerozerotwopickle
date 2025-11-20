<template>
  <div class="bg-secondary h-screen flex items-center justify-center">
    <div v-if="loading" class="flex flex-col items-center">
      <svg
        class="animate-spin h-12 w-12 text-primary mb-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
      </svg>
    </div>

    <div v-else>
      <div class="flex items-center justify-center mb-6">
        <img src="/zzt1.png" alt="Logo" class="w-auto h-auto" />
      </div>

      <div class="flex items-center justify-center">
        <button
          @click="loginWithGoogle"
          class="flex items-center justify-center bg-primary text-secondary font-medium p-4 rounded-lg shadow-2xl hover:bg-gray-100 transition-colors w-fit"
        >
          <img src="/google.png" alt="Google" class="w-6 h-6 mr-3" />
          <span class="font-inter">Sign in with Google</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { supabase } from '../lib/supabase'
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'

const router = useRouter()
const allowedEmail = 'radenacompanado@gmail.com'
const loading = ref(true)

const loginWithGoogle = async () => {
  await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin + '/login',
    },
  })
}

const handleRedirect = async () => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error) {
    console.error(error)
    loading.value = false
    return
  }

  if (!user) {
    loading.value = false
    return
  }

  if (user.email === allowedEmail) {
    router.replace('/admin')
  } else {
    await supabase.auth.signOut()
    router.replace('/access-denied')
  }
}

onMounted(() => {
  handleRedirect().finally(() => (loading.value = false))
})
</script>
