<template>
  <PortalLayout>
    <div class="space-y-gutter">
      <!-- Title -->
      <header class="flex justify-between items-end border-b border-outline-variant pb-sm">
        <div>
          <h1 class="font-display-lg text-display-lg font-bold text-primary tracking-tight">Events &amp; Tournaments</h1>
          <p class="font-body-lg text-body-lg text-on-surface-variant">Register for tournaments, view brackets, and check ISM eligibility.</p>
        </div>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        
        <!-- Events Catalog (Span 7) -->
        <div class="lg:col-span-7 space-y-gutter">
          <div class="bg-white border border-outline-variant rounded-xl p-md shadow-sm">
            <h2 class="font-headline-sm text-sm font-bold text-primary mb-md pb-sm border-b border-outline-variant">
              Active Tournaments
            </h2>

            <div class="space-y-md">
              <div 
                v-for="e in store.events" 
                :key="e.id"
                class="border border-outline-variant rounded-lg p-md bg-slate-50/20 hover:shadow-sm transition-all"
              >
                <div class="flex justify-between items-start mb-sm">
                  <div>
                    <h3 class="font-headline-sm text-sm font-bold text-primary">{{ e.name }}</h3>
                    <p class="text-xs text-on-surface-variant mt-1">Sport: {{ e.sport }} • Format: {{ e.format }}</p>
                  </div>
                  <span 
                    :class="[e.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800']"
                    class="px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider"
                  >
                    {{ e.status }}
                  </span>
                </div>

                <div class="space-y-sm text-xs text-on-surface-variant">
                  <p class="flex items-center gap-xs"><span class="material-symbols-outlined text-sm">calendar_month</span> Date: {{ e.date }}</p>
                  <p class="flex items-center gap-xs"><span class="material-symbols-outlined text-sm">location_on</span> Venue: {{ e.venue }}</p>
                  <div class="flex justify-between items-center pt-xs">
                    <span>Slots: {{ e.registered }} / {{ e.max }}</span>
                    <button 
                      v-if="!isRegistered(e)"
                      @click="registerForEvent(e.id)"
                      :disabled="e.status !== 'Active'"
                      class="bg-secondary hover:bg-secondary-container text-on-secondary px-4 py-1.5 rounded font-label-bold text-xs shadow-sm transition-colors"
                    >
                      Register Now
                    </button>
                    <span 
                      v-else
                      class="text-green-700 bg-green-100 border border-green-200 px-3 py-1 rounded font-label-bold text-xs"
                    >
                      Registered
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Fixture Brackets & Selection (Span 5) -->
        <div class="lg:col-span-5 space-y-gutter">
          
          <!-- Brackets Widget -->
          <div class="bg-white border border-outline-variant rounded-xl p-md shadow-sm">
            <h2 class="font-headline-sm text-sm font-bold text-primary mb-md pb-sm border-b border-outline-variant flex items-center gap-xs">
              <span class="material-symbols-outlined text-secondary">alt_route</span>
              Active Fixtures / Brackets
            </h2>

            <div class="space-y-sm">
              <div v-for="e in store.events.filter(ev => ev.fixtures.length > 0)" :key="e.id" class="space-y-2">
                <h3 class="font-label-bold text-xs text-primary">{{ e.name }}</h3>
                <div class="space-y-xs">
                  <div 
                    v-for="(fix, idx) in e.fixtures" 
                    :key="idx"
                    class="border border-outline-variant rounded p-sm text-xs bg-slate-50 flex justify-between items-center"
                  >
                    <div>
                      <p class="font-semibold" :class="[fix.winner === fix.player1 ? 'text-secondary' : '']">{{ fix.player1 }}</p>
                      <p class="text-outline text-[10px] my-0.5">vs</p>
                      <p class="font-semibold" :class="[fix.winner === fix.player2 ? 'text-secondary' : '']">{{ fix.player2 }}</p>
                    </div>
                    <div class="text-right">
                      <span class="text-[9px] bg-slate-200 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider block mb-1">{{ fix.round }}</span>
                      <span v-if="fix.winner" class="text-[10px] text-green-700 font-bold">Winner: {{ fix.winner }}</span>
                      <span v-else class="text-[10px] text-on-surface-variant italic">Scheduled</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- ISM Eligibility warning checks -->
          <div class="bg-white border border-outline-variant rounded-xl p-md shadow-sm">
            <h2 class="font-headline-sm text-sm font-bold text-primary mb-md pb-sm border-b border-outline-variant flex items-center gap-xs">
              <span class="material-symbols-outlined text-secondary">verified_user</span>
              ISM Selection Eligibility
            </h2>

            <div class="space-y-sm text-xs">
              <div class="flex items-center justify-between p-sm rounded bg-slate-50">
                <span>My Attendance Rate:</span>
                <span 
                  :class="[attendanceRate >= 75 ? 'text-green-700 font-bold' : 'text-error font-bold']"
                  class="text-sm"
                >
                  {{ attendanceRate }}%
                </span>
              </div>

              <!-- Warning Alert -->
              <div 
                v-if="attendanceRate < 75"
                class="bg-error-container/20 border border-error p-3 rounded text-error-container"
              >
                <p class="font-semibold flex items-center gap-1"><span class="material-symbols-outlined text-sm">warning</span> Eligibility Warning</p>
                <p class="mt-1 text-[11px] leading-relaxed text-on-surface-variant">Your current training attendance rate is below the mandated 75% threshold. You are currently ineligible for inter-institute selections or ISM team nominations.</p>
              </div>
              <div 
                v-else
                class="bg-green-50 border border-green-300 p-3 rounded text-green-800"
              >
                <p class="font-semibold flex items-center gap-1"><span class="material-symbols-outlined text-sm">verified</span> Eligible for Selection</p>
                <p class="mt-1 text-[11px] leading-relaxed text-on-surface-variant">Your attendance satisfies the 75% threshold. You are eligible for selection trials and tournament nominations!</p>
              </div>
            </div>
          </div>

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

const attendanceRate = computed(() => store.currentUser ? store.currentUser.attendanceRate : 100)

const isRegistered = (event) => {
  if (!store.currentUser) return false
  return event.roster.some(r => r.email === store.currentUser.email)
}

const registerForEvent = (eventId) => {
  if (!store.currentUser) return
  
  // Check membership standing
  if (store.currentUser.membershipDue > 0) {
    alert('Registration Blocked: Please settle outstanding membership fees.')
    return
  }

  const ev = store.events.find(e => e.id === eventId)
  if (ev) {
    ev.roster.push({
      name: store.currentUser.name,
      email: store.currentUser.email,
      attendanceRate: store.currentUser.attendanceRate,
      status: store.currentUser.attendanceRate >= 75 ? 'Approved' : 'Pending Approval'
    })
    ev.registered++
  }
}
</script>
