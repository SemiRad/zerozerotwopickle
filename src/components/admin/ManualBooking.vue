<template>
  <div
    v-if="props.show"
    class="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 font-inter"
  >
    <div class="bg-secondary rounded-2xl p-6 w-96 shadow-2xl transform transition-all scale-100">
      <h2 class="text-lg font-bold text-primary uppercase">Manual Booking</h2>
      <div class="space-y-0 mb-2">
        <DatePicker />
      </div>
      <div class="space-y-0 mb-2">
        <TimePicker :error="timeError" />
      </div>
      <div class="space-y-0 mb-2">
        <div>
          <label class="block text-sm text-gray-700">Name</label>
          <input
            type="text"
            v-model="book.name"
            :class="[
              'mt-1 mb-2 w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-950 focus:border-green-950 transition-colors',
              nameError ? 'border-red-500' : 'border-gray-300',
            ]"
          />
        </div>

        <div>
          <label class="block text-sm text-gray-700"
            >Email
            <span class="text-tiny text-gray-500">&nbsp;(optional)</span>
          </label>
          <input
            type="email"
            v-model="book.email"
            class="mt-1 mb-2 w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-950 focus:border-green-950 transition-colors border-gray-300"
          />
        </div>

        <div>
          <label class="block text-sm text-gray-700"
            >Contact Number
            <span class="text-tiny text-gray-500">&nbsp;(optional)</span>
          </label>
          <input
            type="tel"
            v-model="book.contactNumber"
            class="mt-1 w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-950 focus:border-green-950 transition-colors border-gray-300"
          />
        </div>
      </div>

      <div class="grid grid-cols-2 text-sm mb-6">
        <div class="font-semibold space-y-2">
          <p>Total Price:</p>
        </div>
        <div class="space-y-2 text-right font-semibold text-green-950">
          <p>₱{{ book.totalPrice ?? 0 }}</p>
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
          @click="validateAndProceed"
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
import { useBookingStore } from '@/stores/booking.ts'
import DatePicker from '@/components/admin/DatePicker.vue'
import TimePicker from '@/components/admin/TimePicker.vue'

const bookingStore = useBookingStore()
const book = bookingStore.bookingObject

const props = defineProps<{
  show: boolean
}>()

const emit = defineEmits(['close', 'confirm'])

const nameError = ref(false)
const timeError = ref(false)

const validateAndProceed = () => {
  nameError.value = !book.name?.trim()
  timeError.value = !book.startSlot || !book.endSlot

  if (!nameError.value && !timeError.value) {
    handleConfirm()
  }
}

const clearBooking = () => {
  book.id = null
  book.date = bookingStore.selectedDate
  book.startSlot = null
  book.endSlot = null
  book.totalPrice = 0
  book.name = null
  book.email = null
  book.contactNumber = null
}

const handleClose = () => {
  clearBooking()
  emit('close')
}

const handleConfirm = () => {
  emit('confirm')
  clearBooking()
}
</script>
