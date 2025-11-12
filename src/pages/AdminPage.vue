<template>
  <div class="admin-page p-6 font-inter">
    <h1 class="text-2xl font-bold mb-2 uppercase">Dashboard</h1>
    <p class="mb-6 text-gray-600">Welcome to the admin area.</p>

    <div v-if="loading" class="text-gray-500">Loading...</div>
    <div v-else-if="error" class="text-red-600">{{ error }}</div>

    <div v-else class="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table class="min-w-full text-sm text-left">
        <thead class="text-xs uppercase bg-green-950 text-white text-center">
          <tr>
            <th scope="col" class="px-6 py-3 whitespace-nowrap">Date</th>
            <th scope="col" class="px-6 py-3 whitespace-nowrap">Time Range</th>
            <th scope="col" class="px-6 py-3 whitespace-nowrap">Name</th>
            <th scope="col" class="px-6 py-3 whitespace-nowrap">Contact</th>
            <th scope="col" class="px-6 py-3 whitespace-nowrap">Email</th>
            <th scope="col" class="px-6 py-3 whitespace-nowrap">Total</th>
            <th scope="col" class="px-6 py-3 whitespace-nowrap">Status</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="booking in bookings"
            :key="booking.id"
            class="bg-amber-100 text-green-900 text-xs font-medium"
          >
            <td class="px-6 py-4 whitespace-nowrap">{{ formatDate(booking.date) }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              {{ formatSlotRange(booking.startSlot, booking.endSlot) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">{{ booking.name ?? '-' }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ booking.contactNumber ?? '-' }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ booking.email ?? '-' }}</td>
            <td class="px-6 py-4 whitespace-nowrap">₱{{ booking.totalPrice ?? 0 }}</td>
            <td class="px-6 py-4 text-center">
              <template v-if="booking.status === 'pending'">
                <select
                  v-model="booking.status"
                  @change="handleStatusChange(booking, booking.status)"
                  class="px-2 py-1 rounded-4xl text-white border-none outline-none uppercase bg-amber-400 focus:outline-none cursor-pointer"
                >
                  <option value="pending" class="text-white">Pending</option>
                  <option value="rejected" class="text-white">Reject</option>
                  <option value="reserved" class="text-white">Reserve</option>
                </select>
              </template>
              <template v-else>
                <span
                  class="px-2 py-1 rounded-4xl text-white uppercase"
                  :class="{
                    'bg-red-400': booking.status === 'rejected',
                    'bg-green-400': booking.status === 'reserved',
                  }"
                >
                  {{ booking.status ?? '-' }}
                </span>
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="bookings.length === 0 && !loading" class="mt-4 text-gray-600">
      No bookings found.
    </div>
  </div>

  <BookingStatusModal
    :show="statusModal"
    :newStatus="pendingStatus ?? ''"
    @close="closeStatusModal"
    @confirm="confirmStatus"
  />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { BookingSlot, BookingObject } from '@/stores/booking'
import BookingStatusModal from '@/components/BookingConfirmationModal.vue'

export type BookingRecord = BookingObject & {
  id: number
  email: string | null
  status: string | null
}

const bookings = ref<BookingRecord[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const statusModal = ref(false)
const selectedBooking = ref<BookingRecord | null>(null)
const pendingStatus = ref<string | null>(null)

interface RawBooking {
  id: number
  date: string
  start_slot: string | BookingSlot | null
  end_slot: string | BookingSlot | null
  total_price: number | string
  name: string | null
  contact_number: string | null
  email: string | null
  status: string | null
}

function parseBooking(raw: RawBooking): BookingRecord {
  return {
    id: raw.id,
    date: new Date(raw.date),
    startSlot: typeof raw.start_slot === 'string' ? JSON.parse(raw.start_slot) : raw.start_slot,
    endSlot: typeof raw.end_slot === 'string' ? JSON.parse(raw.end_slot) : raw.end_slot,
    totalPrice: Number(raw.total_price) || 0,
    name: raw.name,
    contactNumber: raw.contact_number,
    email: raw.email,
    status: raw.status,
  }
}

const fetchBookings = async () => {
  loading.value = true
  error.value = null
  try {
    const res = await fetch('/api/book')
    if (!res.ok) throw new Error(`Failed to fetch bookings (${res.status})`)
    const rawData = await res.json()
    bookings.value = rawData.map(parseBooking)
  } catch (err: unknown) {
    error.value = err instanceof Error ? err.message : 'Unknown error fetching bookings'
  } finally {
    loading.value = false
  }
}

function formatDate(date: Date | string | null | undefined) {
  if (!date) return '-'
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' })
}

function formatSlotRange(start: BookingSlot | null, end: BookingSlot | null) {
  if (!start || !end) return '-'
  return `${start.label.split(' - ')[0]} - ${end.endLabel}`
}

onMounted(fetchBookings)

const handleStatusChange = (booking: BookingRecord, newStatus: string) => {
  pendingStatus.value = newStatus
  selectedBooking.value = booking
  statusModal.value = true
}

const closeStatusModal = () => {
  if (selectedBooking.value) selectedBooking.value.status = 'pending'
  selectedBooking.value = null
  pendingStatus.value = null
  statusModal.value = false
}

const confirmStatus = async () => {
  if (selectedBooking.value && pendingStatus.value) {
    try {
      await updateBookingStatus(selectedBooking.value, pendingStatus.value)
      selectedBooking.value.status = pendingStatus.value
      console.log(`Booking ${selectedBooking.value.id} changed to: ${pendingStatus.value}`)
    } catch (err) {
      console.error('Error confirming status:', err)
    }
  }
  selectedBooking.value = null
  pendingStatus.value = null
  statusModal.value = false
}

const updateBookingStatus = async (booking: BookingRecord, newStatus: string) => {
  const response = await fetch(`/api/book/${booking.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: newStatus }),
  })
  if (!response.ok) throw new Error(`Failed to update status (${response.status})`)
  return await response.json()
}
</script>

<style scoped>
.admin-page {
  max-width: 1100px;
  margin: 0 auto;
}
</style>
