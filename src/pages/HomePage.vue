<template>
  <NotifyComponent target="home" />

  <div class="grid grid-cols-1 lg:grid-cols-2 mb-4 p-5">
    <div>
      <div class="flex justify-center">
        <Calendar />
      </div>
      <div class="flex justify-center">
        <Time />
      </div>
    </div>

    <div class="flex flex-col">
      <ImageCarousel />

      <!-- Sticky bottom bar for mobile -->
      <div class="fixed bottom-0 left-0 z-50 w-full lg:static">
        <div class="bg-gray-100 w-full lg:bg-transparent lg:p-2.5 p-0">
          <BookingButton :bookingObject="bookingStore.bookingObject" @book="openModal" />
        </div>
      </div>
    </div>
  </div>

  <Transition name="fade">
    <BookingModal
      v-if="showModal"
      :show="showModal"
      :bookingData="bookingStore.bookingObject"
      @close="closeModal"
      @confirm="confirmBookingHandler"
    />
  </Transition>
</template>

<script setup lang="ts">
import Calendar from '@/components/home/CalendarSelector.vue'
import ImageCarousel from '@/components/home/ImageCarousel.vue'
import BookingButton from '@/components/home/BookingButton.vue'
import Time from '@/components/home/TimeSelector.vue'
import BookingModal from '@/components/home/BookingModal.vue'

import { useBookingStore } from '@/stores/booking'
import { useNotifyStore } from '@/stores/notify'

import { ref } from 'vue'
import NotifyComponent from '@/components/global/NotifyComponent.vue'

const showModal = ref(false)
const bookingStore = useBookingStore()
const notify = useNotifyStore()

const openModal = () => {
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  clearBooking()
}

const clearBooking = () => {
  bookingStore.resetBookingObject()
}

const confirmBookingHandler = async () => {
  try {
    await bookingStore
      .confirmBooking()
      .then(() => notify.notify('Booking successfully submitted!', 'success', 'home'))
      .then(() => bookingStore.fetchBookedSlots())
  } catch (err) {
    notify.notify('Booking failed. Please try again.', 'error', 'home')
    console.error('Booking failed:', err)
  }
}
</script>
