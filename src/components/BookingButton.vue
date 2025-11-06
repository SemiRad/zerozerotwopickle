<template>
  <div class="flex justify-center w-full font-roboto p-5">
    <div class="w-1/3 lg:w-3/4">
      <button
        class="uppercase font-bold text-white w-full py-2.5 rounded-xl shadow-md transition-all duration-300 ease-in-out cursor-pointer"
        :class="[
          isBookable
            ? 'bg-green-950 hover:bg-green-800 hover:shadow-lg'
            : 'bg-gray-400 hover:cursor-not-allowed',
        ]"
        :disabled="!isBookable"
        @click="emitBooking"
      >
        Book Now
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useBookingStore } from '@/stores/booking'
import { storeToRefs } from 'pinia'

const emit = defineEmits(['book'])
const bookingStore = useBookingStore()
const { bookingObject } = storeToRefs(bookingStore)

const isBookable = computed(() => {
  return bookingObject.value.startSlot !== null && bookingObject.value.endSlot !== null
})

const emitBooking = () => {
  if (!isBookable.value) return
  emit('book', bookingObject.value)
}
</script>
