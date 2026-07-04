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

        <!-- Catalog and My Bookings (Span 8) -->
        <div class="lg:col-span-8 space-y-gutter">
          
          <!-- Live Catalog Grid -->
          <div class="bg-white border border-outline-variant rounded-xl p-md shadow-sm">
            <h2 class="font-headline-sm text-sm font-bold text-primary mb-md pb-sm border-b border-outline-variant flex items-center gap-xs">
              <span class="material-symbols-outlined text-secondary">explore</span>
              Facilities Directory
            </h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-md">
              <div 
                v-for="c in store.courts" 
                :key="c.id" 
                class="border border-outline-variant rounded-lg p-sm relative overflow-hidden bg-slate-50/20"
              >
                <div class="absolute left-0 top-0 bottom-0 w-1" :style="{ backgroundColor: c.accent }"></div>
                <div class="pl-sm">
                  <div class="flex justify-between items-start">
                    <h3 class="font-headline-sm text-xs font-bold text-primary">{{ c.name }}</h3>
                    <span 
                      :class="[
                        c.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' :
                        c.status === 'BOOKED' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                      ]" 
                      class="px-2 py-0.5 rounded text-[8px] font-bold"
                    >
                      {{ c.status }}
                    </span>
                  </div>
                  <p class="text-xs text-on-surface-variant mt-1">Sport: {{ c.type }}</p>
                  <p class="text-xs text-on-surface-variant mt-0.5">{{ c.time }}</p>
                  <p class="text-[10px] text-outline mt-sm">Next: {{ c.next }}</p>
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
