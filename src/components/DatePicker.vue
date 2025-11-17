<template>
  <div class="relative w-full">
    <!-- Input styled like your modal fields -->
    <div class="space-y-1">
      <label class="block text-sm text-gray-700">Date</label>

      <div
        class="w-full border rounded-md px-3 py-2 cursor-pointer flex items-center focus:outline-none focus:ring-2 focus:ring-green-950 focus:border-green-950 transition-colors border-gray-300"
        @click="toggleCalendar"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.8"
          stroke="currentColor"
          class="w-5 h-5 text-green-950 mr-3"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2
         2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z"
          />
        </svg>

        <span>{{ formattedDate || 'Select Date' }}</span>
      </div>
    </div>

    <!-- Calendar -->
    <transition name="fade">
      <div
        v-if="showCalendar"
        class="absolute mt-2 bg-white rounded-xl shadow-lg border border-amber-200 p-4 z-50 w-72"
      >
        <!-- Header -->
        <div class="flex justify-between items-center mb-4">
          <button
            @click="prevMonth"
            class="px-2 py-1 bg-amber-100 rounded-lg hover:bg-amber-200 transition"
          >
            ‹
          </button>

          <span class="font-inter font-bold text-lg text-green-950">
            {{ months[currentMonth.getMonth()] }} {{ currentMonth.getFullYear() }}
          </span>

          <button
            @click="nextMonth"
            class="px-2 py-1 bg-amber-100 rounded-lg hover:bg-amber-200 transition"
          >
            ›
          </button>
        </div>

        <!-- Days of week -->
        <div class="grid grid-cols-7 gap-1 text-center font-light text-xs text-green-900 mb-2">
          <span v-for="d in days" :key="d">{{ d }}</span>
        </div>

        <!-- Dates -->
        <div class="grid grid-cols-7 gap-1 text-center">
          <div
            v-for="(dayObj, i) in calendarDays"
            :key="i"
            :class="[
              'py-2 rounded-lg font-inter transition text-sm',
              dayObj.placeholder
                ? 'opacity-0'
                : book.date && isSameDate(dayObj.date, book.date)
                  ? 'bg-green-900 text-white'
                  : 'bg-amber-100 hover:bg-amber-200 text-green-950 cursor-pointer',
            ]"
            @click="!dayObj.placeholder && selectDate(dayObj.date)"
          >
            <span v-if="!dayObj.placeholder">{{ dayObj.date.getDate() }}</span>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useBookingStore } from '@/stores/booking.ts'

const bookingStore = useBookingStore()
const book = bookingStore.bookingObject

const showCalendar = ref(false)

const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']

const currentMonth = ref(new Date())

const toggleCalendar = () => {
  showCalendar.value = !showCalendar.value
}

const prevMonth = () => {
  const d = new Date(currentMonth.value)
  d.setMonth(d.getMonth() - 1)
  currentMonth.value = d
}

const nextMonth = () => {
  const d = new Date(currentMonth.value)
  d.setMonth(d.getMonth() + 1)
  currentMonth.value = d
}

const calendarDays = computed(() => {
  const year = currentMonth.value.getFullYear()
  const month = currentMonth.value.getMonth()

  const first = new Date(year, month, 1)
  const last = new Date(year, month + 1, 0)

  const daysArr: { date: Date; placeholder?: boolean }[] = []

  // Placeholders
  for (let i = 0; i < first.getDay(); i++) {
    daysArr.push({ date: new Date(), placeholder: true })
  }

  // Real days
  for (let d = 1; d <= last.getDate(); d++) {
    daysArr.push({ date: new Date(year, month, d) })
  }

  return daysArr
})

const formattedDate = computed(() => {
  if (!book.date) return ''
  const y = book.date.getFullYear()
  const m = String(book.date.getMonth() + 1).padStart(2, '0')
  const d = String(book.date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
})

const selectDate = (date: Date) => {
  book.date = date
  showCalendar.value = false
}

const isSameDate = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate()
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
