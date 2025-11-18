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
  id: number | null
  date: Date
  startSlot: BookingSlot | null
  endSlot: BookingSlot | null
  totalPrice: number
  name: string | null
  email: string | null
  contactNumber: string | null
  status?: string | null
}

export type ApiBookingObject = {
  start_slot: { start: number }
  end_slot: { end: number }
}

export const useBookingStore = defineStore('booking', () => {
  const loadingBookedSlots = ref(false)
  const selectedDate = ref<Date>(new Date())
  const bookedSlots = ref<ApiBookingObject[]>([])

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

  const defaultBookingObject = () => ({
    id: null,
    date: selectedDate.value,
    startSlot: null,
    endSlot: null,
    totalPrice: 0,
    name: null,
    email: null,
    contactNumber: null,
    status: null,
  })

  const bookingObject = ref<BookingObject>(defaultBookingObject())

  const timeRangeLabel = computed(() => {
    if (!bookingObject.value.startSlot || !bookingObject.value.endSlot) return '-'
    const startLabel = bookingObject.value.startSlot.label.split(' - ')[0]
    const endLabel = bookingObject.value.endSlot.endLabel
    return `${startLabel} - ${endLabel}`
  })

  const resetBookingObject = () => {
    bookingObject.value = defaultBookingObject()
  }

  const confirmBooking = async () => {
    const year = bookingObject.value.date.getFullYear()
    const month = (bookingObject.value.date.getMonth() + 1).toString().padStart(2, '0')
    const day = bookingObject.value.date.getDate().toString().padStart(2, '0')
    const formattedDateLocal = `${year}-${month}-${day}`

    const payload = {
      ...bookingObject.value,
      date: formattedDateLocal,
      status: 'pending',
    }

    try {
      const response = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const result = await response.json()
      return result
    } catch (err) {
      console.error('Error sending booking:', err)
      throw err
    }
  }

  const confirmManualBooking = async () => {
    const year = bookingObject.value.date.getFullYear()
    const month = (bookingObject.value.date.getMonth() + 1).toString().padStart(2, '0')
    const day = bookingObject.value.date.getDate().toString().padStart(2, '0')
    const formattedDateLocal = `${year}-${month}-${day}`

    const payload = {
      ...bookingObject.value,
      date: formattedDateLocal,
      status: 'reserved',
    }

    try {
      const response = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const result = await response.json()
      return result
    } catch (err) {
      console.error('Error sending manual booking:', err)
      throw err
    }
  }

  const fetchBookedSlots = async () => {
    loadingBookedSlots.value = true

    const year = selectedDate.value.getFullYear()
    const month = (selectedDate.value.getMonth() + 1).toString().padStart(2, '0')
    const day = selectedDate.value.getDate().toString().padStart(2, '0')
    const formattedDate = `${year}-${month}-${day}`

    try {
      const res = await fetch(`/api/booking?date=${formattedDate}`)
      bookedSlots.value = await res.json()
    } catch (err) {
      console.error('Error fetching booked slots:', err)
      bookedSlots.value = []
    } finally {
      loadingBookedSlots.value = false
    }
  }

  const bookedSlotHours = computed(() => {
    const hours: number[] = []

    bookedSlots.value.forEach((b) => {
      if (!b.start_slot || !b.end_slot) return

      for (let h = b.start_slot.start; h < b.end_slot.end; h++) {
        hours.push(h)
      }
    })

    return hours
  })

  return {
    selectedDate,
    allSlots,
    availableSlots,
    defaultBookingObject,
    bookingObject,
    timeRangeLabel,
    resetBookingObject,
    confirmBooking,
    confirmManualBooking,
    fetchBookedSlots,
    bookedSlotHours,
    loadingBookedSlots
  }
})
