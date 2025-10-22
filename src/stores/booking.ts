import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export type BookingSlot = {
  start: number
  end: number
  label: string
  endLabel: string
  cost: number
}

export type BookingObject = {
  date: Date
  timeSlots: BookingSlot[]
  totalPrice: number
  name: string | null
  contactNumber: string | null
}

export const useBookingStore = defineStore('booking', () => {
  const selectedDate = ref<Date>(new Date())

  const allSlots = ref<BookingSlot[]>([])
  for (let hour = 6; hour < 24; hour++) {
    const cost = hour < 16 ? 150 : hour < 22 ? 200 : 250
    const label = `${hour % 12 === 0 ? 12 : hour % 12}:00 ${hour >= 12 ? 'PM' : 'AM'}`
    const endLabel = `${(hour + 1) % 12 === 0 ? 12 : (hour + 1) % 12}:00 ${
      hour + 1 >= 12 ? 'PM' : 'AM'
    }`
    allSlots.value.push({
      start: hour,
      end: hour + 1,
      label: `${label} - ${endLabel}`,
      endLabel,
      cost,
    })
  }

  const availableSlots = computed(() => {
    const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' }))
    const isToday =
      selectedDate.value.getFullYear() === now.getFullYear() &&
      selectedDate.value.getMonth() === now.getMonth() &&
      selectedDate.value.getDate() === now.getDate()

    if (isToday) {
      const currentHour = now.getHours()
      return allSlots.value.filter((slot) => slot.start > currentHour)
    }

    return allSlots.value
  })

  const bookingObject = ref<BookingObject>({
    date: selectedDate.value,
    timeSlots: [],
    totalPrice: 0,
    name: null,
    contactNumber: null,
  })

  return {
    selectedDate,
    allSlots,
    availableSlots,
    bookingObject,
  }
})
