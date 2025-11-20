<template>
  <div class="relative py-5 flex items-center">
    <h1
      class="absolute left-1/2 transform -translate-x-1/2 text-2xl font-bold uppercase text-secondary text-center"
    >
      Dashboard
    </h1>

    <button @click="signOut" class="ml-auto mr-5">
      <ArrowLeftOnRectangleIcon class="w-6 h-6 text-secondary" />
    </button>
  </div>

  <NotifyComponent target="admin" />
  <div class="admin-page p-6 font-inter">
    <!-- Buttons -->
    <div class="flex flex-row gap-4 my-4">
      <button
        class="flex items-center justify-center gap-1 bg-amber-100 px-3 py-1.5 rounded-2xl hover:bg-amber-200 cursor-pointer text-primary font-bold"
        @click="showManualBookingModal"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          class="w-4 h-4"
        >
          <path
            d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z"
          />
        </svg>
        <span class="text-xs leading-none uppercase">manual booking</span>
      </button>
      <button
        class="flex items-center justify-center gap-1 bg-amber-100 px-3 py-1.5 rounded-2xl hover:bg-amber-200 cursor-pointer text-primary font-bold"
        @click="showTimeExtensionModal"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          class="w-4 h-4"
        >
          <path
            d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z"
          />
        </svg>
        <span class="text-xs leading-none uppercase">set time extension</span>
      </button>
    </div>

    <!-- Loading/Error -->
    <!-- Skeleton Loader -->
    <div v-if="loading" class="relative overflow-x-auto shadow-2xl sm:rounded-lg table-scroll">
      <table class="min-w-full text-sm text-left">
        <thead class="text-xs uppercase bg-secondary text-primary text-center">
          <tr>
            <th class="px-6 py-3">Status</th>
            <th class="px-6 py-3">Date</th>
            <th class="px-6 py-3">Time Range</th>
            <th class="px-6 py-3">Name</th>
            <th class="px-6 py-3">Contact</th>
            <th class="px-6 py-3">Email</th>
            <th class="px-6 py-3">Total</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="i in 3" :key="'sk-' + i" class="animate-pulse bg-secondary">
            <td class="px-6 py-4">
              <div class="bg-gray-300 rounded h-4 w-16"></div>
            </td>

            <td class="px-6 py-4">
              <div class="bg-gray-300 rounded h-4 w-20"></div>
            </td>

            <td class="px-6 py-4">
              <div class="bg-gray-300 rounded h-4 w-24"></div>
            </td>

            <td class="px-6 py-4">
              <div class="bg-gray-300 rounded h-4 w-28"></div>
            </td>

            <td class="px-6 py-4">
              <div class="bg-gray-300 rounded h-4 w-24"></div>
            </td>

            <td class="px-6 py-4">
              <div class="bg-gray-300 rounded h-4 w-32"></div>
            </td>

            <td class="px-6 py-4">
              <div class="bg-gray-300 rounded h-4 w-12"></div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Table -->
    <div v-else class="relative overflow-x-auto shadow-2xl sm:rounded-lg table-scroll">
      <table class="min-w-full text-sm text-left">
        <thead class="text-xs uppercase bg-secondary text-primary text-center">
          <tr>
            <th
              class="px-6 py-3 whitespace-nowrap cursor-pointer select-none"
              @click="sort('status')"
            >
              <div class="flex items-center justify-center gap-1">
                Status
                <span v-if="sortKey === 'status'" class="text-xs text-primary">
                  {{ sortAsc ? '▲' : '▼' }}
                </span>
              </div>
            </th>
            <th
              class="px-6 py-3 whitespace-nowrap cursor-pointer select-none"
              @click="sort('date')"
            >
              <div class="flex items-center justify-center gap-1">
                Date
                <span v-if="sortKey === 'date'" class="text-xs text-primary">
                  {{ sortAsc ? '▲' : '▼' }}
                </span>
              </div>
            </th>
            <th
              class="px-6 py-3 whitespace-nowrap cursor-pointer select-none"
              @click="sort('timeRange')"
            >
              <div class="flex items-center justify-center gap-1">
                Time Range
                <span v-if="sortKey === 'timeRange'" class="text-xs text-primary">
                  {{ sortAsc ? '▲' : '▼' }}
                </span>
              </div>
            </th>
            <th class="px-6 py-3 whitespace-nowrap">Name</th>
            <th class="px-6 py-3 whitespace-nowrap">Contact</th>
            <th class="px-6 py-3 whitespace-nowrap">Email</th>
            <th class="px-6 py-3 whitespace-nowrap">Total</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="booking in sortedBookings"
            :key="booking.id"
            class="text-primary text-xs font-medium bg-secondary"
          >
            <td class="px-6 py-4 text-center">
              <template v-if="booking.status === 'pending'">
                <div class="rounded-4xl bg-amber-400">
                  <select
                    v-model="booking.status"
                    @change="handleStatusChange(booking, booking.status)"
                    class="px-2 py-1 rounded-4xl text-white border-none outline-none uppercase bg-transparent focus:outline-none cursor-pointer"
                  >
                    <option value="pending" class="text-black">Pending</option>
                    <option value="rejected" class="text-black">Reject</option>
                    <option value="reserved" class="text-black">Reserve</option>
                  </select>
                </div>
              </template>
              <template v-else>
                <div
                  :class="{
                    'bg-red-400': booking.status === 'rejected',
                    'bg-green-400': booking.status === 'reserved',
                  }"
                  class="px-2 py-1 rounded-4xl"
                >
                  <span class="text-white uppercase">
                    {{ booking.status ?? '-' }}
                  </span>
                </div>
              </template>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">{{ formatDate(booking.date) }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              {{ formatSlotRange(booking.startSlot, booking.endSlot) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">{{ booking.name ?? '-' }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ booking.contactNumber ?? '-' }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ booking.email ?? '-' }}</td>
            <td class="px-6 py-4 whitespace-nowrap">₱{{ booking.totalPrice ?? 0 }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="bookings.length === 0 && !loading" class="mt-4 text-secondary">
      No bookings found.
    </div>
  </div>

  <BookingStatusModal
    :show="statusModal"
    :newStatus="pendingStatus ?? ''"
    @close="closeStatusModal"
    @confirm="confirmStatus"
  />

  <ManualBooking
    :show="manualBookingModal"
    @close="closeManualBookingModal"
    @confirm="confirmManualBookingModal"
  />

  <TimeExtensionModal
    :show="timeExtensionModal"
    @close="closeTimeExtensionModal"
    @confirm="confirmTimeExtensionModal"
  />
</template>

<script setup lang="ts">
import NotifyComponent from '@/components/global/NotifyComponent.vue'
import BookingStatusModal from '@/components/admin/BookingStatusModal.vue'
import ManualBooking from '@/components/admin/ManualBooking.vue'

import { ArrowLeftOnRectangleIcon } from '@heroicons/vue/24/solid'
import { ref, onMounted, computed } from 'vue'
import type { BookingSlot, BookingObject } from '@/stores/booking'

import { useBookingStore } from '@/stores/booking'
import { useNotifyStore } from '@/stores/notify'
import { useRouter } from 'vue-router'
import TimeExtensionModal from '@/components/admin/TimeExtensionModal.vue'

import { supabase } from '../lib/supabase'

export type BookingRecord = BookingObject & {
  id: number
  email: string | null
  status: string | null
}

const bookings = ref<BookingRecord[]>([])
const selectedBooking = ref<BookingRecord | null>(null)

const error = ref<string | null>(null)
const pendingStatus = ref<string | null>(null)

const loading = ref(true)
const statusModal = ref(false)
const manualBookingModal = ref(false)
const timeExtensionModal = ref(false)

const router = useRouter()
const bookingStore = useBookingStore()
const notify = useNotifyStore()
const sortKey = ref<'status' | 'date' | 'timeRange' | null>(null)
const sortAsc = ref(true)

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
    notify.notify(
      err instanceof Error ? err.message : 'Unknown error fetching bookings',
      'error',
      'admin',
    )
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

// Sorting function
const sort = (key: 'status' | 'date' | 'timeRange') => {
  if (sortKey.value === key) {
    sortAsc.value = !sortAsc.value
  } else {
    sortKey.value = key
    sortAsc.value = true
  }
}

const sortedBookings = computed(() => {
  if (!sortKey.value) return bookings.value
  return [...bookings.value].sort((a, b) => {
    let valA: string | number = ''
    let valB: string | number = ''

    switch (sortKey.value) {
      case 'status':
        valA = a.status ?? ''
        valB = b.status ?? ''
        break
      case 'date':
        valA = a.date ? new Date(a.date).getTime() : 0
        valB = b.date ? new Date(b.date).getTime() : 0
        break
      case 'timeRange':
        valA = a.startSlot?.start || 0
        valB = b.startSlot?.start || 0
        break
    }

    if (valA < valB) return sortAsc.value ? -1 : 1
    if (valA > valB) return sortAsc.value ? 1 : -1
    return 0
  })
})

onMounted(fetchBookings)

// --- Booking Status Handling ---
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
    statusModal.value = false
    try {
      await updateBookingStatus(selectedBooking.value, pendingStatus.value)
      selectedBooking.value.status = pendingStatus.value
      notify.notify('Booking successfully updated!', 'success', 'admin')
    } catch (err: unknown) {
      notify.notify('Failed to update booking status.', 'error', 'admin')
      console.error('Error confirming status:', err)
    }
  }
  selectedBooking.value = null
  pendingStatus.value = null
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

// --- Manual Booking Handling ---
const showManualBookingModal = () => {
  manualBookingModal.value = true
}

const closeManualBookingModal = () => {
  manualBookingModal.value = false
}

const confirmManualBookingModal = async () => {
  closeManualBookingModal()
  try {
    await bookingStore.confirmManualBooking()
    notify.notify('Booking successfully submitted!', 'success', 'admin')
    await fetchBookings()
  } catch (err: unknown) {
    notify.notify('Manual booking failed.', 'error', 'admin')
    console.error('Booking failed:', err)
  }
}

// --- Time Extension Handling ---
const showTimeExtensionModal = () => {
  timeExtensionModal.value = true
}

const closeTimeExtensionModal = () => {
  timeExtensionModal.value = false
}

const confirmTimeExtensionModal = () => {
  timeExtensionModal.value = false
  console.log('placeholder for confirm')
}

const signOut = async () => {
  await supabase.auth.signOut().then(() => router.push('/login'))
}
</script>

<style scoped>
.admin-page {
  max-width: 1100px;
  margin: 0 auto;
}

.table-scroll::-webkit-scrollbar {
  height: 3px;
}

.table-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.table-scroll::-webkit-scrollbar-thumb {
  background: #c5c5c5;
  border-radius: 10px;
}

.table-scroll::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
