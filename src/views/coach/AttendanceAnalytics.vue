<template>
  <PortalLayout>
    <div class="space-y-gutter">
      <!-- Title -->
      <header class="flex flex-col md:flex-row md:items-end justify-between gap-md border-b border-outline-variant pb-sm">
        <div>
          <h1 class="font-display-lg text-display-lg font-bold text-primary tracking-tight">Attendance &amp; Reports</h1>
          <p class="font-body-lg text-body-lg text-on-surface-variant">Review session participation trends and export reporting logs.</p>
        </div>
        <div class="flex gap-sm">
          <button @click="exportCSV" class="px-4 py-2 border border-outline-variant rounded bg-white hover:bg-slate-50 transition-colors font-label-bold text-xs text-primary flex items-center gap-xs">
            <span class="material-symbols-outlined text-sm">download</span> Export CSV
          </button>
          <button @click="exportPDF" class="px-4 py-2 bg-secondary text-on-secondary rounded hover:bg-secondary-container transition-colors font-label-bold text-xs flex items-center gap-xs">
            <span class="material-symbols-outlined text-sm">picture_as_pdf</span> Export PDF Report
          </button>
        </div>
      </header>

      <!-- Bento Grid Layout -->
      <div class="grid grid-cols-1 md:grid-cols-12 gap-gutter">
        
        <!-- Attendance Trend Chart (Span 8) -->
        <div class="md:col-span-8">
          <SvgChart 
            title="Weekly Club Participation Trend" 
            :data="[45, 68, 72, 50, 92, 104]"
            :labels="['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']"
          />
        </div>

        <!-- Attendance Stats (Span 4) -->
        <div class="md:col-span-4 bg-white border border-outline-variant rounded-xl p-md shadow-sm flex flex-col justify-between h-full">
          <div>
            <h3 class="font-headline-sm text-sm font-bold text-primary mb-1">Roster Metrics</h3>
            <p class="text-xs text-on-surface-variant mb-md">Active training groups metrics</p>
            
            <div class="space-y-sm">
              <div class="flex justify-between items-center p-sm border border-outline-variant rounded bg-slate-50">
                <span class="text-xs font-semibold text-on-surface-variant">Average Roster Attendance</span>
                <span class="font-headline-sm text-sm font-bold text-green-700">82%</span>
              </div>
              <div class="flex justify-between items-center p-sm border border-outline-variant rounded bg-slate-50">
                <span class="text-xs font-semibold text-on-surface-variant">Total Roster Players</span>
                <span class="font-headline-sm text-sm font-bold text-primary">{{ studentsCount }}</span>
              </div>
              <div class="flex justify-between items-center p-sm border border-outline-variant rounded bg-red-50 border-red-200">
                <span class="text-xs font-semibold text-error">Flagged Low Attendance (&lt; 75%)</span>
                <span class="font-headline-sm text-sm font-bold text-error">{{ flaggedCount }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Flagged Dropouts and Selection Warnings (Span 12) -->
        <div class="md:col-span-12 bg-white rounded-xl border border-outline-variant overflow-hidden shadow-sm">
          <div class="p-md border-b border-outline-variant flex justify-between items-center bg-slate-50">
            <h3 class="font-headline-sm text-sm font-bold text-primary">Ineligible Selections &amp; Dropout Log</h3>
            <span class="px-2 py-0.5 rounded bg-error-container text-on-error-container font-label-bold text-[9px] border border-red-200">ALERT QUEUE</span>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="border-b border-outline-variant bg-white font-label-bold text-label-bold text-xs text-on-surface-variant">
                  <th class="p-3">Athlete Name</th>
                  <th class="p-3">Email Address</th>
                  <th class="p-3 text-center">Attendance Rate</th>
                  <th class="p-3 text-right">Action Needed</th>
                </tr>
              </thead>
              <tbody class="text-xs font-body-sm">
                <tr 
                  v-for="st in flaggedStudents" 
                  :key="st.email"
                  class="border-b border-outline-variant/30 bg-red-50/10 hover:bg-slate-50/50"
                >
                  <td class="p-3 font-semibold text-primary">{{ st.name }}</td>
                  <td class="p-3 text-on-surface-variant">{{ st.email }}</td>
                  <td class="p-3 text-center text-error font-bold">{{ st.attendanceRate }}%</td>
                  <td class="p-3 text-right">
                    <button 
                      @click="triggerRemind(st)" 
                      class="px-3 py-1 bg-primary text-on-primary hover:bg-surface-tint rounded text-[10px] font-bold shadow-sm"
                    >
                      Send Attendance Alert
                    </button>
                  </td>
                </tr>
                <tr v-if="flaggedStudents.length === 0">
                  <td colspan="4" class="p-4 text-center text-on-surface-variant">All active athletes satisfy the 75% attendance threshold.</td>
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
import SvgChart from '../../components/SvgChart.vue'
import { useClubStore } from '../../stores/clubStore'

const store = useClubStore()

const activeMembers = computed(() => {
  return store.users.filter(u => u.role === 'member' && u.onboardingStatus === 'completed')
})

const studentsCount = computed(() => activeMembers.value.length)

const flaggedStudents = computed(() => {
  return activeMembers.value.filter(u => u.attendanceRate < 75)
})

const flaggedCount = computed(() => flaggedStudents.value.length)

const triggerRemind = (st) => {
  store.broadcastAnnouncement(
    'Low Attendance Warning',
    `Athlete ${st.name} was sent a formal attendance warning. Current rate is ${st.attendanceRate}%, which is below the 75% threshold required for tournament rosters.`,
    'warning'
  )
  alert(`Warning notification sent to ${st.name} (${st.email}).`)
}

const exportCSV = () => {
  let csv = 'Name,Email,AttendanceRate,Eligible\n'
  activeMembers.value.forEach(u => {
    csv += `"${u.name}",${u.email},${u.attendanceRate}%,${u.attendanceRate >= 75 ? 'YES' : 'NO'}\n`
  })
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `Attendance_Report.csv`
  a.click()
}

const exportPDF = () => {
  window.print()
}
</script>
