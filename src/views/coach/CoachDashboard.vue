<template>
  <PortalLayout>
    <div class="space-y-gutter">
      <!-- Welcome Header -->
      <header class="flex justify-between items-end border-b border-outline-variant pb-sm">
        <div>
          <h1 class="font-display-lg text-display-lg font-bold text-primary tracking-tight">
            Coach Dashboard
          </h1>
          <p class="font-body-lg text-body-lg text-on-surface-variant mt-2">Manage your training rosters and session attendance logs.</p>
        </div>
      </header>

      <!-- Bento Grid Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        
        <!-- Sessions Queue (Span 6) -->
        <div class="lg:col-span-6 bg-white border border-outline-variant rounded-xl p-md shadow-sm">
          <div class="flex justify-between items-center mb-md border-b border-outline-variant pb-sm">
            <h2 class="font-headline-sm text-sm font-bold text-primary flex items-center gap-xs">
              <span class="material-symbols-outlined text-secondary">assignment_turned_in</span>
              Mark Session Attendance
            </h2>
            <router-link to="/coach/schedule" class="text-secondary font-label-bold text-xs hover:underline flex items-center gap-xs">
              <span class="material-symbols-outlined text-sm">add</span> Schedule Class
            </router-link>
          </div>

          <div class="space-y-sm">
            <div 
              v-for="s in coachSessions" 
              :key="s.id"
              class="border border-outline-variant rounded-lg p-sm bg-slate-50/50 hover:bg-slate-50 transition-colors flex justify-between items-center"
            >
              <div>
                <h3 class="font-headline-sm text-xs font-bold text-primary">{{ s.title }}</h3>
                <p class="text-xs text-on-surface-variant mt-1 flex items-center gap-0.5">
                  <span class="material-symbols-outlined text-xs">location_on</span> {{ s.facility }}
                </p>
                <p class="text-xs text-on-surface-variant mt-0.5 flex items-center gap-0.5">
                  <span class="material-symbols-outlined text-xs">schedule</span> {{ s.date }} • {{ s.time }}
                </p>
              </div>
              <div class="flex flex-col items-end gap-xs">
                <span 
                  v-if="isAttendanceLogged(s)"
                  class="px-2 py-0.5 bg-green-100 text-green-800 text-[10px] font-bold rounded-full flex items-center gap-0.5"
                >
                  <span class="material-symbols-outlined text-xs">check_circle</span> Logged
                </span>
                <button 
                  @click="openAttendanceModal(s)"
                  :class="[isAttendanceLogged(s) ? 'bg-secondary hover:bg-secondary-container' : 'bg-primary hover:bg-surface-tint']"
                  class="text-on-primary px-4 py-2 rounded font-label-bold text-xs shadow-sm transition-colors"
                >
                  {{ isAttendanceLogged(s) ? 'View/Edit Logs' : 'Mark Attendance' }}
                </button>
              </div>
            </div>
            <div v-if="coachSessions.length === 0" class="text-center py-md text-xs text-on-surface-variant">
              No upcoming training classes scheduled.
            </div>
          </div>
        </div>

        <!-- Student Roster Listing (Span 6) -->
        <div class="lg:col-span-6 bg-white border border-outline-variant rounded-xl p-md shadow-sm">
          <div class="flex justify-between items-center mb-md border-b border-outline-variant pb-sm">
            <h2 class="font-headline-sm text-sm font-bold text-primary flex items-center gap-xs">
              <span class="material-symbols-outlined text-secondary">groups</span>
              Active Student Roster
            </h2>
            <span class="text-xs bg-slate-100 text-on-surface-variant px-2.5 py-0.5 rounded-full font-semibold">{{ studentRoster.length }} Athletes</span>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="border-b border-outline-variant font-label-bold text-label-bold text-xs text-on-surface-variant">
                  <th class="p-3">Athlete</th>
                  <th class="p-3 text-center">Attendance</th>
                  <th class="p-3 text-right">ISM Status</th>
                </tr>
              </thead>
              <tbody class="text-xs font-body-sm">
                <tr 
                  v-for="st in studentRoster" 
                  :key="st.email"
                  class="border-b border-outline-variant/30 hover:bg-slate-50/50"
                >
                  <td class="p-3 flex items-center gap-2">
                    <div class="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-primary text-[10px]">
                      {{ st.name[0] }}{{ st.name.split(' ')[1]?.[0] || '' }}
                    </div>
                    <div>
                      <p class="font-semibold text-primary">{{ st.name }}</p>
                      <p class="text-[10px] text-on-surface-variant">{{ st.email }}</p>
                    </div>
                  </td>
                  <td class="p-3 text-center">
                    <span 
                      :class="[st.attendanceRate >= 75 ? 'text-green-700 font-bold' : 'text-error font-bold']"
                      class="text-xs"
                    >
                      {{ st.attendanceRate }}%
                    </span>
                  </td>
                  <td class="p-3 text-right">
                    <span 
                      v-if="st.attendanceRate >= 75"
                      class="px-2 py-0.5 rounded bg-green-100 text-green-800 text-[9px] font-bold"
                    >
                      ELIGIBLE
                    </span>
                    <span 
                      :class="[st.attendanceRate >= 75 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800']"
                      class="px-2 py-0.5 rounded text-[9px] font-bold"
                      v-else
                      title="Attendance below 75% selection threshold"
                    >
                      INELIGIBLE
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>

      <!-- Attendance Marking Dialog Modal Overlay -->
      <div v-if="activeAttendanceModal" class="fixed inset-0 bg-primary/40 z-50 flex items-center justify-center p-md">
        <div class="bg-white border border-outline-variant rounded-xl w-full max-w-xl shadow-lg flex flex-col h-[450px]" @click.stop>
          <div class="p-md border-b border-outline-variant flex justify-between items-center bg-slate-50 rounded-t-xl">
            <div>
              <h3 class="font-headline-sm text-sm font-bold text-primary">{{ activeAttendanceModal.title }}</h3>
              <p class="text-[10px] text-on-surface-variant">Mark present/absent logs for {{ activeAttendanceModal.date }}</p>
            </div>
            <button @click="activeAttendanceModal = null" class="p-1 hover:bg-slate-200 rounded-full">
              <span class="material-symbols-outlined text-xl">close</span>
            </button>
          </div>
          
          <!-- Roster list -->
          <div class="flex-grow p-md overflow-y-auto space-y-sm bg-slate-50/50">
            <div 
              v-for="m in activeAttendanceModal.members" 
              :key="m.email"
              class="bg-white border border-outline-variant rounded-lg p-sm flex justify-between items-center shadow-sm"
            >
              <div>
                <p class="font-bold text-xs text-primary">{{ m.name }}</p>
                <p class="text-[10px] text-on-surface-variant flex items-center gap-xs mt-0.5">
                  Rate: <span :class="[m.attendanceRate >= 75 ? 'text-green-700 font-bold' : 'text-error font-bold']">{{ m.attendanceRate }}%</span>
                </p>
              </div>
              <div class="flex gap-2">
                <button 
                  @click="markStatus(m.email, true)"
                  :class="[m.present === true ? 'bg-green-700 text-white border-green-700' : 'bg-white text-on-surface border border-outline-variant hover:bg-slate-50']"
                  class="px-3 py-1 rounded text-xs font-bold transition-all"
                >
                  Present
                </button>
                <button 
                  @click="markStatus(m.email, false)"
                  :class="[m.present === false ? 'bg-error text-white border-error' : 'bg-white text-on-surface border border-outline-variant hover:bg-slate-50']"
                  class="px-3 py-1 rounded text-xs font-bold transition-all"
                >
                  Absent
                </button>
              </div>
            </div>
          </div>
          
          <div class="p-sm border-t border-outline-variant bg-white flex justify-end rounded-b-xl">
            <button @click="activeAttendanceModal = null" class="bg-primary hover:bg-surface-tint text-on-primary px-6 py-2 rounded text-xs font-bold shadow-sm">Save Logs</button>
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

const activeAttendanceModal = ref(null)

const coachSessions = computed(() => {
  if (!store.currentUser) return []
  return store.attendance.filter(s => s.coach === store.currentUser.name)
})

const studentRoster = computed(() => {
  // Members who have completed onboarding
  return store.users.filter(u => u.role === 'member' && u.onboardingStatus === 'completed')
})

const isAttendanceLogged = (session) => {
  return session.members && session.members.some(m => m.present !== null)
}

const openAttendanceModal = (session) => {
  activeAttendanceModal.value = session
}

const markStatus = (email, presentState) => {
  if (activeAttendanceModal.value) {
    store.confirmAttendance(activeAttendanceModal.value.id, email, presentState)
  }
}
</script>
