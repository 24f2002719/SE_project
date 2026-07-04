<template>
  <PortalLayout>
    <div class="space-y-gutter">
      <!-- Title -->
      <div class="mb-xl flex flex-col md:flex-row md:items-end justify-between gap-md border-b border-outline-variant pb-sm">
        <div>
          <h2 class="font-display-lg text-display-lg font-bold text-primary tracking-tight">Admin Overview</h2>
          <p class="font-body-lg text-body-lg text-on-surface-variant mt-2">Operational status dashboard for today.</p>
        </div>
        <button 
          @click="openBroadcastModal" 
          class="bg-[#fd761a] text-white font-label-bold text-xs px-5 py-3 rounded-lg hover:bg-secondary transition-colors flex items-center gap-2 shadow-sm"
        >
          <span class="material-symbols-outlined text-[18px]">campaign</span>
          New Broadcast
        </button>
      </div>

      <!-- Bento Grid Layout -->
      <div class="grid grid-cols-1 md:grid-cols-12 gap-gutter">
        
        <!-- Registration Pipeline approvals (Span 8) -->
        <div class="md:col-span-8 bg-white border border-outline-variant rounded-xl p-md shadow-sm relative overflow-hidden">
          <div class="absolute top-0 right-0 w-32 h-32 bg-[#dae2fd]/20 rounded-bl-full -z-10"></div>
          
          <div class="flex justify-between items-center mb-md border-b border-outline-variant pb-sm">
            <h3 class="font-headline-sm text-sm font-bold text-primary flex items-center gap-2">
              <span class="material-symbols-outlined text-surface-tint">how_to_reg</span>
              Pending Registration Approvals
            </h3>
            <span class="text-xs bg-slate-100 text-on-surface-variant px-2.5 py-0.5 rounded-full font-semibold">{{ pendingApprovals.length }} Applicants</span>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="border-b border-outline-variant font-label-bold text-label-bold text-xs text-on-surface-variant bg-slate-50">
                  <th class="p-3">Applicant</th>
                  <th class="p-3">Registered Program / Tier</th>
                  <th class="p-3">Status</th>
                  <th class="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="text-xs font-body-sm">
                <tr 
                  v-for="u in pendingApprovals" 
                  :key="u.email"
                  class="border-b border-outline-variant/30 hover:bg-slate-50/50"
                >
                  <td class="p-3 flex items-center gap-2">
                    <div class="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-primary text-[10px]">
                      {{ u.name[0] }}{{ u.name.split(' ')[1]?.[0] || '' }}
                    </div>
                    <div>
                      <p class="font-semibold text-primary">{{ u.name }}</p>
                      <p class="text-[10px] text-on-surface-variant">{{ u.email }}</p>
                    </div>
                  </td>
                  <td class="p-3 text-on-surface">{{ u.tier }} Tier Membership</td>
                  <td class="p-3">
                    <span class="px-2 py-0.5 rounded bg-yellow-100 text-yellow-800 text-[9px] font-bold">
                      PENDING ONBOARD
                    </span>
                  </td>
                  <td class="p-3 text-right flex gap-1 justify-end">
                    <button 
                      @click="approveMember(u.email)"
                      class="p-1.5 text-green-700 hover:bg-green-50 rounded"
                      title="Approve Member"
                    >
                      <span class="material-symbols-outlined text-[20px]">check_circle</span>
                    </button>
                    <button 
                      @click="declineMember(u.email)"
                      class="p-1.5 text-error hover:bg-red-50 rounded"
                      title="Reject Applicant"
                    >
                      <span class="material-symbols-outlined text-[20px]">cancel</span>
                    </button>
                  </td>
                </tr>
                <tr v-if="pendingApprovals.length === 0">
                  <td colspan="4" class="p-4 text-center text-on-surface-variant">No pending member registrations.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Fee Payment Cycle Tracking (Span 4) -->
        <div class="md:col-span-4 bg-white border border-outline-variant rounded-xl p-md flex flex-col justify-between shadow-sm">
          <div>
            <h3 class="font-headline-sm text-sm font-bold text-primary mb-1">Fee Tracking Cycle</h3>
            <p class="text-xs text-on-surface-variant mb-md">Current dues cycle collections</p>
            
            <div class="flex items-end gap-2 mb-md">
              <span class="font-display-lg text-display-lg font-bold text-primary">82%</span>
              <span class="text-xs text-surface-tint mb-2">Collected</span>
            </div>
            
            <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-lg">
              <div class="h-full bg-primary rounded-full" style="width: 82%"></div>
            </div>
            
            <div class="space-y-3 text-xs">
              <div class="flex justify-between items-center p-3 rounded-lg bg-red-50 border border-red-200">
                <div class="flex items-center gap-2">
                  <span class="material-symbols-outlined text-error text-[20px]">warning</span>
                  <span class="font-label-bold text-error">Dues Pending Members</span>
                </div>
                <span class="font-headline-sm text-sm font-bold text-error">{{ pendingDuesCount }}</span>
              </div>
            </div>
          </div>
          
          <button 
            @click="sendDuesReminders"
            class="w-full mt-md px-4 py-3 border border-outline-variant text-primary font-label-bold text-xs rounded-lg hover:bg-slate-50 flex items-center justify-center gap-2"
          >
            <span class="material-symbols-outlined text-[18px]">send</span> Send Reminders
          </button>
        </div>

        <!-- Upcoming Tournaments summary (Span 6) -->
        <div class="md:col-span-6 bg-white border border-outline-variant rounded-xl p-md shadow-sm">
          <div class="flex justify-between items-center mb-md border-b border-outline-variant pb-sm">
            <h3 class="font-headline-sm text-sm font-bold text-primary flex items-center gap-2">
              <span class="material-symbols-outlined text-surface-tint">emoji_events</span>
              Upcoming Tournaments
            </h3>
            <router-link to="/member/events" class="text-xs text-secondary font-label-bold hover:underline">View All</router-link>
          </div>

          <div class="space-y-md">
            <div 
              v-for="e in store.events" 
              :key="e.id"
              class="flex items-start gap-4 p-3 rounded-lg border border-outline-variant bg-slate-50/50 relative overflow-hidden"
            >
              <div class="absolute left-0 top-0 bottom-0 w-1 bg-secondary-container"></div>
              <div class="bg-slate-200 rounded p-2 text-center min-w-[56px] text-xs font-semibold">
                <span class="block text-primary uppercase text-[9px]">DATE</span>
                <span class="block text-primary text-sm font-bold">{{ e.date.split('-')[2] }}</span>
              </div>
              <div class="flex-grow text-xs">
                <h4 class="font-headline-sm text-xs font-bold text-primary mb-1">{{ e.name }}</h4>
                <p class="text-on-surface-variant flex items-center gap-0.5"><span class="material-symbols-outlined text-xs">group</span> {{ e.registered }} / {{ e.max }} Registered</p>
                <div class="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mt-2">
                  <div class="h-full bg-secondary-container rounded-full" :style="{ width: (e.registered / e.max) * 100 + '%' }"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Faculty Escalations and Alerts (Span 6) -->
        <div class="md:col-span-6 bg-white border border-outline-variant rounded-xl p-md shadow-sm flex flex-col justify-between">
          <div>
            <div class="flex justify-between items-center mb-md border-b border-outline-variant pb-sm">
              <h3 class="font-headline-sm text-sm font-bold text-error flex items-center gap-2">
                <span class="material-symbols-outlined">priority_high</span>
                Escalations &amp; Disputes
              </h3>
              <span class="text-xs bg-red-100 text-error px-2.5 py-0.5 rounded-full font-semibold">{{ store.disputes.length }} Active</span>
            </div>

            <div class="space-y-sm text-xs">
              <div 
                v-for="d in store.disputes" 
                :key="d.id"
                class="bg-red-50/50 border border-red-200 p-3 rounded-lg flex justify-between items-center"
              >
                <div>
                  <p class="font-bold text-primary">{{ d.subject }}</p>
                  <p class="text-[10px] text-on-surface-variant mt-0.5">Event: {{ d.event }} • Date: {{ d.date }}</p>
                </div>
                <router-link to="/admin/support" class="text-xs text-error font-bold hover:underline">Manage</router-link>
              </div>
              <div v-if="store.disputes.length === 0" class="text-center py-md text-xs text-on-surface-variant">
                No active dispute escalations.
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- Broadcast announcement dialog overlay -->
      <div v-if="showBroadcastModal" class="fixed inset-0 bg-primary/40 z-50 flex items-center justify-center p-md">
        <form @submit.prevent="submitBroadcast" class="bg-white border border-outline-variant rounded-xl w-full max-w-md shadow-lg flex flex-col p-md space-y-md" @click.stop>
          <div class="flex justify-between items-center border-b border-outline-variant pb-sm">
            <h3 class="font-headline-sm text-sm font-bold text-primary flex items-center gap-1">
              <span class="material-symbols-outlined text-secondary">campaign</span>
              Broadcast Announcement
            </h3>
            <button type="button" @click="showBroadcastModal = false" class="p-1 hover:bg-slate-100 rounded-full">
              <span class="material-symbols-outlined text-xl">close</span>
            </button>
          </div>
          
          <div class="space-y-1 text-xs">
            <label class="block font-semibold text-on-surface-variant">Announcement Title</label>
            <input v-model="broadcastForm.title" class="w-full bg-slate-50 border border-outline-variant rounded px-3 py-2.5 outline-none focus:border-primary" placeholder="e.g. Facility Maintenance" required />
          </div>
          
          <div class="space-y-1 text-xs">
            <label class="block font-semibold text-on-surface-variant">Message Details</label>
            <textarea v-model="broadcastForm.text" class="w-full bg-slate-50 border border-outline-variant rounded px-3 py-2.5 outline-none focus:border-primary resize-none" rows="3" placeholder="Write announcement text..." required></textarea>
          </div>

          <div class="space-y-1 text-xs">
            <label class="block font-semibold text-on-surface-variant">Message Severity</label>
            <select v-model="broadcastForm.type" class="w-full bg-slate-50 border border-outline-variant rounded px-3 py-2.5 outline-none focus:border-primary">
              <option value="info">Info (Blue)</option>
              <option value="warning">Warning (Orange)</option>
              <option value="success">Success (Green)</option>
            </select>
          </div>

          <button type="submit" class="w-full py-2.5 bg-primary text-on-primary font-label-bold text-xs rounded hover:bg-surface-tint transition-all shadow-sm">
            Publish Announcement
          </button>
        </form>
      </div>

    </div>
  </PortalLayout>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import PortalLayout from '../../layouts/PortalLayout.vue'
import { useClubStore } from '../../stores/clubStore'

const store = useClubStore()

const showBroadcastModal = ref(false)
const broadcastForm = reactive({
  title: '',
  text: '',
  type: 'info'
})

const pendingApprovals = computed(() => {
  // Members who are onboarding checklist pending
  return store.users.filter(u => u.role === 'member' && u.onboardingStatus === 'pending')
})

const pendingDuesCount = computed(() => {
  return store.users.filter(u => u.role === 'member' && u.membershipDue > 0).length
})

const approveMember = (email) => {
  // Simulate complete onboarding for member
  store.completeOnboarding(email, { tier: 'Pro' })
  // Clear dues instantly for testing
  const u = store.users.find(us => us.email === email)
  if (u) { u.membershipDue = 0 }
  alert(`Member (${email}) onboarding checklist approved and membership set to Active.`)
}

const declineMember = (email) => {
  const index = store.users.findIndex(u => u.email === email)
  if (index !== -1) {
    store.users.splice(index, 1)
    alert(`Registration declined for applicant (${email}).`)
  }
}

const sendDuesReminders = () => {
  store.broadcastAnnouncement(
    'Payment Dues Reminder',
    'Outstanding annual dues for standard or pro tier memberships have been flagged. Please settle pending dues on the Payments dashboard.',
    'warning'
  )
  alert('Dues reminder notifications sent to all pending members.')
}

const openBroadcastModal = () => {
  showBroadcastModal.value = true
}

const submitBroadcast = () => {
  store.broadcastAnnouncement(broadcastForm.title, broadcastForm.text, broadcastForm.type)
  showBroadcastModal.value = false
  broadcastForm.title = ''
  broadcastForm.text = ''
}
</script>
