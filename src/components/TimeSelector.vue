<template>
  <div class="p-4 w-full font-roboto">
    <div v-if="bookingStore.loadingBookedSlots" class="flex justify-center items-center py-8">
      <div class="w-8 h-8 border-4 border-secondary border-t-tertiary rounded-full animate-spin"></div>
    </div>

    <div v-else class="grid grid-cols-1 gap-1 sm:grid-cols-2 sm:gap-2.5">
      <div
        v-for="slot in formattedSlots"
        :key="slot.start"
        class="p-4 border rounded-lg text-left transition duration-300"
        :class="{
          'cursor-pointer': isSlotEnabled(slot) && !isBooked(slot),
          'cursor-not-allowed': !isSlotEnabled(slot) || isBooked(slot),
          'bg-green-950 text-white border-transparent': isInRange(slot),
          'bg-gray-100 hover:bg-amber-50': !isInRange(slot) && isSlotEnabled(slot) && !isBooked(slot),
          'bg-gray-200 text-gray-400': !isSlotEnabled(slot) || isBooked(slot),
        }"
        @click="isSlotEnabled(slot) && !isBooked(slot) && handleSlotClick(slot)"
      >
        <div class="font-semibold text-base sm:text-base lg:text-lg">
          {{ slot.label }}
        </div>

        <div v-if="!isBooked(slot)" class="text-xs sm:text-sm lg:text-sm opacity-75">
          ₱{{ slot.cost }}
        </div>

        <div v-if="isBooked(slot)" class="text-xs sm:text-sm lg:text-sm text-primary">
          RESERVED
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useBookingStore } from '@/stores/booking'
import { useNotifyStore } from '@/stores/notify'
import type { BookingSlot } from '@/stores/booking'

const bookingStore = useBookingStore()
const notify = useNotifyStore()

onMounted(() => {
  bookingStore.fetchBookedSlots()
})

const formatTime = (hour: number): string => {
  if (hour === 0 || hour === 24) return '12:00 AM'
  if (hour === 12) return '12:00 PM'
  if (hour > 12) return `${hour - 12}:00 PM`
  return `${hour}:00 AM`
}

const formattedSlots = computed(() =>
  bookingStore.allSlots.map((slot) => ({
    ...slot,
    label: `${formatTime(slot.start)} - ${formatTime(slot.end)}`,
  })),
)

const isInRange = (slot: BookingSlot): boolean => {
  const { startSlot, endSlot } = bookingStore.bookingObject
  if (!startSlot || !endSlot) return false
  return slot.start >= startSlot.start && slot.end <= endSlot.end
}

const isSlotEnabled = (slot: BookingSlot) => {
  const isAvailable = bookingStore.availableSlots.some(
    (s) => s.start === slot.start && s.end === slot.end
  )

  return isAvailable && !isBooked(slot)
}

const isBooked = (slot: BookingSlot) => {
  return bookingStore.bookedSlotHours.includes(slot.start)
}

const handleSlotClick = (slot: BookingSlot) => {
  const booking = bookingStore.bookingObject
  const { startSlot, endSlot } = booking

  if (!startSlot) {
    booking.startSlot = slot
    booking.endSlot = slot
    booking.totalPrice = slot.cost
    return
  }

  if (endSlot && slot.start === endSlot.start && slot.end === endSlot.end) {
    booking.startSlot = null
    booking.endSlot = null
    booking.totalPrice = 0
    return
  }

  if (startSlot.start === slot.start && endSlot?.end === slot.end) {
    booking.startSlot = null
    booking.endSlot = null
    booking.totalPrice = 0
    return
  }

  const newStart = Math.min(startSlot.start, slot.start)
  const newEnd = Math.max(startSlot.end, slot.end)

  if (newEnd - newStart > 6) {
    notify.notify('You can only book up to 6 hours', 'error', 'home')
    return
  }

  const allSlots = bookingStore.allSlots
  const rangeSlots = allSlots.filter((s) => s.start >= newStart && s.end <= newEnd)

  booking.startSlot = rangeSlots[0] ?? null
  booking.endSlot = rangeSlots[rangeSlots.length - 1] ?? null
  booking.totalPrice = rangeSlots.reduce((sum, s) => sum + s.cost, 0)
}
</script>
