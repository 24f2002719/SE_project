<template>
  <PortalLayout>
    <div class="space-y-gutter">
      <!-- Onboarding Pending Alert banner -->
      <div 
        v-if="store.currentUser?.onboardingStatus === 'pending'" 
        class="bg-secondary-container/20 border border-secondary text-on-secondary-container p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-md"
      >
        <div class="flex items-start gap-3">
          <span class="material-symbols-outlined text-secondary text-2xl mt-0.5">priority_high</span>
          <div>
            <h3 class="font-headline-sm text-sm font-bold text-primary">Onboarding Checklist Incomplete</h3>
            <p class="font-body-sm text-xs text-on-surface-variant mt-1">Please complete your digital safety checklist and waivers to unlock facility bookings.</p>
          </div>
        </div>
        <router-link to="/member/onboarding" class="px-5 py-2 bg-secondary text-white font-label-bold text-xs rounded-lg hover:bg-secondary-container transition-colors text-center shrink-0">
          Complete Onboarding Setup
        </router-link>
      </div>

      <!-- Welcome Header -->
      <header class="flex justify-between items-end border-b border-outline-variant pb-sm">
        <div>
          <h1 class="font-display-lg text-display-lg font-bold text-primary tracking-tight">
            Welcome back, {{ store.currentUser?.name.split(' ')[0] || 'User' }}.
          </h1>
          <p class="font-body-lg text-body-lg text-on-surface-variant mt-2">Here is your sports club activity overview for today.</p>
        </div>
      </header>

      <!-- Bento Grid Layout -->
      <div class="grid grid-cols-1 md:grid-cols-12 gap-gutter">
        
        <!-- Live Court Availability (Span 8) -->
        <div class="col-span-1 md:col-span-8 bg-white border border-outline-variant rounded-xl p-md shadow-sm">
          <div class="flex justify-between items-center mb-md pb-sm border-b border-outline-variant">
            <h2 class="font-headline-sm text-sm font-semibold text-primary flex items-center gap-xs">
              <span class="material-symbols-outlined text-secondary">analytics</span>
              Real-Time Court Availability
            </h2>
            <span class="font-label-bold text-xs bg-surface-container px-sm py-xs rounded-full text-on-surface-variant">Live</span>
          </div>

          <!-- Courts Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-md">
            <div 
              v-for="court in store.courts" 
              :key="court.id" 
              class="flex items-center p-sm border border-outline-variant rounded-lg relative overflow-hidden bg-slate-50/50"
            >
              <!-- Colored status bar -->
              <div class="absolute left-0 top-0 bottom-0 w-1" :style="{ backgroundColor: court.accent }"></div>
              
              <div class="pl-sm w-full">
                <div class="flex justify-between items-start">
                  <div>
                    <h3 class="font-body-md text-sm font-semibold text-primary">{{ court.name }}</h3>
                    <p class="font-body-sm text-xs text-on-surface-variant mt-0.5">{{ court.time }}</p>
                  </div>
                  <span 
                    :class="[
                      court.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' :
                      court.status === 'BOOKED' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                    ]" 
                    class="px-2 py-0.5 rounded-full font-label-bold text-[9px]"
                  >
                    {{ court.status }}
                  </span>
                </div>
                
                <div class="mt-sm flex justify-between items-center text-xs">
                  <span class="text-on-surface-variant">Next: {{ court.next }}</span>
                  
                  <router-link 
                    v-if="court.status === 'AVAILABLE' && store.currentUser?.onboardingStatus === 'completed'" 
                    to="/member/booking" 
                    class="text-secondary font-label-bold hover:underline"
                  >
                    Reserve Slot
                  </router-link>
                  <span 
                    v-else 
                    class="text-outline font-label-bold opacity-50 cursor-not-allowed"
                  >
                    Unavailable
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Membership & Access (Span 4) -->
        <div class="col-span-1 md:col-span-4 flex flex-col gap-gutter">
          <div class="bg-primary-container text-on-primary rounded-xl p-md shadow relative overflow-hidden flex-1 flex flex-col justify-between">
            <div class="absolute top-0 right-0 w-32 h-32 bg-secondary opacity-10 rounded-full -mr-16 -mt-16 pointer-events-none"></div>
            <div>
              <div class="flex items-center gap-2 mb-sm">
                <span class="material-symbols-outlined text-secondary-container">workspace_premium</span>
                <span class="font-label-bold text-xs uppercase tracking-wider text-secondary-container">{{ store.currentUser?.tier }} Membership</span>
              </div>
              <div class="mb-md">
                <span class="font-display-lg text-display-lg font-bold text-white">
                  {{ store.currentUser?.membershipDue > 0 ? 'Dues Pending' : 'Active' }}
                </span>
              </div>
            </div>
            
            <div class="space-y-sm border-t border-white/10 pt-sm text-xs">
              <div class="flex justify-between">
                <span class="text-[#7c839b]">Onboarding Checklist</span>
                <span class="font-semibold text-white capitalize">{{ store.currentUser?.onboardingStatus }}</span>
              </div>
              <div class="flex justify-between" v-if="store.currentUser?.membershipDue > 0">
                <span class="text-[#7c839b]">Dues Amount</span>
                <span class="font-semibold text-secondary-fixed">${{ store.currentUser?.membershipDue }}</span>
              </div>
              
              <!-- Pay Dues CTA -->
              <router-link 
                v-if="store.currentUser?.membershipDue > 0" 
                to="/member/payments" 
                class="w-full mt-sm py-2 bg-secondary text-white rounded font-label-bold text-xs flex justify-center items-center hover:bg-secondary-container transition-colors"
              >
                Resolve Pending Dues
              </router-link>
            </div>
          </div>

          <!-- My Clubs Widget -->
          <div class="bg-white border border-outline-variant rounded-xl p-md shadow-sm space-y-md">
            <div class="flex justify-between items-center pb-xs border-b border-outline-variant/30">
              <h3 class="font-headline-sm text-xs font-bold text-primary flex items-center gap-1">
                <span class="material-symbols-outlined text-secondary text-base">groups</span>
                My Joined Clubs
              </h3>
              <router-link to="/member/profile" class="text-xs text-secondary font-label-bold hover:underline">Manage</router-link>
            </div>
            <div class="flex flex-wrap gap-xs">
              <span 
                v-for="club in (store.currentUser?.clubs || [])" 
                :key="club"
                class="px-2.5 py-1 bg-surface-container text-primary text-xs font-semibold rounded-full border border-outline-variant/20 flex items-center gap-1 shadow-sm"
              >
                <span class="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                {{ club }} Club
              </span>
              <p v-if="!(store.currentUser?.clubs && store.currentUser.clubs.length)" class="text-xs text-on-surface-variant italic">
                No clubs joined yet. Click Manage to choose.
              </p>
            </div>
          </div>
        </div>

        <!-- Upcoming Sessions (Span 6) -->
        <div class="col-span-1 md:col-span-6 bg-white border border-outline-variant rounded-xl p-md shadow-sm">
          <h2 class="font-headline-sm text-sm font-semibold text-primary mb-md pb-sm border-b border-outline-variant flex items-center gap-xs">
            <span class="material-symbols-outlined text-secondary">event_available</span>
            My Training Sessions
          </h2>
          
          <div class="space-y-sm">
            <div 
              v-for="session in filteredSessions" 
              :key="session.id" 
              class="flex items-center justify-between p-sm border border-outline-variant rounded-lg bg-slate-50/50 hover:shadow-sm transition-shadow"
            >
              <div class="flex items-center gap-md">
                <div class="bg-surface-container-high rounded-md p-sm text-center min-w-[56px]">
                  <span class="block font-label-bold text-[9px] text-on-surface-variant">SESSION</span>
                  <span class="block font-headline-sm text-sm font-bold text-primary">#{{ session.id }}</span>
                </div>
                <div>
                  <h3 class="font-body-md text-xs font-semibold text-primary">{{ session.title }}</h3>
                  <p class="font-body-sm text-[11px] text-on-surface-variant mt-1 flex items-center gap-1">
                    <span class="material-symbols-outlined text-xs">schedule</span>
                    {{ session.time }}
                  </p>
                </div>
              </div>

              <!-- Action button or status badge -->
              <div class="text-right">
                <div v-if="getMyPresence(session) === null" class="flex gap-1">
                  <button 
                    @click="confirmAttendance(session.id, true)"
                    class="bg-primary text-on-primary px-3 py-1.5 rounded font-label-bold text-xs hover:bg-surface-tint transition-colors"
                  >
                    Confirm
                  </button>
                  <button 
                    @click="confirmAttendance(session.id, false)"
                    class="border border-outline-variant px-3 py-1.5 rounded font-label-bold text-xs hover:bg-slate-100 text-on-surface-variant transition-colors"
                  >
                    Decline
                  </button>
                </div>
                <span 
                  v-else-if="getMyPresence(session) === true"
                  class="text-[#065F46] bg-[#D1FAE5] px-2.5 py-1 rounded font-label-bold text-[10px] border border-[#A7F3D0]"
                >
                  Confirmed
                </span>
                <span 
                  v-else
                  class="text-error bg-error-container px-2.5 py-1 rounded font-label-bold text-[10px] border border-red-200"
                >
                  Declined
                </span>
              </div>
            </div>
            
            <div v-if="filteredSessions.length === 0" class="text-center py-md text-xs text-on-surface-variant">
              No sessions scheduled for your tier.
            </div>
          </div>
        </div>

        <!-- Announcements Feed (Span 6) -->
        <div class="col-span-1 md:col-span-6 bg-white border border-outline-variant rounded-xl p-md shadow-sm">
          <h2 class="font-headline-sm text-sm font-semibold text-primary mb-md pb-sm border-b border-outline-variant flex items-center gap-xs">
            <span class="material-symbols-outlined text-secondary">campaign</span>
            Club Announcements
          </h2>
          
          <ul class="divide-y divide-outline-variant/30 rounded-lg overflow-hidden border border-outline-variant">
            <li 
              v-for="notif in store.notifications" 
              :key="notif.id" 
              class="p-sm flex gap-sm items-start bg-white hover:bg-slate-50/50 min-h-[56px] transition-colors"
            >
              <span class="material-symbols-outlined text-secondary mt-1 text-xl">
                {{ notif.type === 'warning' ? 'priority_high' : notif.type === 'success' ? 'celebration' : 'info' }}
              </span>
              <div>
                <h3 class="font-body-sm text-xs font-semibold text-primary">{{ notif.title }}</h3>
                <p class="font-body-sm text-xs text-on-surface-variant mt-1 leading-normal">{{ notif.text }}</p>
                <span class="font-label-bold text-[9px] text-outline mt-1 block">{{ notif.time }}</span>
              </div>
            </li>
          </ul>
        </div>

      </div>
    </div>
  </PortalLayout>
</template>

<script setup>
import { computed } from 'vue'
import PortalLayout from '../../layouts/PortalLayout.vue'
import { useClubStore } from '../../stores/clubStore'

const store = useClubStore()

// Filter sessions where member is listed
const filteredSessions = computed(() => {
  if (!store.currentUser) return []
  return store.attendance.filter(session => 
    session.members.some(m => m.email === store.currentUser.email)
  )
})

const getMyPresence = (session) => {
  const me = session.members.find(m => m.email === store.currentUser?.email)
  return me ? me.present : null
}

const confirmAttendance = (sessionId, state) => {
  if (store.currentUser) {
    store.confirmAttendance(sessionId, store.currentUser.email, state)
  }
}
</script>
