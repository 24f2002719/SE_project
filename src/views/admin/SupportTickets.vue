<template>
  <PortalLayout>
    <div class="space-y-gutter">
      <!-- Title -->
      <header class="flex justify-between items-end border-b border-outline-variant pb-sm">
        <div>
          <h1 class="font-display-lg text-display-lg font-bold text-primary tracking-tight">Support Ticket Queue</h1>
          <p class="font-body-lg text-body-lg text-on-surface-variant">Resolve member complaints and log tournament disputes.</p>
        </div>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        
        <!-- Tickets list (Span 7) -->
        <div class="lg:col-span-7 bg-white border border-outline-variant rounded-xl p-md shadow-sm">
          <div class="flex justify-between items-center mb-md border-b border-outline-variant pb-sm">
            <h3 class="font-headline-sm text-sm font-bold text-primary flex items-center gap-xs">
              <span class="material-symbols-outlined text-secondary">support_agent</span>
              General Ticket Queue
            </h3>
            <span class="text-xs bg-slate-100 text-on-surface-variant px-2.5 py-0.5 rounded-full font-semibold">{{ openTickets.length }} Open</span>
          </div>

          <div class="space-y-sm">
            <div 
              v-for="t in store.tickets" 
              :key="t.id"
              class="border border-outline-variant rounded-lg p-sm bg-slate-50/50 hover:border-primary transition-all flex justify-between items-center"
            >
              <div>
                <div class="flex items-center gap-xs">
                  <h4 class="font-headline-sm text-xs font-bold text-primary">{{ t.subject }}</h4>
                  <span 
                    :class="[
                      t.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                      t.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                    ]" 
                    class="px-2 py-0.5 rounded text-[8px] font-bold"
                  >
                    {{ t.status }}
                  </span>
                </div>
                <p class="text-xs text-on-surface-variant mt-1">From: {{ t.user }} • Category: {{ t.category }}</p>
                <p class="text-[10px] text-outline mt-0.5">Date: {{ t.date }}</p>
              </div>
              <div class="flex gap-1">
                <button 
                  @click="openChat(t)" 
                  class="bg-primary hover:bg-surface-tint text-on-primary px-3 py-1.5 rounded text-xs font-semibold"
                >
                  Reply
                </button>
                <button 
                  v-if="t.status !== 'Resolved'"
                  @click="resolveTicket(t.id)" 
                  class="border border-outline-variant hover:bg-slate-100 text-on-surface-variant px-3 py-1.5 rounded text-xs font-semibold"
                >
                  Resolve
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Dispute Logging & Escalation (Span 5) -->
        <div class="lg:col-span-5 bg-white border border-outline-variant rounded-xl p-md shadow-sm">
          <div class="flex justify-between items-center mb-md border-b border-outline-variant pb-sm">
            <h3 class="font-headline-sm text-sm font-bold text-primary flex items-center gap-xs">
              <span class="material-symbols-outlined text-secondary">gavel</span>
              Log Roster / Match Dispute
            </h3>
          </div>

          <div v-if="feedback" class="bg-green-50 border border-green-200 text-green-800 p-sm rounded-lg text-xs font-semibold mb-md">
            {{ feedback }}
          </div>

          <form @submit.prevent="submitDispute" class="space-y-md text-xs">
            <div class="space-y-1">
              <label class="block font-semibold text-on-surface-variant">Select Event / Tournament</label>
              <select v-model="disForm.event" class="w-full bg-slate-50 border border-outline-variant rounded px-3 py-2.5 outline-none focus:border-primary">
                <option v-for="e in store.events" :key="e.id" :value="e.name">
                  {{ e.name }}
                </option>
              </select>
            </div>
            
            <div class="space-y-1">
              <label class="block font-semibold text-on-surface-variant">Dispute Subject</label>
              <input v-model="disForm.subject" class="w-full bg-slate-50 border border-outline-variant rounded px-3 py-2.5 outline-none focus:border-primary" placeholder="e.g. Player Eligibility / Rule Violation" required />
            </div>

            <div class="space-y-1">
              <label class="block font-semibold text-on-surface-variant">Dispute Details &amp; Evidence</label>
              <textarea v-model="disForm.details" class="w-full bg-slate-50 border border-outline-variant rounded px-3 py-2.5 outline-none focus:border-primary resize-none" rows="3" placeholder="Provide detailed audit trails..." required></textarea>
            </div>

            <button type="submit" class="w-full py-2.5 bg-error text-on-error font-label-bold text-xs rounded hover:bg-red-800 transition-colors shadow-sm">
              Log &amp; Escalate to Faculty Advisor
            </button>
          </form>
        </div>

      </div>

      <!-- Ticket chat dialog overlay -->
      <div v-if="activeChatTicket" class="fixed inset-0 bg-primary/40 z-50 flex items-center justify-center p-md">
        <div class="bg-white border border-outline-variant rounded-xl w-full max-w-lg shadow-lg flex flex-col h-[500px]" @click.stop>
          <div class="p-md border-b border-outline-variant flex justify-between items-center bg-slate-50 rounded-t-xl">
            <div>
              <h3 class="font-headline-sm text-sm font-bold text-primary">Resolve Ticket: {{ activeChatTicket.id }}</h3>
              <p class="text-[10px] text-on-surface-variant">Submitted by: {{ activeChatTicket.user }}</p>
            </div>
            <button @click="activeChatTicket = null" class="p-1 hover:bg-slate-200 rounded-full">
              <span class="material-symbols-outlined text-xl">close</span>
            </button>
          </div>
          
          <!-- Chat messages area -->
          <div class="flex-grow p-md overflow-y-auto space-y-sm bg-slate-50/50">
            <div 
              v-for="(m, idx) in activeChatTicket.messages" 
              :key="idx"
              :class="[m.sender === store.currentUser?.name ? 'text-right justify-end ml-12' : 'text-left justify-start mr-12']"
              class="flex flex-col text-xs"
            >
              <div 
                :class="[m.sender === store.currentUser?.name ? 'bg-primary text-on-primary rounded-br-none' : 'bg-white text-primary rounded-bl-none border border-outline-variant/50']"
                class="p-sm rounded-lg shadow-sm max-w-xs inline-block"
              >
                <p class="font-bold text-[9px] mb-0.5" :class="[m.sender === store.currentUser?.name ? 'text-secondary-container' : 'text-secondary']">{{ m.sender }}</p>
                <p>{{ m.text }}</p>
              </div>
              <span class="text-[9px] text-outline mt-1 block px-1">{{ m.time }}</span>
            </div>
          </div>
          
          <!-- Chat Reply Input -->
          <form @submit.prevent="sendReply" class="p-sm border-t border-outline-variant flex gap-sm bg-white rounded-b-xl">
            <input v-model="replyText" class="flex-grow border border-outline-variant rounded px-3 py-2 text-xs outline-none focus:border-primary" placeholder="Type your response..." required />
            <button type="submit" class="bg-primary hover:bg-surface-tint text-on-primary px-4 py-2 rounded text-xs font-bold shadow-sm">Send</button>
          </form>
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

const feedback = ref('')
const replyText = ref('')
const activeChatTicket = ref(null)

const disForm = reactive({
  event: 'Winter Classic Tennis',
  subject: '',
  details: ''
})

const openTickets = computed(() => {
  return store.tickets.filter(t => t.status !== 'Resolved')
})

const openChat = (ticket) => {
  activeChatTicket.value = ticket
}

const sendReply = () => {
  if (!replyText.value.trim() || !activeChatTicket.value || !store.currentUser) return
  store.replyTicket(activeChatTicket.value.id, store.currentUser.name, replyText.value)
  replyText.value = ''
}

const resolveTicket = (id) => {
  store.resolveTicket(id)
  alert(`Ticket ${id} marked Resolved.`)
}

const submitDispute = () => {
  if (!store.currentUser) return
  store.escalateDispute(disForm.event, store.currentUser.name, disForm.subject, disForm.details)
  feedback.value = 'Dispute logged and escalated successfully to the Faculty Advisor!'
  disForm.subject = ''
  disForm.details = ''
  setTimeout(() => { feedback.value = '' }, 4000)
}
</script>
