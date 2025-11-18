<template>
  <div
    v-if="props.show"
    class="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 font-inter"
  >
    <div class="bg-white rounded-2xl p-6 w-96 shadow-2xl transform transition-all scale-100">
      <!-- Fade transition wrapper -->
      <transition name="fade" mode="out-in">
        <div :key="step">
          <!-- Step 1: Booking Summary -->
          <div v-if="step === 1">
            <h2 class="text-lg font-bold mb-4 text-green-950 flex items-center gap-2 uppercase">
              Booking Summary
            </h2>

            <div class="grid grid-cols-2 text-sm mb-2">
              <div class="font-semibold space-y-2">
                <p>Date:</p>
                <p>Selected Time:</p>
              </div>
              <div class="space-y-2 text-right font-semibold">
                <p>{{ formattedDate }}</p>
                <p>{{ simplifiedSlotRange }}</p>
              </div>
            </div>

            <div class="space-y-0 mb-2">
              <div>
                <label class="block text-sm text-gray-700">Name</label>
                <input
                  type="text"
                  v-model="name"
                  :class="[
                    'mt-1 mb-2 w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-950 focus:border-green-950 transition-colors',
                    nameError ? 'border-red-500' : 'border-gray-300',
                  ]"
                />
              </div>

              <div>
                <label class="block text-sm text-gray-700">Email</label>
                <input
                  type="email"
                  v-model="email"
                  :class="[
                    'mt-1 mb-2 w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-950 focus:border-green-950 transition-colors',
                    emailError ? 'border-red-500' : 'border-gray-300',
                  ]"
                />
              </div>

              <div>
                <label class="block text-sm text-gray-700">Contact Number</label>
                <input
                  type="tel"
                  v-model="contactNumber"
                  :class="[
                    'mt-1 w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-950 focus:border-green-950 transition-colors',
                    contactError ? 'border-red-500' : 'border-gray-300',
                  ]"
                />
              </div>

              <div>
                <p class="text-tiny text-gray-500 mt-1 font-medium">Reminders:</p>
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
                class="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400 transition hover:cursor-pointer"
                @click="$emit('close')"
              >
                Cancel
              </button>
              <button
                class="px-4 py-2 rounded-md bg-green-950 text-white hover:bg-green-800 transition hover:cursor-pointer"
                @click="validateAndProceed"
              >
                Confirm
              </button>
            </div>
          </div>

          <!-- Step 2: Payment (QR Code) -->
          <div v-else-if="step === 2" class="text-center">
            <h2 class="text-lg font-bold mb-4 text-green-950 uppercase">Scan QR Code to Pay</h2>

            <div class="flex justify-center mb-4">
              <img
                src="/zztqr.png"
                class="w-32 md:w-48 lg:w-48 drop-shadow-4xl scale-100 cursor-pointer"
                @click="showQRModal = true"
              />
            </div>

            <p class="text-sm text-gray-600 mb-2">
              Please scan the QR code to complete the payment
            </p>

            <div class="grid grid-cols-2 mb-6">
              <div class="font-semibold space-y-2 text-left">Total Price:</div>
              <div class="text-right font-semibold text-green-950">₱{{ book.totalPrice ?? 0 }}</div>
            </div>

            <div class="flex justify-end gap-3 text-sm">
              <button
                class="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400 transition hover:cursor-pointer"
                @click="step = 1"
              >
                Back
              </button>
              <button
                class="px-4 py-2 rounded-md bg-green-950 text-white hover:bg-green-800 transition hover:cursor-pointer"
                @click="goToSuccess"
              >
                Payment Confirmed
              </button>
            </div>

            <!-- QR Modal -->
            <div
              v-if="showQRModal"
              class="fixed inset-0 bg-black/60 flex justify-center items-center z-50"
              @click.self="showQRModal = false"
            >
              <div class="bg-white rounded-2xl p-4 shadow-2xl max-w-sm text-sm">
                <img src="/zztqr.png" class="w-full h-auto" />
                <button
                  class="mt-4 w-full py-2 bg-green-950 text-white rounded-md hover:bg-green-800 transition"
                  @click="showQRModal = false"
                >
                  Close
                </button>
              </div>
            </div>
          </div>

          <!-- Step 3: Success -->
          <div v-else-if="step === 3" class="text-center">
            <h2 class="text-lg font-bold mb-4 text-green-950 uppercase">Booking Submitted!</h2>
            <p class="mb-4">
              Thank you, {{ name }}! Your booking has been submitted and is pending confirmation
              from the owner.
            </p>
            <button
              class="px-4 py-2 rounded-md bg-green-950 text-white hover:bg-green-800 transition hover:cursor-pointer"
              @click="closeBooking()"
            >
              Done
            </button>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useBookingStore } from '@/stores/booking.ts'

const bookingStore = useBookingStore()
const book = bookingStore.bookingObject

const props = defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'confirm'): void
}>()

const step = ref(1)
const name = computed({
  get: () => book.name ?? '',
  set: (val: string) => {
    book.name = val
  },
})

const email = computed({
  get: () => book.email ?? '',
  set: (val: string) => {
    book.email = val
  },
})

const contactNumber = computed({
  get: () => book.contactNumber ?? '',
  set: (val: string) => {
    book.contactNumber = val
  },
})

const showQRModal = ref(false)

const nameError = ref(false)
const emailError = ref(false)
const contactError = ref(false)

const validateAndProceed = () => {
  nameError.value = !name.value.trim()
  emailError.value = !email.value.trim()
  contactError.value = !contactNumber.value.trim()

  if (!nameError.value && !emailError.value && !contactError.value) {
    goToPayment()
  }
}

const formattedDate = computed(() => (book.date ? new Date(book.date).toLocaleDateString() : ''))

const simplifiedSlotRange = computed(() => {
  const start = book.startSlot
  const end = book.endSlot
  if (!start || !end) return ''
  return `${start.label.split(' - ')[0]} - ${end.label.split(' - ')[1]}`
})

const goToPayment = () => {
  step.value = 2
}

const goToSuccess = () => {
  step.value = 3
  finishBooking()
}

const finishBooking = () => {
  emit('confirm')
}

const closeBooking = () => {
  emit('close')
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}
</style>
