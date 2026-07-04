<template>
  <PortalLayout>
    <div class="space-y-gutter">
      <!-- Welcome Header -->
      <header class="flex justify-between items-end border-b border-outline-variant pb-sm">
        <div>
          <h1 class="font-display-lg text-display-lg font-bold text-primary tracking-tight">
            Faculty Advisor Panel
          </h1>
          <p class="font-body-lg text-body-lg text-on-surface-variant mt-2">Audit inter-institute nominations and resolve escalated sports disputes.</p>
        </div>
      </header>

      <!-- Bento Grid Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        
        <!-- Active disputes and resolutions (Span 6) -->
        <div class="lg:col-span-6 bg-white border border-outline-variant rounded-xl p-md shadow-sm">
          <div class="flex justify-between items-center mb-md border-b border-outline-variant pb-sm">
            <h2 class="font-headline-sm text-sm font-bold text-primary flex items-center gap-xs">
              <span class="material-symbols-outlined text-secondary">gavel</span>
              Escalated Dispute Logs
            </h2>
            <span class="text-xs bg-red-100 text-error px-2.5 py-0.5 rounded-full font-bold">{{ pendingDisputes.length }} Active</span>
          </div>

          <div class="space-y-sm max-h-[350px] overflow-y-auto">
            <div 
              v-for="d in store.disputes" 
              :key="d.id"
              class="border border-outline-variant rounded-lg p-sm bg-slate-50/50 space-y-md"
            >
              <div>
                <div class="flex justify-between">
                  <span class="font-bold text-primary text-xs">{{ d.subject }}</span>
                  <span 
                    :class="[d.status === 'Resolved' ? 'text-green-700 font-bold' : 'text-error font-bold']"
                    class="text-[10px]"
                  >
                    {{ d.status }}
                  </span>
                </div>
                <p class="text-[10px] text-on-surface-variant mt-1">Logged by: {{ d.loggingUser }} • Event: {{ d.event }}</p>
                <p class="text-xs text-on-surface mt-sm bg-white p-sm border border-outline-variant rounded">{{ d.details }}</p>
              </div>

              <!-- Resolution form if pending -->
              <div v-if="d.status !== 'Resolved'" class="flex gap-sm">
                <input 
                  v-model="resolutions[d.id]"
                  class="flex-grow border border-outline-variant rounded px-2.5 py-1.5 text-xs outline-none focus:border-primary"
                  placeholder="Enter resolution notes..."
                  required
                />
                <button 
                  @click="resolveDispute(d.id)"
                  class="bg-green-700 hover:bg-green-800 text-white px-4 py-1.5 rounded text-xs font-bold shadow-sm"
                >
                  Resolve
                </button>
              </div>
              <div v-else class="text-xs text-on-surface-variant bg-green-50 p-2 rounded border border-green-200">
                <span class="font-bold">Resolution: </span> {{ d.resolution }}
              </div>
            </div>
            
            <div v-if="store.disputes.length === 0" class="text-center py-md text-xs text-on-surface-variant">
              No disputes logged in the system.
            </div>
          </div>
        </div>

        <!-- Roster nomination approvals (Span 6) -->
        <div class="lg:col-span-6 bg-white border border-outline-variant rounded-xl p-md shadow-sm">
          <div class="flex justify-between items-center mb-md border-b border-outline-variant pb-sm">
            <h2 class="font-headline-sm text-sm font-bold text-primary flex items-center gap-xs">
              <span class="material-symbols-outlined text-secondary">verified_user</span>
              Roster Eligibility Audits (ISM)
            </h2>
          </div>

          <div class="space-y-md">
            <div v-for="e in store.events" :key="e.id" class="space-y-sm">
              <h3 class="font-label-bold text-xs text-primary bg-slate-100 p-sm rounded border border-outline-variant/30 flex justify-between">
                <span>{{ e.name }} ({{ e.sport }})</span>
                <span class="text-[10px] text-on-surface-variant">Roster Count: {{ e.roster.length }}</span>
              </h3>
              
              <div class="space-y-xs pl-xs max-h-48 overflow-y-auto">
                <div 
                  v-for="p in e.roster" 
                  :key="p.email"
                  class="border border-outline-variant rounded p-2 text-xs flex justify-between items-center"
                  :class="[p.attendanceRate < 75 ? 'bg-red-50/20 border-red-100' : '']"
                >
                  <div>
                    <div class="flex items-center gap-1 font-semibold text-primary">
                      {{ p.name }}
                      <!-- Low attendance warning -->
                      <span 
                        v-if="p.attendanceRate < 75" 
                        class="material-symbols-outlined text-error text-xs" 
                        title="Attendance rate below 75%"
                      >
                        warning
                      </span>
                    </div>
                    <p class="text-[10px] text-on-surface-variant mt-0.5">Attendance: {{ p.attendanceRate }}% • Status: {{ p.status }}</p>
                  </div>
                  <div class="flex gap-1" v-if="p.status === 'Pending Approval'">
                    <button 
                      @click="approvePlayer(e.id, p.email, 'Approved')"
                      class="px-2 py-1 bg-green-700 hover:bg-green-800 text-white rounded text-[10px] font-bold"
                    >
                      Approve
                    </button>
                    <button 
                      @click="approvePlayer(e.id, p.email, 'Rejected')"
                      class="px-2 py-1 bg-error hover:bg-red-800 text-white rounded text-[10px] font-bold"
                    >
                      Reject
                    </button>
                  </div>
                  <span 
                    v-else
                    :class="[p.status === 'Approved' ? 'text-green-700 font-bold' : 'text-error font-bold']"
                    class="text-[10px] uppercase tracking-wider"
                  >
                    {{ p.status }}
                  </span>
                </div>
              </div>
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

const resolutions = reactive({})

const pendingDisputes = computed(() => {
  return store.disputes.filter(d => d.status !== 'Resolved')
})

const resolveDispute = (id) => {
  const note = resolutions[id]
  if (!note || !note.trim()) {
    alert('Please enter resolution notes.')
    return
  }
  store.resolveDispute(id, note)
  resolutions[id] = ''
}

const approvePlayer = (eventId, playerEmail, status) => {
  store.approveRosterPlayer(eventId, playerEmail, status)
  
  // Auto generate fixtures if 4 approved players
  const ev = store.events.find(e => e.id === eventId)
  if (ev) {
    const approvedCount = ev.roster.filter(p => p.status === 'Approved').length
    if (approvedCount >= 4 && ev.fixtures.length === 0) {
      store.generateFixtures(eventId)
    }
  }
}
</script>
