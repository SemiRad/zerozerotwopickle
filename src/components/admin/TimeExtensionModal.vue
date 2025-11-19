<template>
  <div
    v-if="props.show"
    class="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 font-inter"
  >
    <div class="bg-secondary rounded-2xl p-6 w-1/2 shadow-2xl transform transition-all scale-100">
      <h2 class="text-lg font-bold text-primary uppercase">Set time extension</h2>
      <div class="space-y-0 mb-2">
        <DatePicker />
      </div>

      <div class="grid grid-cols-2 gap-2 mb-4">
        <div
          v-for="slot in extensionSlots"
          :key="slot.label"
          @click="handleSlotClick(slot)"
          class="p-4 rounded-lg transition cursor-pointer"
          :class="{
            'bg-green-950 text-white': isInRange(slot),
            'bg-white hover:bg-amber-50': !isInRange(slot),
          }"
        >
          {{ slot.label }}
        </div>
      </div>

      <div class="flex justify-end gap-3 text-sm">
        <button
          @click="handleClose"
          class="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400 transition hover:cursor-pointer"
        >
          Cancel
        </button>
        <button
          @click="handleConfirm"
          class="px-4 py-2 rounded-md bg-green-950 text-white hover:bg-green-800 transition hover:cursor-pointer"
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { BookingSlot } from '@/stores/booking'
import DatePicker from '@/components/admin/DatePicker.vue'
import { useBookingStore } from '@/stores/booking'

const bookingStore = useBookingStore()
const book = bookingStore.bookingObject

const props = defineProps<{ show: boolean }>()
const emit = defineEmits(['close', 'confirm'])

const extensionSlots: BookingSlot[] = [
  { start: 0, end: 1, label: '12:00 AM - 1:00 AM', endLabel: '1:00 AM', cost: 250 },
  { start: 1, end: 2, label: '1:00 AM - 2:00 AM', endLabel: '2:00 AM', cost: 250 },
]

const selectedExtensions = ref<BookingSlot[]>([])

const handleSlotClick = (slot: BookingSlot) => {
  const index = selectedExtensions.value.findIndex((s) => s.start === slot.start)

  if (index >= 0) {
    // Deselect
    selectedExtensions.value.splice(index, 1)
  } else {
    // Select
    selectedExtensions.value.push(slot)
  }

  if (selectedExtensions.value.length === 0) {
    book.startSlot = null
    book.endSlot = null
    book.totalPrice = 0
  } else {
    // Sort slots by start time
    const sorted = [...selectedExtensions.value].sort((a, b) => a.start - b.start)
    book.startSlot = sorted[0] ?? null
    book.endSlot = sorted[sorted.length - 1] ?? null
    book.totalPrice = sorted.reduce((sum, s) => sum + s.cost, 0)
  }
}

const isInRange = (slot: BookingSlot) => {
  return selectedExtensions.value.some((s) => s.start === slot.start)
}

const handleClose = () => emit('close')
const handleConfirm = () => emit('confirm')
</script>
