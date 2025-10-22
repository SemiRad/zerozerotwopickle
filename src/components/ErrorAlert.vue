<template>
  <transition
    enter-active-class="transform transition duration-300 ease-out"
    enter-from-class="translate-y-[-20px] opacity-0"
    enter-to-class="translate-y-0 opacity-100"
    leave-active-class="transform transition duration-300 ease-in"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 translate-y-[-20px]"
  >
    <div
      v-if="error.message"
      class="fixed top-5 right-5 z-50 bg-red-500 text-white p-3 rounded-lg shadow-lg flex items-center gap-3"
    >
      <!-- Heroicon Warning Icon -->
      <ExclamationTriangleIcon class="w-6 h-6 text-white" />

      <!-- Message -->
      <span class="font-inter text-sm">{{ error.message }}</span>

      <!-- Close Button -->
      <button @click="error.clearError" class="ml-2 text-white hover:text-gray-200 transition">
        ✕
      </button>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { useErrorStore } from '@/stores/error'
import { ExclamationTriangleIcon } from '@heroicons/vue/24/solid'

const error = useErrorStore()
</script>
