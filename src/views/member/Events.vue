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

      <!-- Tab selection -->
      <div class="flex border-b border-outline-variant gap-md">
        <button 
          @click="activeTab = 'upcoming'"
          :class="[activeTab === 'upcoming' ? 'border-b-2 border-secondary font-bold text-primary' : 'text-on-surface-variant']"
          class="pb-2 text-xs font-label-bold focus:outline-none transition-colors"
        >
          Upcoming Tournaments
        </button>
        <button 
          @click="activeTab = 'ongoing'"
          :class="[activeTab === 'ongoing' ? 'border-b-2 border-secondary font-bold text-primary' : 'text-on-surface-variant']"
          class="pb-2 text-xs font-label-bold focus:outline-none transition-colors"
        >
          Ongoing Tournaments
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        
        <!-- Events Catalog (Left Column, Span 7) -->
        <div class="lg:col-span-7 space-y-gutter">
          <div class="bg-white border border-outline-variant rounded-xl p-md shadow-sm">
            <h2 class="font-headline-sm text-sm font-bold text-primary mb-md pb-sm border-b border-outline-variant">
              {{ activeTab === 'upcoming' ? 'Upcoming Registrations' : 'Ongoing Competitions' }}
            </h2>

            <div class="space-y-md">
              <div 
                v-for="e in filteredEvents" 
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
                    
                    <div class="flex gap-2">
                      <!-- Registration CTA -->
                      <template v-if="!isRegistered(e)">
                        <!-- Check if tournament is full -->
                        <button 
                          v-if="e.registered >= e.max"
                          @click="subscribeNotification(e)"
                          class="bg-surface-variant hover:bg-slate-200 text-primary px-4 py-1.5 rounded font-label-bold text-xs shadow-sm transition-colors flex items-center gap-1"
                        >
                          <span class="material-symbols-outlined text-xs">notifications</span>
                          {{ isSubscribed(e.id) ? 'Subscribed' : 'Notify Me' }}
                        </button>
                        <button 
                          v-else
                          @click="openRegisterModal(e)"
                          :disabled="e.status !== 'Active'"
                          class="bg-secondary hover:bg-secondary-container text-on-secondary px-4 py-1.5 rounded font-label-bold text-xs shadow-sm transition-colors"
                        >
                          Register Now
                        </button>
                      </template>
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
              <div v-if="filteredEvents.length === 0" class="text-center py-xl text-xs text-on-surface-variant">
                No tournaments found for this category.
              </div>
            </div>
          </div>
        </div>

        <!-- Fixture Brackets & Selection (Right Column, Span 5) -->
        <div class="lg:col-span-5 space-y-gutter">
          
          <!-- Brackets Widget -->
          <div class="bg-white border border-outline-variant rounded-xl p-md shadow-sm">
            <h2 class="font-headline-sm text-sm font-bold text-primary mb-md pb-sm border-b border-outline-variant flex items-center gap-xs">
              <span class="material-symbols-outlined text-secondary">alt_route</span>
              Active Fixtures / Brackets
            </h2>

            <div class="space-y-sm">
              <div v-for="e in store.events.filter(ev => ev.fixtures.length > 0)" :key="e.id" class="space-y-2">
                <h3 class="font-label-bold text-xs text-primary border-l-2 border-secondary pl-2 mb-2">{{ e.name }}</h3>
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
              <div v-if="store.events.filter(ev => ev.fixtures.length > 0).length === 0" class="text-center py-md text-xs text-on-surface-variant">
                No active brackets generated yet.
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

      <!-- Registration Form Modal Dialog Overlay -->
      <div v-if="selectedRegEvent" class="fixed inset-0 bg-primary/40 z-50 flex items-center justify-center p-md">
        <form @submit.prevent="submitRegistration" class="bg-white border border-outline-variant rounded-xl w-full max-w-md shadow-lg flex flex-col p-md space-y-md" @click.stop>
          <div class="flex justify-between items-center border-b border-outline-variant pb-sm">
            <h3 class="font-headline-sm text-sm font-bold text-primary flex items-center gap-1">
              <span class="material-symbols-outlined text-secondary">assignment</span>
              Tournament Registration
            </h3>
            <button type="button" @click="selectedRegEvent = null" class="p-1 hover:bg-slate-100 rounded-full">
              <span class="material-symbols-outlined text-xl">close</span>
            </button>
          </div>
          
          <p class="text-xs text-on-surface-variant leading-relaxed">
            Registering for: <span class="font-bold text-primary">{{ selectedRegEvent.name }}</span> ({{ selectedRegEvent.sport }})
          </p>

          <div class="space-y-1 text-xs">
            <label class="block font-semibold text-on-surface-variant">Full Name</label>
            <input v-model="regForm.name" class="w-full bg-slate-50 border border-outline-variant rounded px-3 py-2" required type="text" />
          </div>

          <div class="space-y-1 text-xs">
            <label class="block font-semibold text-on-surface-variant">Email Address</label>
            <input v-model="regForm.email" disabled class="w-full bg-slate-100 border border-outline-variant rounded px-3 py-2 cursor-not-allowed text-on-surface-variant" type="email" />
          </div>

          <div class="space-y-1 text-xs">
            <label class="block font-semibold text-on-surface-variant">IISER Bhopal Roll Number</label>
            <input v-model="regForm.rollNo" class="w-full bg-slate-50 border border-outline-variant rounded px-3 py-2" placeholder="e.g. 20112" required type="text" />
          </div>

          <div class="space-y-1 text-xs">
            <label class="block font-semibold text-on-surface-variant">Skill/Experience Level</label>
            <select v-model="regForm.skillLevel" class="w-full bg-slate-50 border border-outline-variant rounded px-3 py-2">
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </div>

          <div class="space-y-1 text-xs">
            <label class="block font-semibold text-on-surface-variant">Emergency Phone Contact</label>
            <input v-model="regForm.emergencyContact" class="w-full bg-slate-50 border border-outline-variant rounded px-3 py-2" placeholder="e.g. +91 99999 99999" required type="text" />
          </div>

          <button type="submit" class="w-full py-2.5 bg-secondary text-on-secondary font-label-bold text-xs rounded hover:bg-secondary-container transition-all shadow-sm">
            Confirm &amp; Join Roster
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

const activeTab = ref('upcoming')
const selectedRegEvent = ref(null)
const subscribedEvents = ref([])

const regForm = reactive({
  name: '',
  email: '',
  rollNo: '',
  skillLevel: 'Intermediate',
  emergencyContact: ''
})

const attendanceRate = computed(() => store.currentUser ? store.currentUser.attendanceRate : 100)

const filteredEvents = computed(() => {
  // If tab is 'upcoming', show active tournaments whose fixtures are not yet started/or date in future
  // If tab is 'ongoing', show active tournaments that have active brackets
  if (activeTab.value === 'upcoming') {
    return store.events.filter(e => e.status === 'Active' && e.fixtures.length === 0)
  } else {
    // Show ongoing (Active status and has fixtures)
    return store.events.filter(e => e.status === 'Active' && e.fixtures.length > 0)
  }
})

const isRegistered = (event) => {
  if (!store.currentUser) return false
  return event.roster && event.roster.some(r => r.email === store.currentUser.email)
}

const isSubscribed = (id) => {
  return subscribedEvents.value.includes(id)
}

const openRegisterModal = (event) => {
  if (!store.currentUser) return
  
  // Check membership standing
  if (store.currentUser.membershipDue > 0) {
    alert('Registration Blocked: Please settle outstanding membership fees.')
    return
  }

  selectedRegEvent.value = event
  regForm.name = store.currentUser.name
  regForm.email = store.currentUser.email
  regForm.rollNo = ''
  regForm.skillLevel = 'Intermediate'
  regForm.emergencyContact = ''
}

const submitRegistration = () => {
  if (!selectedRegEvent.value || !store.currentUser) return

  const ev = store.events.find(e => e.id === selectedRegEvent.value.id)
  if (ev) {
    ev.roster.push({
      name: regForm.name,
      email: regForm.email,
      rollNo: regForm.rollNo,
      skillLevel: regForm.skillLevel,
      emergencyContact: regForm.emergencyContact,
      attendanceRate: store.currentUser.attendanceRate,
      status: store.currentUser.attendanceRate >= 75 ? 'Approved' : 'Pending Approval'
    })
    ev.registered++
    alert(`Registration successful! You have joined the roster for ${ev.name}.`)
  }

  selectedRegEvent.value = null
}

const subscribeNotification = (event) => {
  if (!subscribedEvents.value.includes(event.id)) {
    subscribedEvents.value.push(event.id)
    alert(`You have subscribed to notifications for "${event.name}". We will notify you if a roster slot becomes available!`)
  }
}
</script>
