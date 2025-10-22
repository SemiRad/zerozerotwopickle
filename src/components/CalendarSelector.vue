<template>
  <div class="flex flex-col justify-center items-center py-6 relative">
    <!-- Date Card -->
    <div
      class="bg-amber-100 h-48 w-40 rounded-2xl shadow-xl flex flex-col cursor-pointer"
      @click="toggleCalendar"
    >
      <div class="bg-green-950 h-1/3 rounded-t-2xl flex justify-center items-center shadow-inner">
        <span class="font-inter font-bold text-2xl text-white">{{ day }}</span>
      </div>
      <div class="flex flex-col justify-center items-center flex-1">
        <span class="font-inter text-4xl font-light text-green-950">{{ month }}</span>
        <span class="font-inter text-6xl font-bold text-green-950">{{ date }}</span>
      </div>
    </div>

    <!-- Calendar with fade transition -->
    <transition name="fade">
      <div
        v-if="showCalendar"
        class="absolute top-[100%] mt-0 bg-white rounded-xl shadow-lg border border-amber-200 p-4 z-10 w-80"
      >
        <!-- Header -->
        <div class="flex justify-between items-center mb-4">
          <button
            @click="prevMonth"
            class="px-3 py-1 bg-amber-100 rounded-lg hover:bg-amber-200 transition disabled:opacity-30 hover:cursor-pointer"
            :disabled="currentMonthIndex === 0"
          >
            ‹
          </button>
          <span class="font-inter font-bold text-green-950 text-xl">
            {{ months[currentMonth.getMonth()] }} {{ currentMonth.getFullYear() }}
          </span>
          <button
            @click="nextMonth"
            class="px-3 py-1 bg-amber-100 rounded-lg hover:bg-amber-200 transition disabled:opacity-30 hover:cursor-pointer"
            :disabled="currentMonthIndex === 1"
          >
            ›
          </button>
        </div>

        <!-- Days of week -->
        <div class="grid grid-cols-7 gap-3 text-center font-sans font-light text-green-900 mb-2">
          <span v-for="d in days" :key="d">{{ d }}</span>
        </div>

        <!-- Calendar dates -->
        <div class="grid grid-cols-7 gap-x-3 gap-y-1 text-center">
          <div
            v-for="(dayObj, i) in calendarDays"
            :key="i"
            :class="[
              'py-1 rounded-lg font-inter transition-colors duration-300',
              dayObj.isPlaceholder
                ? 'opacity-0'
                : isSameDate(dayObj.date, bookingStore.selectedDate)
                  ? 'bg-green-900 text-white'
                  : dayObj.disabled
                    ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                    : 'bg-amber-100 hover:bg-amber-200 text-green-950 cursor-pointer',
            ]"
            @click="!dayObj.disabled && !dayObj.isPlaceholder && selectDate(dayObj.date)"
          >
            <span v-if="!dayObj.isPlaceholder">{{ dayObj.date.getDate() }}</span>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useBookingStore } from '@/stores/Booking'

const bookingStore = useBookingStore()
const showCalendar = ref(false)

const toggleCalendar = () => (showCalendar.value = !showCalendar.value)

const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' }))
const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

const currentMonthIndex = ref(0)
const currentMonth = computed(() => {
  const d = new Date(today)
  d.setMonth(today.getMonth() + currentMonthIndex.value)
  return d
})

const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']

const day = computed(() => days[bookingStore.selectedDate.getDay()])
const month = computed(() => months[bookingStore.selectedDate.getMonth()])
const date = computed(() => bookingStore.selectedDate.getDate())

const calendarDays = computed(() => {
  const year = currentMonth.value.getFullYear()
  const month = currentMonth.value.getMonth()

  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth: { date: Date; disabled: boolean; isPlaceholder?: boolean }[] = []

  for (let i = 0; i < firstDay.getDay(); i++) {
    daysInMonth.push({ date: new Date(), disabled: true, isPlaceholder: true })
  }

  for (let i = 1; i <= lastDay.getDate(); i++) {
    const d = new Date(year, month, i)
    const disabled = d < today
    daysInMonth.push({ date: d, disabled })
  }

  return daysInMonth
})

const selectDate = (d: Date) => {
  bookingStore.selectedDate = d
  bookingStore.bookingObject.timeSlots = []
  bookingStore.bookingObject.totalPrice = 0
  showCalendar.value = false
}

const prevMonth = () => {
  if (currentMonthIndex.value > 0) currentMonthIndex.value--
}
const nextMonth = () => {
  if (currentMonthIndex.value < 1) currentMonthIndex.value++
}

const isSameDate = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate()
</script>

<style>
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
