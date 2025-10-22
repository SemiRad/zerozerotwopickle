<template>
  <div class="p-4 w-full font-roboto">
    <div class="grid grid-cols-1 gap-1 sm:grid-cols-2 sm:gap-2.5">
      <div
        v-for="slot in formattedSlots"
        :key="slot.start"
        class="p-4 border border-green-950 rounded-lg cursor-pointer text-left transition duration-300"
        :class="{
          'bg-green-950 text-white border-transparent': isSelected(slot),
          'bg-gray-100 hover:bg-amber-50': !isSelected(slot),
        }"
        @click="toggleSlot(slot)"
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
import { useBookingStore } from '@/stores/Booking'
import { useErrorStore } from '@/stores/error'
import type { BookingSlot } from '@/stores/Booking'

const bookingStore = useBookingStore()
const errorStore = useErrorStore()

const selectedSlots = computed({
  get: () => bookingStore.bookingObject.timeSlots,
  set: (val: BookingSlot[]) => {
    bookingStore.bookingObject.timeSlots = val
    bookingStore.bookingObject.totalPrice = val.reduce((sum, s) => sum + s.cost, 0)
    bookingStore.bookingObject.date = bookingStore.selectedDate
  },
})

const formattedSlots = computed(() =>
  bookingStore.availableSlots.map((slot) => ({
    ...slot,
    label: `${formatTime(slot.start)} - ${formatTime(slot.end)}`,
  })),
)

const formatTime = (hour: number) => {
  if (hour === 0 || hour === 24) return '12:00 AM'
  if (hour === 12) return '12:00 PM'
  if (hour > 12) return `${hour - 12}:00 PM`
  return `${hour}:00 AM`
}

const isSelected = (slot: BookingSlot) => selectedSlots.value.some((s) => s.start === slot.start)

const toggleSlot = (slot: BookingSlot) => {
  const maxHours = 6
  const isAlreadySelected = isSelected(slot)

  const potentialSelectionLength = isAlreadySelected
    ? selectedSlots.value.length - 1
    : selectedSlots.value.length + 1

  if (!isAlreadySelected && potentialSelectionLength > maxHours) {
    errorStore.setError('You can only book up to 6 hours')
    return
  }

  if (isAlreadySelected) {
    selectedSlots.value = []
    return
  }

  const first = selectedSlots.value[0]
  const last = selectedSlots.value[selectedSlots.value.length - 1]

  if (first && slot.end === first.start) {
    selectedSlots.value = [slot, ...selectedSlots.value]
  } else if (last && slot.start === last.end) {
    selectedSlots.value = [...selectedSlots.value, slot]
  } else {
    selectedSlots.value = [slot]
  }
}
</script>
