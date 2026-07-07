<template>
  <PortalLayout>
    <div class="space-y-gutter">
      <!-- Header -->
      <header class="flex justify-between items-end border-b border-outline-variant pb-sm">
        <div>
          <h1 class="font-display-lg text-display-lg font-bold text-primary tracking-tight">My Attendance</h1>
          <p class="font-body-lg text-body-lg text-on-surface-variant mt-2">Track training session attendance log and selections eligibility status.</p>
        </div>
      </header>

      <!-- Grid layout -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        
        <!-- Attendance Stats / Eligibility Widget (Span 4) -->
        <div class="lg:col-span-4 bg-white border border-outline-variant rounded-xl p-md shadow-sm flex flex-col justify-between h-fit space-y-md">
          <div class="border-b border-outline-variant pb-sm">
            <h3 class="font-headline-sm text-sm font-bold text-primary flex items-center gap-xs">
              <span class="material-symbols-outlined text-secondary">verified_user</span>
              Roster Eligibility
            </h3>
          </div>

          <div class="flex flex-col items-center py-md space-y-md">
            <!-- Circular progress indicator -->
            <div class="relative w-36 h-36 flex items-center justify-center">
              <svg class="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="#f1f5f9" stroke-width="8" fill="transparent" />
                <circle 
                  cx="50" 
                  cy="50" 
                  r="40" 
                  :stroke="attendanceRate >= 75 ? '#059669' : '#dc2626'" 
                  stroke-width="8" 
                  fill="transparent" 
                  :stroke-dasharray="2 * Math.PI * 40" 
                  :stroke-dashoffset="2 * Math.PI * 40 * (1 - attendanceRate / 100)"
                  stroke-linecap="round"
                  class="transition-all duration-500"
                />
              </svg>
              <div class="absolute flex flex-col items-center">
                <span class="font-display-lg text-3xl font-extrabold text-primary">{{ attendanceRate }}%</span>
                <span class="text-[9px] font-label-bold text-on-surface-variant uppercase tracking-wider">Attendance</span>
              </div>
            </div>

            <!-- Eligibility Banner -->
            <div 
              v-if="attendanceRate >= 75" 
              class="w-full bg-green-50 border border-green-200 text-green-800 p-sm rounded-lg text-xs text-center"
            >
              <p class="font-bold flex items-center justify-center gap-1">
                <span class="material-symbols-outlined text-sm">check_circle</span>
                Selection Eligible
              </p>
              <p class="text-[10px] text-on-surface-variant mt-1">Your attendance satisfies the 75% selection trials criteria.</p>
            </div>
            <div 
              v-else 
              class="w-full bg-red-50 border border-red-200 text-red-800 p-sm rounded-lg text-xs text-center"
            >
              <p class="font-bold flex items-center justify-center gap-1">
                <span class="material-symbols-outlined text-sm">warning</span>
                Ineligible for ISM
              </p>
              <p class="text-[10px] text-on-surface-variant mt-1">Keep attendance above 75% to qualify for selection trials.</p>
            </div>
          </div>

          <div class="space-y-sm text-xs pt-xs border-t border-outline-variant/30">
            <div class="flex justify-between">
              <span class="text-on-surface-variant">Min Criteria:</span>
              <span class="font-semibold text-primary">75% Attendance</span>
            </div>
            <div class="flex justify-between">
              <span class="text-on-surface-variant">Total Sessions logged:</span>
              <span class="font-semibold text-primary">{{ filteredSessions.length }} sessions</span>
            </div>
          </div>
        </div>

        <!-- Attendance Logs Table (Span 8) -->
        <div class="lg:col-span-8 bg-white border border-outline-variant rounded-xl p-md shadow-sm">
          <div class="flex justify-between items-center mb-md border-b border-outline-variant pb-sm">
            <h2 class="font-headline-sm text-sm font-bold text-primary flex items-center gap-xs">
              <span class="material-symbols-outlined text-secondary">history</span>
              Training Session Logs
            </h2>
            <span class="text-xs bg-slate-100 text-on-surface-variant px-2.5 py-0.5 rounded-full font-semibold">{{ presentCount }} Present</span>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="border-b border-outline-variant font-label-bold text-label-bold text-xs text-on-surface-variant bg-slate-50">
                  <th class="p-3">Session</th>
                  <th class="p-3">Coach</th>
                  <th class="p-3">Location &amp; Time</th>
                  <th class="p-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody class="text-xs font-body-sm">
                <tr 
                  v-for="s in filteredSessions" 
                  :key="s.id" 
                  class="border-b border-outline-variant/30 hover:bg-slate-50/50"
                >
                  <td class="p-3">
                    <p class="font-bold text-primary">{{ s.title }}</p>
                    <p class="text-[10px] text-on-surface-variant capitalize mt-0.5">{{ s.sport }} Drills</p>
                  </td>
                  <td class="p-3 text-on-surface-variant">
                    <p class="font-semibold">{{ s.coach }}</p>
                  </td>
                  <td class="p-3 text-on-surface-variant">
                    <p>{{ s.facility }}</p>
                    <p class="text-[10px] text-outline mt-0.5">{{ s.date }} • {{ s.time }}</p>
                  </td>
                  <td class="p-3 text-right">
                    <span 
                      v-if="getMyPresence(s) === true"
                      class="px-2 py-0.5 rounded bg-green-100 text-green-800 text-[10px] font-bold inline-flex items-center gap-0.5"
                    >
                      <span class="material-symbols-outlined text-xs">check_circle</span> Present
                    </span>
                    <span 
                      v-else-if="getMyPresence(s) === false"
                      class="px-2 py-0.5 rounded bg-red-100 text-red-800 text-[10px] font-bold inline-flex items-center gap-0.5"
                    >
                      <span class="material-symbols-outlined text-xs">cancel</span> Absent / Declined
                    </span>
                    <span 
                      v-else
                      class="px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-[10px] font-bold inline-flex items-center gap-0.5"
                    >
                      <span class="material-symbols-outlined text-xs">pending</span> Pending Mark
                    </span>
                  </td>
                </tr>
                <tr v-if="filteredSessions.length === 0">
                  <td colspan="4" class="p-4 text-center text-on-surface-variant">You are not registered in any active training groups.</td>
                </tr>
              </tbody>
            </table>
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

const filteredSessions = computed(() => {
  if (!store.currentUser) return []
  return store.attendance.filter(session => 
    session.members && session.members.some(m => m.email === store.currentUser.email)
  )
})

const presentCount = computed(() => {
  return filteredSessions.value.filter(s => getMyPresence(s) === true).length
})

const getMyPresence = (session) => {
  if (!store.currentUser) return null
  const me = session.members.find(m => m.email === store.currentUser.email)
  return me ? me.present : null
}
</script>
