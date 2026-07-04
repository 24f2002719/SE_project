<template>
  <PortalLayout>
    <div class="space-y-gutter">
      <!-- Title -->
      <header class="flex justify-between items-end border-b border-outline-variant pb-sm">
        <div>
          <h1 class="font-display-lg text-display-lg font-bold text-primary tracking-tight">My Schedule</h1>
          <p class="font-body-lg text-body-lg text-on-surface-variant">Your calendar of bookings, practice sessions, and events.</p>
        </div>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        <!-- Filters (Span 3) -->
        <div class="lg:col-span-3 space-y-md">
          <div class="bg-white border border-outline-variant rounded-xl p-md shadow-sm">
            <h3 class="font-label-bold text-xs uppercase text-secondary tracking-wider mb-sm">Schedule Filter</h3>
            <div class="flex flex-col gap-sm">
              <button 
                @click="filter = 'all'"
                :class="[filter === 'all' ? 'bg-primary text-on-primary' : 'hover:bg-slate-50 border border-outline-variant']"
                class="px-4 py-2 rounded text-xs font-semibold text-left transition-colors"
              >
                All Activities
              </button>
              <button 
                @click="filter = 'bookings'"
                :class="[filter === 'bookings' ? 'bg-primary text-on-primary' : 'hover:bg-slate-50 border border-outline-variant']"
                class="px-4 py-2 rounded text-xs font-semibold text-left transition-colors"
              >
                Court Bookings
              </button>
              <button 
                @click="filter = 'sessions'"
                :class="[filter === 'sessions' ? 'bg-primary text-on-primary' : 'hover:bg-slate-50 border border-outline-variant']"
                class="px-4 py-2 rounded text-xs font-semibold text-left transition-colors"
              >
                Coaching Classes
              </button>
            </div>
          </div>
        </div>

        <!-- Schedule Items (Span 9) -->
        <div class="lg:col-span-9 bg-white border border-outline-variant rounded-xl p-md shadow-sm">
          <h2 class="font-headline-sm text-sm font-bold text-primary mb-md pb-sm border-b border-outline-variant">
            Upcoming Items
          </h2>

          <div class="space-y-sm">
            <div 
              v-for="item in combinedSchedule" 
              :key="item.key" 
              class="flex flex-col sm:flex-row sm:items-center justify-between p-sm border border-outline-variant rounded-lg bg-slate-50/50 hover:shadow-sm transition-shadow"
            >
              <div class="flex items-center gap-md">
                <!-- Icon based on type -->
                <div 
                  :class="[item.type === 'booking' ? 'bg-secondary-fixed text-on-secondary-fixed' : 'bg-primary-fixed text-on-primary-fixed']"
                  class="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                >
                  <span class="material-symbols-outlined text-2xl">
                    {{ item.type === 'booking' ? 'calendar_today' : 'sports_soccer' }}
                  </span>
                </div>
                
                <div>
                  <div class="flex items-center gap-xs">
                    <h3 class="font-headline-sm text-sm font-bold text-primary">{{ item.title }}</h3>
                    <span 
                      :class="[item.type === 'booking' ? 'bg-secondary-container/10 text-secondary' : 'bg-primary-container/10 text-primary']"
                      class="px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider"
                    >
                      {{ item.type }}
                    </span>
                  </div>
                  <p class="font-body-sm text-xs text-on-surface-variant mt-1 flex items-center gap-xs">
                    <span class="material-symbols-outlined text-xs">location_on</span>
                    {{ item.venue }}
                  </p>
                  <p class="font-body-sm text-xs text-on-surface-variant mt-0.5 flex items-center gap-xs">
                    <span class="material-symbols-outlined text-xs">schedule</span>
                    {{ item.date }} • {{ item.time }}
                  </p>
                </div>
              </div>

              <!-- Action details -->
              <div class="mt-sm sm:mt-0 self-start sm:self-center">
                <span 
                  v-if="item.status === 'Approved' || item.status === 'Confirmed' || item.status === true"
                  class="text-[#065F46] bg-[#D1FAE5] px-2.5 py-1 rounded font-label-bold text-[10px] border border-[#A7F3D0]"
                >
                  Confirmed
                </span>
                <span 
                  v-else-if="item.status === 'Pending' || item.status === null"
                  class="text-[#854d0e] bg-[#fef08a]/20 px-2.5 py-1 rounded font-label-bold text-[10px] border border-[#fef08a]"
                >
                  Pending Action
                </span>
                <span 
                  v-else
                  class="text-error bg-error-container px-2.5 py-1 rounded font-label-bold text-[10px] border border-red-200"
                >
                  Declined
                </span>
              </div>
            </div>

            <div v-if="combinedSchedule.length === 0" class="text-center py-xl text-sm text-on-surface-variant">
              Your schedule is currently clear.
            </div>
          </div>
        </div>
      </div>
    </div>
  </PortalLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import PortalLayout from '../../layouts/PortalLayout.vue'
import { useClubStore } from '../../stores/clubStore'

const store = useClubStore()
const filter = ref('all')

const getCourtName = (id) => {
  const court = store.courts.find(c => c.id === id)
  return court ? court.name : id
}

const combinedSchedule = computed(() => {
  if (!store.currentUser) return []
  
  const schedule = []
  const email = store.currentUser.email

  // 1. Gather bookings
  if (filter.value === 'all' || filter.value === 'bookings') {
    store.bookings
      .filter(b => b.userEmail === email)
      .forEach(b => {
        schedule.push({
          key: `bk-${b.id}`,
          type: 'booking',
          title: `Court Reservation (${b.id})`,
          venue: getCourtName(b.courtId),
          date: b.date,
          time: `${b.startTime} - ${b.endTime}`,
          status: b.status
        })
      })
  }

  // 2. Gather coaching sessions
  if (filter.value === 'all' || filter.value === 'sessions') {
    store.attendance
      .filter(s => s.members.some(m => m.email === email))
      .forEach(s => {
        const myDetails = s.members.find(m => m.email === email)
        schedule.push({
          key: `session-${s.id}`,
          type: 'session',
          title: s.title,
          venue: s.facility,
          date: s.date,
          time: s.time,
          status: myDetails ? myDetails.present : null
        })
      })
  }

  // Sort by date (descending or ascending? ascending for schedules)
  return schedule.sort((a, b) => a.date.localeCompare(b.date))
})
</script>
