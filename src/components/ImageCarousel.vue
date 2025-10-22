<template>
  <div class="w-full flex flex-col items-center lg:p-5">
    <div class="h-full w-full lg:w-3/4 relative overflow-hidden rounded-2xl">
      <!-- Carousel Images -->
      <div
        class="h-full w-full flex transition-transform duration-500"
        :style="{ transform: `translateX(-${currentSlide * 100}%)` }"
      >
        <div
          v-for="(img, index) in images"
          :key="index"
          class="flex-shrink-0 w-full h-full overflow-hidden"
        >
          <img
            :src="img"
            class="w-full h-full object-cover transition-transform duration-500 ease-in-out transform hover:scale-105"
          />
        </div>
      </div>

      <!-- Previous Button (hidden on small screens) -->
      <button
        v-if="!isMobile"
        @click="prevSlide"
        class="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded"
      >
        ‹
      </button>

      <!-- Next Button (hidden on small screens) -->
      <button
        v-if="!isMobile"
        @click="nextSlide"
        class="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded"
      >
        ›
      </button>

      <!-- Dots -->
      <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        <span
          v-for="(img, index) in images"
          :key="index"
          @click="goToSlide(index)"
          :class="[
            'w-3 h-3 rounded-full cursor-pointer',
            currentSlide === index ? 'bg-green-950' : 'bg-gray-400',
          ]"
        ></span>
      </div>
    </div>

    <div class="font-inter w-full sm:w-3/4 mt-5 mb-20 lg:mb-0 flex flex-col items-center">
      <div
        class="text-3xl sm:text-4xl md:text-4xl font-bold tracking-wide uppercase text-green-950 text-center"
      >
        Pickleball Court
      </div>
      <div class="mt-2.5"><MapPinIcon class="w-6 h-6 text-gray-300" /></div>

      <!-- Mobile: vertical column, center items -->
      <div
        class="flex flex-col sm:flex-row mt-5 gap-2.5 items-center sm:items-start sm:justify-start"
      >
        <div
          class="w-fit bg-amber-100 px-5 py-0.5 text-xs rounded-xl shadow-md hover:shadow-lg transition-all duration-300 ease-in-out cursor-pointer hover:bg-amber-300 text-center"
        >
          House Rules
        </div>
        <div
          class="w-fit bg-amber-100 px-5 py-0.5 text-xs rounded-xl shadow-md hover:shadow-lg transition-all duration-300 ease-in-out cursor-pointer hover:bg-amber-300 text-center"
        >
          Terms & Conditions
        </div>
        <div
          class="w-fit bg-amber-100 px-5 py-0.5 text-xs rounded-xl shadow-md hover:shadow-lg transition-all duration-300 ease-in-out cursor-pointer hover:bg-amber-300 text-center"
        >
          FAQs
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { MapPinIcon } from '@heroicons/vue/24/solid'

const images = ['/court1.JPG', '/court2.JPG', '/court3.JPG', '/court4.JPG']
const currentSlide = ref(0)

// Detect mobile size
const isMobile = computed(() => window.innerWidth <= 640)

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % images.length
}

const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + images.length) % images.length
}

const goToSlide = (index: number) => {
  currentSlide.value = index
}

// Auto-slide
onMounted(() => {
  setInterval(() => {
    nextSlide()
  }, 5000)
})
</script>
