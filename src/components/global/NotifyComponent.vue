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
      v-if="notify.message && notify.target === target"
      :class="[
        'fixed top-5 right-5 z-50 text-white p-3 rounded-lg shadow-lg flex items-center gap-3',
        notify.type === 'success' ? 'bg-green-500' : 'bg-red-500',
      ]"
    >
      <!-- Icon Select -->
      <CheckCircleIcon v-if="notify.type === 'success'" class="w-6 h-6 text-white" />
      <ExclamationTriangleIcon v-else class="w-6 h-6 text-white" />

      <!-- Message -->
      <span class="font-inter text-sm">{{ notify.message }}</span>

      <!-- Close -->
      <button @click="notify.clear" class="ml-2 text-white hover:text-gray-200 transition">
        ✕
      </button>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { useNotifyStore } from '@/stores/notify'
import { CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/vue/24/solid'

defineProps<{
  target: 'home' | 'admin'
}>()

const notify = useNotifyStore()
</script>
