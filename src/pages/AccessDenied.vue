<template>
  <div class="bg-secondary h-screen font-inter">
    <div class="flex items-center justify-center mb-6">
      <img src="/zzt1.png" alt="Logo" class="w-auto h-auto" />
    </div>

    <div class="flex flex-col items-center justify-center text-center mb-6">
      <h1 class="text-3xl font-bold text-primary mb-2">Access Denied</h1>
      <p class="text-tertiary text-md">Your account is not authorized.</p>
    </div>

    <div class="flex items-center justify-center">
      <button
        @click="loginWithAnotherAccount"
        class="flex items-center justify-center bg-primary text-secondary font-medium p-4 rounded-lg shadow-2xl hover:bg-gray-100 transition-colors w-fit"
      >
        <img src="/google.png" alt="Google" class="w-6 h-6 mr-3" />
        <span class="font-inter">Log in with another account</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { supabase } from '../lib/supabase'

const loginWithAnotherAccount = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) return console.error(error)

  await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin + '/login',
    },
  })
}
</script>
