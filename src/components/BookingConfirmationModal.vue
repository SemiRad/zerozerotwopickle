<template>
  <div
    v-if="props.show"
    class="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 font-inter"
  >
    <div class="bg-white rounded-2xl p-6 w-96 shadow-2xl transform transition-all scale-100">
      <h2 class="text-lg font-bold text-green-950 uppercase">Confirm Booking</h2>
      <p class="text-sm text-gray-700 mt-4 mb-6">
        Are you sure you want to change this booking status to
        <span class="font-bold uppercase">{{ newStatus }}</span
        >?
      </p>
      <div class="flex justify-end gap-3 text-sm">
        <button
          @click="$emit('close')"
          class="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400 transition hover:cursor-pointer"
        >
          Cancel
        </button>
        <button
          @click="$emit('confirm')"
          class="px-4 py-2 rounded-md bg-green-950 text-white hover:bg-green-800 transition hover:cursor-pointer"
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  show: boolean
  newStatus: string
}>()
defineEmits(['close', 'confirm'])
</script>
