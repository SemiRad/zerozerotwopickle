<template>
  <ErrorAlert />

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
      @confirm="confirmBooking"
    />
  </Transition>
</template>

<script setup lang="ts">
import Calendar from '@/components/CalendarSelector.vue'
import ImageCarousel from '@/components/ImageCarousel.vue'
import BookingButton from '@/components/BookingButton.vue'
import Time from '@/components/TimeSelector.vue'
import ErrorAlert from '@/components/ErrorAlert.vue'
import BookingModal from '@/components/BookingModal.vue'
import { useBookingStore } from '@/stores/booking'
import { ref } from 'vue'

const showModal = ref(false)
const bookingStore = useBookingStore()

const openModal = () => {
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const confirmBooking = () => {
  showModal.value = false
}
</script>
