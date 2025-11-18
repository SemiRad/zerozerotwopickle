<template>
  <div class="w-full font-inter">
    <div class="grid grid-cols-2 gap-4">
      <!-- Start Time -->
      <div>
        <p class="block text-sm text-gray-700">Start</p>
        <select
          v-model="start"
          :class="[
            'mt-1 w-full border rounded-md px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-950 focus:border-green-950 transition-colors',
            props.error && !start ? 'border-red-500' : 'border-gray-300',
          ]"
        >
          <option disabled value="">Select start time</option>
          <option v-for="slot in slots" :key="slot.start" :value="slot">
            {{ slot.label.split(' - ')[0] }}
          </option>
        </select>
      </div>

      <!-- End Time -->
      <div>
        <p class="block text-sm text-gray-700">End</p>
        <select
          v-model="end"
          :class="[
            'mt-1 w-full border rounded-md px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-950 focus:border-green-950 transition-colors',
            props.error && !end ? 'border-red-500' : 'border-gray-300',
          ]"
        >
          <option disabled value="">Select end time</option>
          <option v-for="slot in endSlotOptions" :key="slot.start" :value="slot">
            {{ slot.endLabel }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useBookingStore, type BookingSlot } from '@/stores/booking'

const props = defineProps<{
  error: boolean
}>()

const bookingStore = useBookingStore()
const book = bookingStore.bookingObject

const slots = computed(() => bookingStore.allSlots)

const start = computed<BookingSlot | null>({
  get: () => book.startSlot,
  set: (v) => {
    book.startSlot = v

    if (book.endSlot && v && book.endSlot.start <= v.start) {
      book.endSlot = null
    }

    updatePrice()
  },
})

const end = computed<BookingSlot | null>({
  get: () => book.endSlot,
  set: (v) => {
    book.endSlot = v
    updatePrice()
  },
})

const endSlotOptions = computed(() => {
  if (!start.value) return slots.value
  return slots.value.filter((slot) => slot.start >= start.value!.start)
})

const updatePrice = () => {
  if (!book.startSlot || !book.endSlot) {
    book.totalPrice = 0
    return
  }

  const startIndex = slots.value.findIndex((s) => s.start === book.startSlot!.start)
  const endIndex = slots.value.findIndex((s) => s.start === book.endSlot!.start)

  let total = 0
  for (let i = startIndex; i <= endIndex; i++) {
    const slot = slots.value[i]
    if (slot) total += slot.cost
  }

  book.totalPrice = total
}
</script>
