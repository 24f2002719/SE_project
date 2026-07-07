<template>
  <PortalLayout>
    <div class="space-y-gutter">
      <!-- Title -->
      <header class="flex justify-between items-end border-b border-outline-variant pb-sm">
        <div>
          <h1 class="font-display-lg text-display-lg font-bold text-primary tracking-tight">Facility Booking</h1>
          <p class="font-body-lg text-body-lg text-on-surface-variant">Reserve courts and training halls in real-time.</p>
        </div>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        <!-- Booking form (Span 4) -->
        <div class="lg:col-span-4 bg-white border border-outline-variant rounded-xl p-md shadow-sm h-fit">
          <h2 class="font-headline-sm text-sm font-bold text-primary mb-md border-b border-outline-variant pb-sm flex items-center gap-xs">
            <span class="material-symbols-outlined text-secondary">book_online</span>
            Reserve a Slot
          </h2>

          <div v-if="feedback" :class="[feedback.success ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800']" class="p-sm border rounded-lg mb-md flex gap-2 items-start text-xs font-semibold">
            <span class="material-symbols-outlined text-sm mt-0.5">{{ feedback.success ? 'check_circle' : 'error' }}</span>
            <span>{{ feedback.message }}</span>
          </div>

          <form @submit.prevent="handleBooking" class="space-y-md">
            <!-- Facility selection -->
            <div class="space-y-1">
              <label class="block font-label-bold text-xs text-on-surface-variant">Select Court</label>
              <select v-model="form.courtId" class="w-full bg-slate-50 border border-outline-variant rounded px-3 py-2.5 font-body-sm outline-none focus:border-primary" required>
                <option v-for="c in store.courts" :key="c.id" :value="c.id">
                  {{ c.name }} ({{ c.status }})
                </option>
              </select>
            </div>

            <!-- Date -->
            <div class="space-y-1">
              <label class="block font-label-bold text-xs text-on-surface-variant">Booking Date</label>
              <input v-model="form.date" type="date" class="w-full bg-slate-50 border border-outline-variant rounded px-3 py-2.5 font-body-sm outline-none focus:border-primary" required />
            </div>

            <!-- Time Slots -->
            <div class="grid grid-cols-2 gap-sm">
              <div class="space-y-1">
                <label class="block font-label-bold text-xs text-on-surface-variant">Start Time</label>
                <input v-model="form.startTime" type="time" class="w-full bg-slate-50 border border-outline-variant rounded px-3 py-2.5 font-body-sm outline-none focus:border-primary" required />
              </div>
              <div class="space-y-1">
                <label class="block font-label-bold text-xs text-on-surface-variant">End Time</label>
                <input v-model="form.endTime" type="time" class="w-full bg-slate-50 border border-outline-variant rounded px-3 py-2.5 font-body-sm outline-none focus:border-primary" required />
              </div>
            </div>

            <button 
              type="submit" 
              class="w-full bg-secondary text-on-secondary font-label-bold text-label-bold py-3 rounded hover:bg-secondary-container transition-colors shadow-sm mt-md"
            >
              Confirm Reservation
            </button>
          </form>
        </div>

        <!-- Visual Slot Grid & My Bookings (Span 8) -->
        <div class="lg:col-span-8 space-y-gutter">
          
          <!-- Visual Time Slots Calendar Grid -->
          <div class="bg-white border border-outline-variant rounded-xl p-md shadow-sm">
            <div class="flex justify-between items-center mb-md pb-sm border-b border-outline-variant">
              <h2 class="font-headline-sm text-sm font-bold text-primary flex items-center gap-xs">
                <span class="material-symbols-outlined text-secondary">calendar_view_day</span>
                Visual Slots Calendar: {{ getCourtName(form.courtId) }}
              </h2>
              <span class="text-xs font-semibold bg-slate-100 text-on-surface-variant px-2.5 py-0.5 rounded-full">{{ form.date }}</span>
            </div>

            <!-- Time slots grid -->
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-sm">
              <div 
                v-for="slot in hourlySlots" 
                :key="slot.start"
                :class="[
                  slot.booked ? 'border-red-200 bg-red-50/20' : 
                  (form.startTime === slot.start && form.endTime === slot.end) ? 'border-secondary bg-secondary-fixed/10 ring-2 ring-secondary' : 'border-outline-variant hover:bg-slate-50/50'
                ]"
                class="border rounded-lg p-sm transition-all flex flex-col justify-between min-h-[96px] relative"
              >
                <div>
                  <p class="font-bold text-xs text-primary">{{ slot.label }}</p>
                  <p class="text-[10px] text-on-surface-variant mt-0.5">
                    {{ slot.booked ? 'Booked' : 'Available' }}
                  </p>
                </div>

                <div class="mt-sm flex justify-between items-center w-full">
                  <span v-if="slot.booked" class="text-[9px] text-red-700 truncate max-w-[80px]" :title="'Reserved by ' + slot.bookedBy">
                    By: {{ slot.bookedBy }}
                  </span>
                  
                  <!-- Select or Notify button -->
                  <button 
                    v-if="!slot.booked" 
                    @click="selectSlot(slot)"
                    class="text-secondary font-label-bold text-[10px] hover:underline"
                  >
                    Select Slot
                  </button>
                  <button 
                    v-else 
                    @click="notifyCancel(slot)"
                    class="text-primary font-label-bold text-[10px] hover:underline flex items-center gap-0.5"
                  >
                    <span class="material-symbols-outlined text-xs">notifications</span>
                    {{ isSubscribed(slot) ? 'Subscribed' : 'Notify Me' }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- My Bookings list -->
          <div class="bg-white border border-outline-variant rounded-xl p-md shadow-sm">
            <h2 class="font-headline-sm text-sm font-bold text-primary mb-md pb-sm border-b border-outline-variant flex items-center gap-xs">
              <span class="material-symbols-outlined text-secondary">history</span>
              My Reservations History
            </h2>

            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="border-b border-outline-variant font-label-bold text-label-bold text-xs text-on-surface-variant bg-slate-50">
                    <th class="p-3">Booking ID</th>
                    <th class="p-3">Court</th>
                    <th class="p-3">Date</th>
                    <th class="p-3">Time</th>
                    <th class="p-3">Status</th>
                    <th class="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody class="text-xs font-body-sm">
                  <tr 
                    v-for="b in myBookings" 
                    :key="b.id" 
                    class="border-b border-outline-variant/30 hover:bg-slate-50/50"
                  >
                    <td class="p-3 font-mono font-semibold">{{ b.id }}</td>
                    <td class="p-3">{{ getCourtName(b.courtId) }}</td>
                    <td class="p-3">{{ b.date }}</td>
                    <td class="p-3">{{ b.startTime }} - {{ b.endTime }}</td>
                    <td class="p-3">
                      <span class="px-2 py-0.5 rounded bg-green-100 text-green-800 text-[9px] font-bold">
                        {{ b.status }}
                      </span>
                    </td>
                    <td class="p-3 text-right">
                      <button 
                        @click="handleCancel(b.id)"
                        class="text-error font-label-bold text-xs hover:underline flex items-center gap-0.5 justify-end ml-auto"
                      >
                        <span class="material-symbols-outlined text-sm">delete</span> Cancel
                      </button>
                    </td>
                  </tr>
                  <tr v-if="myBookings.length === 0">
                    <td colspan="6" class="p-4 text-center text-on-surface-variant">No active reservations found.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  </PortalLayout>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import PortalLayout from '../../layouts/PortalLayout.vue'
import { useClubStore } from '../../stores/clubStore'

const store = useClubStore()

const feedback = ref(null)
const subscribedSlots = ref([])

const form = reactive({
  courtId: 'badminton-a',
  date: new Date().toISOString().split('T')[0],
  startTime: '16:00',
  endTime: '17:00'
})

const myBookings = computed(() => {
  if (!store.currentUser) return []
  return store.bookings.filter(b => b.userEmail === store.currentUser.email)
})

const getCourtName = (id) => {
  const court = store.courts.find(c => c.id === id)
  return court ? court.name : id
}

// Generate hourly slots from 08:00 to 22:00
const hourlySlots = computed(() => {
  const slots = [
    { label: '08:00 - 09:00', start: '08:00', end: '09:00' },
    { label: '09:00 - 10:00', start: '09:00', end: '10:00' },
    { label: '10:00 - 11:00', start: '10:00', end: '11:00' },
    { label: '11:00 - 12:00', start: '11:00', end: '12:00' },
    { label: '12:00 - 13:00', start: '12:00', end: '13:00' },
    { label: '13:00 - 14:00', start: '13:00', end: '14:00' },
    { label: '14:00 - 15:00', start: '14:00', end: '15:00' },
    { label: '15:00 - 16:00', start: '15:00', end: '16:00' },
    { label: '16:00 - 17:00', start: '16:00', end: '17:00' },
    { label: '17:00 - 18:00', start: '17:00', end: '18:00' },
    { label: '18:00 - 19:00', start: '18:00', end: '19:00' },
    { label: '19:00 - 20:00', start: '19:00', end: '20:00' },
    { label: '20:00 - 21:00', start: '20:00', end: '21:00' },
    { label: '21:00 - 22:00', start: '21:00', end: '22:00' }
  ]

  // Check bookings for conflicts
  return slots.map(slot => {
    const booking = store.bookings.find(b => 
      b.courtId === form.courtId &&
      b.date === form.date &&
      b.status !== 'Declined' &&
      ((slot.start >= b.startTime && slot.start < b.endTime) ||
       (slot.end > b.startTime && slot.end <= b.endTime) ||
       (slot.start <= b.startTime && slot.end >= b.endTime))
    )
    return {
      ...slot,
      booked: !!booking,
      bookedBy: booking ? booking.userName : ''
    }
  })
})

const selectSlot = (slot) => {
  form.startTime = slot.start
  form.endTime = slot.end
}

const isSubscribed = (slot) => {
  const key = `${form.courtId}-${form.date}-${slot.start}`
  return subscribedSlots.value.includes(key)
}

const notifyCancel = (slot) => {
  const key = `${form.courtId}-${form.date}-${slot.start}`
  if (!subscribedSlots.value.includes(key)) {
    subscribedSlots.value.push(key)
    alert(`You will be notified immediately if the ${slot.label} slot for ${getCourtName(form.courtId)} on ${form.date} gets cancelled!`)
  }
}

const handleBooking = () => {
  feedback.value = null
  if (!store.currentUser) return

  const res = store.bookCourt(
    form.courtId,
    store.currentUser.email,
    store.currentUser.name,
    form.date,
    form.startTime,
    form.endTime
  )

  if (res.success) {
    feedback.value = { success: true, message: `Booking confirmed! ID: ${res.booking.id}` }
  } else {
    feedback.value = { success: false, message: res.message }
  }
}

const handleCancel = (id) => {
  if (confirm('Are you sure you want to cancel this booking?')) {
    store.cancelBooking(id)
  }
}
</script>
