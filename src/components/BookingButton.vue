<template>
  <div class="flex justify-center w-full font-roboto p-5">
    <div class="w-3/4">
      <button
        class="uppercase font-bold text-white w-full py-2.5 rounded-xl shadow-md transition-all duration-300 ease-in-out cursor-pointer"
        :class="[
          bookingObject.timeSlots.length > 0
            ? 'bg-green-950 hover:bg-green-800 hover:shadow-lg'
            : 'bg-gray-400 hover:cursor-not-allowed',
        ]"
        :disabled="bookingObject.timeSlots.length === 0"
        @click="emitBooking"
      >
        Book Now
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useBookingStore } from '@/stores/booking.ts'
import { storeToRefs } from 'pinia'

const emit = defineEmits(['book'])
const bookingStore = useBookingStore()
const { bookingObject } = storeToRefs(bookingStore)

const emitBooking = () => {
  if (bookingObject.value.timeSlots.length === 0) return
  emit('book', bookingObject.value)
}
</script>
