<template>
  <PortalLayout>
    <div class="space-y-gutter">
      <!-- Welcome Header -->
      <header class="flex justify-between items-end border-b border-outline-variant pb-sm">
        <div>
          <h1 class="font-display-lg text-display-lg font-bold text-primary tracking-tight">Parent Dashboard</h1>
          <p class="font-body-lg text-body-lg text-on-surface-variant mt-2">
            Monitoring profile and training progress for student-athlete: <span class="font-bold text-primary">{{ childUser?.name || 'Student Athlete' }}</span>
          </p>
        </div>
      </header>

      <!-- Child Stats Bento Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-gutter">
        <!-- Attendance Metric Card -->
        <div class="bg-white border border-outline-variant rounded-xl p-md shadow-sm flex items-center gap-md">
          <div 
            :class="[childUser?.attendanceRate >= 75 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-error']"
            class="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg"
          >
            {{ childUser?.attendanceRate }}%
          </div>
          <div>
            <p class="text-xs text-on-surface-variant font-semibold">Attendance Rate</p>
            <p class="font-bold text-primary text-xs mt-0.5">
              {{ childUser?.attendanceRate >= 75 ? 'Roster Eligible' : 'Needs Attendance Alert' }}
            </p>
          </div>
        </div>

        <!-- Membership Standing Card -->
        <div class="bg-white border border-outline-variant rounded-xl p-md shadow-sm flex items-center gap-md">
          <div class="w-12 h-12 rounded-full bg-primary-container text-white flex items-center justify-center">
            <span class="material-symbols-outlined text-secondary-container">workspace_premium</span>
          </div>
          <div>
            <p class="text-xs text-on-surface-variant font-semibold">Membership Tier</p>
            <p class="font-bold text-primary text-xs mt-0.5">{{ childUser?.tier || 'Standard' }} Tier ({{ childUser?.membershipStatus }})</p>
          </div>
        </div>

        <!-- Fees & Dues Outstanding Card -->
        <div class="bg-white border border-outline-variant rounded-xl p-md shadow-sm flex items-center gap-md justify-between">
          <div class="flex items-center gap-md">
            <div 
              :class="[childUser?.membershipDue > 0 ? 'bg-red-100 text-error' : 'bg-green-100 text-green-700']"
              class="w-12 h-12 rounded-full flex items-center justify-center"
            >
              <span class="material-symbols-outlined">{{ childUser?.membershipDue > 0 ? 'receipt_long' : 'check_circle' }}</span>
            </div>
            <div>
              <p class="text-xs text-on-surface-variant font-semibold">Pending Dues</p>
              <p class="font-bold text-primary text-xs mt-0.5">
                {{ childUser?.membershipDue > 0 ? '$' + childUser.membershipDue + ' Outstanding' : 'Fees Settled' }}
              </p>
            </div>
          </div>
          <button 
            v-if="childUser?.membershipDue > 0" 
            @click="payChildDues"
            class="px-3 py-1.5 bg-secondary text-white text-[10px] font-bold rounded shadow-sm hover:bg-secondary-container transition-colors"
          >
            Pay Now
          </button>
        </div>
      </div>

      <!-- Bento Grid Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        
        <!-- Child training sessions list (Span 7) -->
        <div class="lg:col-span-7 bg-white border border-outline-variant rounded-xl p-md shadow-sm">
          <div class="flex justify-between items-center mb-md border-b border-outline-variant pb-sm">
            <h2 class="font-headline-sm text-sm font-bold text-primary flex items-center gap-xs">
              <span class="material-symbols-outlined text-secondary">event_note</span>
              Child's Training Sessions
            </h2>
            <span class="text-xs bg-slate-100 text-on-surface-variant px-2.5 py-0.5 rounded-full font-semibold">{{ childSessions.length }} Scheduled</span>
          </div>

          <div class="space-y-sm">
            <div 
              v-for="s in childSessions" 
              :key="s.id"
              class="border border-outline-variant rounded-lg p-sm bg-slate-50/50 flex justify-between items-center hover:bg-slate-50 transition-colors"
            >
              <div>
                <h3 class="font-headline-sm text-xs font-bold text-primary">{{ s.title }}</h3>
                <p class="text-xs text-on-surface-variant mt-1">Sport: {{ s.sport }} • Location: {{ s.facility }}</p>
                <p class="text-xs text-on-surface-variant mt-0.5">Time: {{ s.date }} @ {{ s.time }}</p>
              </div>
              
              <div>
                <span 
                  v-if="getChildPresence(s) === true"
                  class="px-2.5 py-1 rounded bg-green-100 text-green-800 text-[10px] font-bold border border-green-200"
                >
                  Confirmed
                </span>
                <span 
                  v-else-if="getChildPresence(s) === false"
                  class="px-2.5 py-1 rounded bg-red-100 text-red-800 text-[10px] font-bold border border-red-200"
                >
                  Declined
                </span>
                <span 
                  v-else
                  class="px-2.5 py-1 rounded bg-slate-100 text-slate-800 text-[10px] font-bold border border-slate-200"
                >
                  Not Marked
                </span>
              </div>
            </div>
            
            <div v-if="childSessions.length === 0" class="text-center py-xl text-xs text-on-surface-variant">
              No sessions scheduled for your child.
            </div>
          </div>
        </div>

        <!-- Parent Notifications / Alert Center (Span 5) -->
        <div class="lg:col-span-5 bg-white border border-outline-variant rounded-xl p-md shadow-sm">
          <div class="flex justify-between items-center mb-md border-b border-outline-variant pb-sm">
            <h2 class="font-headline-sm text-sm font-bold text-primary flex items-center gap-xs">
              <span class="material-symbols-outlined text-secondary">notifications_active</span>
              Parent Alerts &amp; Notifications
            </h2>
          </div>

          <div class="space-y-sm">
            <!-- Custom Parent specific notifications -->
            <div 
              v-for="alert in parentAlerts" 
              :key="alert.id"
              :class="[
                alert.type === 'danger' ? 'bg-red-50 border-red-200 text-red-800' :
                alert.type === 'warning' ? 'bg-yellow-50 border-yellow-200 text-yellow-800' : 'bg-slate-50 border-outline-variant'
              ]"
              class="border rounded-lg p-sm text-xs leading-normal flex gap-sm items-start"
            >
              <span class="material-symbols-outlined text-sm mt-0.5">
                {{ alert.type === 'danger' || alert.type === 'warning' ? 'error' : 'info' }}
              </span>
              <div>
                <p class="font-bold text-xs text-primary">{{ alert.title }}</p>
                <p class="text-on-surface-variant mt-1">{{ alert.text }}</p>
                <span class="text-[9px] text-outline mt-1 block">{{ alert.time }}</span>
              </div>
            </div>

            <div v-if="parentAlerts.length === 0" class="text-center py-xl text-xs text-on-surface-variant">
              No active alerts. All student activities are in good standing!
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

const childEmail = computed(() => store.currentUser ? store.currentUser.childEmail : '')

const childUser = computed(() => {
  if (!childEmail.value) return null
  return store.users.find(u => u.email.toLowerCase() === childEmail.value.toLowerCase())
})

const childSessions = computed(() => {
  if (!childEmail.value) return []
  return store.attendance.filter(session => 
    session.members && session.members.some(m => m.email === childEmail.value)
  )
})

const getChildPresence = (session) => {
  if (!childEmail.value) return null
  const child = session.members.find(m => m.email === childEmail.value)
  return child ? child.present : null
}

const parentAlerts = computed(() => {
  const alerts = []
  
  if (childUser.value) {
    // 1. Attendance warning
    if (childUser.value.attendanceRate < 75) {
      alerts.push({
        id: 1,
        title: 'Low Attendance Warning',
        text: `Your child ${childUser.value.name}'s attendance rate is ${childUser.value.attendanceRate}%, which is below the 75% selection threshold. They are currently ineligible for Inter-Institute Sports Meet trial selection.`,
        time: 'Just now',
        type: 'danger'
      })
    }

    // 2. Fees warning
    if (childUser.value.membershipDue > 0) {
      alerts.push({
        id: 2,
        title: 'Outstanding Fees Due',
        text: `Your child has an outstanding balance of $${childUser.value.membershipDue} for their ${childUser.value.tier} Membership. Settle dues immediately to avoid facility lockouts.`,
        time: '1 hour ago',
        type: 'warning'
      })
    }
  }

  // 3. General notifications
  store.notifications.forEach((notif, idx) => {
    alerts.push({
      id: 10 + idx,
      title: notif.title,
      text: notif.text,
      time: notif.time,
      type: 'info'
    })
  })

  return alerts
})

const payChildDues = () => {
  if (!childEmail.value || !childUser.value) return

  // Find the child's pending payment record in store.payments
  const pendingTxn = store.payments.find(p => p.userEmail === childEmail.value && p.status === 'Pending')
  
  if (pendingTxn) {
    store.payDues(childEmail.value, pendingTxn.id)
    alert(`Success: Paid $${pendingTxn.amount} child membership dues. Balance cleared.`)
  } else {
    // Or just clear child membership dues directly in user profile if no payment log was saved
    childUser.value.membershipDue = 0
    alert('Success: Outstanding dues cleared directly.')
  }
}
</script>
