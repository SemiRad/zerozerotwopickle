<template>
  <ErrorAlert />

  <!-- <div class="flex justify-center mb-4">
    <img src="/zzt0.png" class="w-16 md:w-32 lg:w-48 drop-shadow-4xl" />
  </div> -->

  <div class="grid grid-cols-1 lg:grid-cols-2 mb-4 p-5 bg-gray-100">
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
      <BookingButton @book="openModal" />
    </div>
  </div>

  <Transition name="fade">
    <BookingModal
      v-if="showModal"
      :show="showModal"
      :bookingData="bookingData"
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
import type { BookingObject } from '@/stores/booking'
import { ref } from 'vue'

const showModal = ref(false)
const bookingData = ref<BookingObject | null>(null)

const openModal = (data: BookingObject) => {
  bookingData.value = data
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const confirmBooking = (data: BookingObject) => {
  console.log('Confirmed booking:', data)
  showModal.value = false
}
</script>

<style lang="css" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
