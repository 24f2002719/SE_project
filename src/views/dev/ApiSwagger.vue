<template>
  <div class="bg-slate-50 min-h-screen text-slate-800 font-body-md antialiased p-margin-mobile md:p-margin-desktop">
    <div class="max-w-5xl mx-auto space-y-md">
      
      <!-- Header -->
      <header class="flex justify-between items-center bg-white border border-outline-variant rounded-xl p-md shadow-sm">
        <div>
          <div class="flex items-center gap-xs">
            <span class="material-symbols-outlined text-secondary text-3xl">api</span>
            <h1 class="font-display-lg text-headline-md font-bold text-primary">NexSport Backend API Explorer</h1>
          </div>
          <p class="text-xs text-on-surface-variant mt-1">RESTful mock swagger documentation mapping frontend integrations to Flask blueprints.</p>
        </div>
        <router-link to="/" class="px-4 py-2 border border-outline-variant rounded text-xs font-semibold hover:bg-slate-50 flex items-center gap-xs text-primary">
          <span class="material-symbols-outlined text-sm">home</span> Back to Home
        </router-link>
      </header>

      <!-- Swagger Sections -->
      <main class="space-y-lg">
        <section v-for="section in swaggerData" :key="section.title" class="space-y-sm">
          <h2 class="font-headline-sm text-sm font-bold text-slate-600 border-b border-outline-variant pb-xs uppercase tracking-wider">{{ section.title }} Blueprint</h2>
          
          <div class="space-y-xs">
            <div 
              v-for="(api, idx) in section.endpoints" 
              :key="idx"
              class="border rounded-lg overflow-hidden bg-white shadow-sm"
            >
              <!-- Collapsed Header -->
              <button 
                @click="toggleApi(section.title + '-' + idx)"
                :class="[
                  api.method === 'GET' ? 'bg-[#dae2fd]/30 hover:bg-[#dae2fd]/50 border-primary-fixed/30' :
                  api.method === 'POST' ? 'bg-[#d1fae5]/30 hover:bg-[#d1fae5]/50 border-green-200/50' : 
                  'bg-red-50/50 hover:bg-red-50/80 border-red-100'
                ]"
                class="w-full flex items-center justify-between p-sm text-left font-mono border-b focus:outline-none"
              >
                <div class="flex items-center gap-md">
                  <span 
                    :class="[
                      api.method === 'GET' ? 'bg-primary text-white' :
                      api.method === 'POST' ? 'bg-green-700 text-white' : 'bg-error text-white'
                    ]"
                    class="px-3 py-1 rounded font-bold text-[10px] w-16 text-center"
                  >
                    {{ api.method }}
                  </span>
                  <span class="font-bold text-xs">{{ api.path }}</span>
                  <span class="text-xs text-slate-500 font-sans normal-case italic ml-sm">{{ api.summary }}</span>
                </div>
                <span class="material-symbols-outlined text-slate-400">
                  {{ openApi === section.title + '-' + idx ? 'expand_less' : 'expand_more' }}
                </span>
              </button>

              <!-- Expanded Details -->
              <div 
                v-if="openApi === section.title + '-' + idx"
                class="p-md space-y-md border-t border-outline-variant/30 text-xs"
              >
                <p class="text-slate-600 leading-normal">{{ api.description }}</p>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-md">
                  <!-- Request Payload -->
                  <div class="space-y-xs">
                    <h4 class="font-bold text-xs text-slate-700 flex items-center gap-xs">
                      <span class="material-symbols-outlined text-sm">login</span> Request Details
                    </h4>
                    <pre class="bg-slate-900 text-slate-200 p-sm rounded font-mono text-[10px] overflow-auto max-h-40 leading-snug">{{ JSON.stringify(api.request, null, 2) }}</pre>
                  </div>
                  <!-- Response Payload -->
                  <div class="space-y-xs">
                    <h4 class="font-bold text-xs text-slate-700 flex items-center gap-xs">
                      <span class="material-symbols-outlined text-sm">logout</span> Response Schema (200 OK)
                    </h4>
                    <pre class="bg-slate-900 text-[#7bd0ff] p-sm rounded font-mono text-[10px] overflow-auto max-h-40 leading-snug">{{ JSON.stringify(api.response, null, 2) }}</pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const openApi = ref(null)

const toggleApi = (id) => {
  openApi.value = openApi.value === id ? null : id
}

const swaggerData = [
  {
    title: 'Authentication & Access Control',
    endpoints: [
      {
        method: 'POST',
        path: '/api/auth/login',
        summary: 'Authenticate credentials & retrieve JWT token',
        description: 'Verifies email/phone and password, returning user data and simulated JWT access token for gateway headers.',
        request: {
          headers: { 'Content-Type': 'application/json' },
          body: { email: 'alex@nexsport.com', password: 'password123' }
        },
        response: {
          token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          user: { name: 'Alex Mercer', email: 'alex@nexsport.com', role: 'member', tier: 'Pro', onboardingStatus: 'completed' }
        }
      },
      {
        method: 'POST',
        path: '/api/auth/register',
        summary: 'Register a new account (General Validation)',
        description: 'Creates a member or coach profile. Enforces general format validation for the email address.',
        request: {
          headers: { 'Content-Type': 'application/json' },
          body: { name: 'John Smith', email: 'john@nexsport.com', password: 'password123', role: 'member' }
        },
        response: {
          message: 'Account successfully registered.',
          user: { email: 'john@nexsport.com', role: 'member', onboardingStatus: 'pending' }
        }
      }
    ]
  },
  {
    title: 'Facility Booking & Scheduling',
    endpoints: [
      {
        method: 'GET',
        path: '/api/courts',
        summary: 'Retrieve courts status catalog',
        description: 'Returns real-time status details for all court facilities (Badminton, Volleyball, Tennis).',
        request: { headers: { 'Authorization': 'Bearer <token>' } },
        response: [
          { id: 'badminton-a', name: 'Badminton Court A', status: 'AVAILABLE', time: 'Open now until 4:00 PM', accent: '#10B981' }
        ]
      },
      {
        method: 'POST',
        path: '/api/bookings',
        summary: 'Reserve a court slot (Conflict Checked)',
        description: 'Validates membership billing eligibility and checks for booking scheduling overlaps. Blocks if court status is under maintenance.',
        request: {
          headers: { 'Authorization': 'Bearer <token>', 'Content-Type': 'application/json' },
          body: { courtId: 'badminton-a', date: '2026-07-04', startTime: '16:00', endTime: '17:00' }
        },
        response: {
          success: true,
          booking: { id: 'BK-8819', courtId: 'badminton-a', date: '2026-07-04', startTime: '16:00', endTime: '17:00', status: 'Approved' }
        }
      },
      {
        method: 'DELETE',
        path: '/api/bookings/:id',
        summary: 'Cancel court reservation',
        description: 'Removes reservation slot and triggers cancellation alert logs to user notifications.',
        request: { headers: { 'Authorization': 'Bearer <token>' } },
        response: { success: true, message: 'Reservation BK-8819 successfully cancelled.' }
      }
    ]
  },
  {
    title: 'Onboarding & Custom Checklists',
    endpoints: [
      {
        method: 'POST',
        path: '/api/onboarding/complete',
        summary: 'Submit onboarding details',
        description: 'Processes membership tier setup, safety checkouts, and signed liability waivers to unlock member facility reservation controls.',
        request: {
          headers: { 'Authorization': 'Bearer <token>', 'Content-Type': 'application/json' },
          body: { tier: 'Pro', safetySigned: true, waiverSignature: 'Alex Mercer', tourCompleted: true }
        },
        response: { success: true, message: 'Onboarding complete. Membership status set to Active.' }
      }
    ]
  },
  {
    title: 'Membership & Fees Management',
    endpoints: [
      {
        method: 'POST',
        path: '/api/payments/:id/pay',
        summary: 'Process pending fee payments',
        description: 'Settles overdue membership fees, marking transaction Paid and resetting pending dues.',
        request: { headers: { 'Authorization': 'Bearer <token>' } },
        response: { success: true, message: 'Transaction Paid. Membership dues set to $0.' }
      }
    ]
  },
  {
    title: 'Attendance & Sessions',
    endpoints: [
      {
        method: 'POST',
        path: '/api/attendance/mark',
        summary: 'Mark class roster attendance',
        description: 'Submit present/absent logs for a training class session. Recalculates student attendance rates in the background.',
        request: {
          headers: { 'Authorization': 'Bearer <token>', 'Content-Type': 'application/json' },
          body: { sessionId: 101, memberEmail: 'alex@nexsport.com', present: true }
        },
        response: { success: true, updatedAttendanceRate: 85 }
      }
    ]
  },
  {
    title: 'Event & Tournament Management',
    endpoints: [
      {
        method: 'POST',
        path: '/api/events/:id/fixtures',
        summary: 'Generate tournament bracket fixtures',
        description: 'Generates knockout brackets or round-robin matchups for approved registered players.',
        request: { headers: { 'Authorization': 'Bearer <token>' } },
        response: {
          success: true,
          fixtures: [
            { round: 'Semifinals', match: 'Match 1', player1: 'Alex Mercer', player2: 'John Doe', winner: '' }
          ]
        }
      }
    ]
  },
  {
    title: 'Support & Disputes',
    endpoints: [
      {
        method: 'POST',
        path: '/api/support/disputes',
        summary: 'Log match/roster selection dispute',
        description: 'Logs a formal selection dispute and triggers a high-priority advisory notification on Dr. Verma\'s dashboard.',
        request: {
          headers: { 'Authorization': 'Bearer <token>', 'Content-Type': 'application/json' },
          body: { event: 'Winter Classic Tennis', subject: 'Roster Dispute', details: 'Player selected below attendance thresholds.' }
        },
        response: {
          success: true,
          dispute: { id: 'DSP-109', subject: 'Roster Dispute', status: 'Pending Review' }
        }
      }
    ]
  }
]
</script>
