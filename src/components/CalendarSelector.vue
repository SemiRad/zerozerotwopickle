<template>
  <div class="flex justify-center items-center space-x-4 py-6">
    <div
      v-for="d in visibleDates"
      :key="d.toDateString()"
      @click="selectDate(d)"
      :class="[
        'flex flex-col rounded-2xl cursor-pointer transform transition-all duration-300',
        d.toDateString() === selectedDate.toDateString()
          ? 'bg-amber-100 h-48 w-40 shadow-xl scale-100'
          : 'bg-amber-100 h-32 w-28 scale-90',
      ]"
    >
      <div
        :class="[
          'h-1/3 flex justify-center items-center rounded-t-2xl w-full transition-all duration-1000',
          d.toDateString() === selectedDate.toDateString()
            ? 'bg-green-950 shadow-inner'
            : 'bg-green-900',
        ]"
      >
        <span
          class="font-souplings text-white transition-all duration-1000"
          :class="d.toDateString() === selectedDate.toDateString() ? 'text-2xl' : 'text-lg'"
        >
          {{ formatDate(d).day }}
        </span>
      </div>
      <div class="flex flex-col justify-center items-center flex-1">
        <span
          class="font-souplings text-green-950 transition-all duration-1000"
          :class="d.toDateString() === selectedDate.toDateString() ? 'text-4xl' : 'text-xl'"
        >
          {{ formatDate(d).month }}
        </span>
        <span
          class="font-souplings text-green-950 transition-all duration-1000"
          :class="d.toDateString() === selectedDate.toDateString() ? 'text-6xl' : 'text-2xl'"
        >
          {{ formatDate(d).date }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const today = new Date()
const selectedDate = ref(new Date(today))

const generateDates = () => {
  const dates: Date[] = []
  const start = new Date(today)
  start.setMonth(start.getMonth() - 1)

  const end = new Date(today)
  end.setMonth(end.getMonth() + 1)

  const d = new Date(start)
  while (d <= end) {
    dates.push(new Date(d))
    d.setDate(d.getDate() + 1)
  }
  return dates
}

const allDates = ref(generateDates())

const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']

const formatDate = (d: Date) => ({
  day: days[d.getDay()],
  month: months[d.getMonth()],
  date: d.getDate(),
})

const selectDate = (d: Date) => {
  selectedDate.value = d
  console.log(d.toDateString())
}

const visibleDates = computed(() => {
  const index = allDates.value.findIndex(
    (d) => d.toDateString() === selectedDate.value.toDateString(),
  )
  if (index === -1) return []

  const prev2 = index > 1 ? allDates.value[index - 2] : null
  const prev1 = index > 0 ? allDates.value[index - 1] : null
  const center = allDates.value[index]
  const next1 = index < allDates.value.length - 1 ? allDates.value[index + 1] : null
  const next2 = index < allDates.value.length - 2 ? allDates.value[index + 2] : null

  return [prev2, prev1, center, next1, next2].filter((d): d is Date => d !== null)
})
</script>
