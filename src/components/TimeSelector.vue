<template>
  <div class="p-4 w-full font-roboto">
    <div class="grid grid-cols-1 gap-1 sm:grid-cols-2 sm:gap-2.5">
      <div
        v-for="slot in formattedSlots"
        :key="slot.start"
        class="p-4 border border-green-950 rounded-lg cursor-pointer text-left transition duration-300"
        :class="{
          'bg-green-950 text-white border-transparent': isInRange(slot),
          'bg-gray-100 hover:bg-amber-50': !isInRange(slot),
        }"
        @click="handleSlotClick(slot)"
      >
        <div class="font-semibold text-base sm:text-base lg:text-lg">
          {{ slot.label }}
        </div>
        <div class="text-xs sm:text-sm lg:text-sm opacity-75">₱{{ slot.cost }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useBookingStore } from '@/stores/booking'
import { useErrorStore } from '@/stores/error'
import type { BookingSlot } from '@/stores/booking'

const bookingStore = useBookingStore()
const errorStore = useErrorStore()

const formatTime = (hour: number): string => {
  if (hour === 0 || hour === 24) return '12:00 AM'
  if (hour === 12) return '12:00 PM'
  if (hour > 12) return `${hour - 12}:00 PM`
  return `${hour}:00 AM`
}

const formattedSlots = computed(() =>
  bookingStore.availableSlots.map((slot) => ({
    ...slot,
    label: `${formatTime(slot.start)} - ${formatTime(slot.end)}`,
  })),
)

const isInRange = (slot: BookingSlot): boolean => {
  const { startSlot, endSlot } = bookingStore.bookingObject
  if (!startSlot || !endSlot) return false
  return slot.start >= startSlot.start && slot.end <= endSlot.end
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

  if (startSlot.start === slot.start && endSlot?.end === slot.end) {
    booking.startSlot = null
    booking.endSlot = null
    booking.totalPrice = 0
    return
  }

  const newStart = Math.min(startSlot.start, slot.start)
  const newEnd = Math.max(startSlot.end, slot.end)

  if (newEnd - newStart > 6) {
    errorStore.setError('You can only book up to 6 hours')
    return
  }

  const allSlots = bookingStore.allSlots
  const rangeSlots = allSlots.filter((s) => s.start >= newStart && s.end <= newEnd)

  booking.startSlot = rangeSlots[0] ?? null
  booking.endSlot = rangeSlots[rangeSlots.length - 1] ?? null

  booking.totalPrice = rangeSlots.reduce((sum, s) => sum + s.cost, 0)
}
</script>
