<template>
  <PortalLayout>
    <div class="space-y-gutter">
      <!-- Title -->
      <header class="mb-lg border-b border-outline-variant pb-sm">
        <h2 class="font-display-lg text-display-lg text-primary">{{ store.currentUser?.role === 'coach' ? 'Coach Support Center' : 'Member Support Center' }}</h2>
        <p class="font-body-lg text-body-lg text-on-surface-variant mt-sm max-w-3xl">
          {{ store.currentUser?.role === 'coach' 
              ? 'How can we help you today? Browse active support cases or raise a new ticket.' 
              : 'How can we help you today? Browse common questions, chat with our FAQ assistant, or raise a support ticket.' 
          }}
        </p>
      </header>

      <!-- Bento Grid Layout -->
      <div class="grid grid-cols-1 md:grid-cols-12 gap-gutter">
        
        <!-- Active Tickets (Left Column, Span 8) -->
        <section :class="[store.currentUser?.role === 'coach' ? 'md:col-span-12' : 'md:col-span-8']" class="space-y-gutter">
          <div class="bg-white border border-outline-variant rounded-xl p-md shadow-sm">
            <div class="flex items-center justify-between mb-md border-b border-outline-variant pb-sm">
              <h3 class="font-headline-sm text-sm font-bold text-primary flex items-center gap-sm">
                <span class="material-symbols-outlined text-secondary">confirmation_number</span>
                Active Support Tickets
              </h3>
              <span class="text-xs bg-slate-100 text-on-surface-variant px-2.5 py-0.5 rounded-full font-semibold">{{ myTickets.length }} Active</span>
            </div>
            
            <div class="space-y-sm">
              <div 
                v-for="t in myTickets" 
                :key="t.id"
                class="group border border-outline-variant rounded-lg p-sm bg-slate-50/50 hover:border-primary transition-colors cursor-pointer"
                @click="openTicketChat(t)"
              >
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-sm">
                  <div class="flex items-start sm:items-center gap-md">
                    <div class="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
                      <span class="material-symbols-outlined text-primary text-xl">
                        {{ t.category === 'Billing & Memberships' ? 'credit_card' : 'build' }}
                      </span>
                    </div>
                    <div>
                      <h4 class="font-headline-sm text-xs font-bold text-on-surface">{{ t.subject }}</h4>
                      <p class="font-body-sm text-[10px] text-on-surface-variant mt-base">Ticket {{ t.id }} • Opened {{ t.date }}</p>
                    </div>
                  </div>
                  <div class="flex items-center gap-sm self-start sm:self-center">
                    <span 
                      :class="[
                        t.status === 'Resolved' ? 'bg-green-100 text-green-800 border-green-200' :
                        t.status === 'In Progress' ? 'bg-yellow-50 text-[#854d0e] border-[#fef08a]' : 
                        'bg-red-50 text-red-800 border-red-200'
                      ]" 
                      class="px-3 py-0.5 rounded-full font-label-bold text-[9px] border"
                    >
                      {{ t.status }}
                    </span>
                    <span class="material-symbols-outlined text-outline group-hover:text-primary transition-colors">chevron_right</span>
                  </div>
                </div>
              </div>

              <div v-if="myTickets.length === 0" class="text-center py-md text-xs text-on-surface-variant">
                You have no active support tickets.
              </div>
            </div>
          </div>
        </section>

        <!-- Live Chat Assistant (Right Column, Span 4) -->
        <section v-if="store.currentUser?.role !== 'coach'" class="md:col-span-4 bg-primary text-on-primary rounded-xl p-md shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[300px]">
          <div class="absolute top-0 right-0 w-32 h-32 bg-secondary rounded-full mix-blend-multiply filter blur-2xl opacity-40 translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
          <div>
            <h3 class="font-headline-md text-sm font-bold text-white relative z-10 flex items-center gap-1">
              <span class="material-symbols-outlined text-secondary-container">support_agent</span>
              FAQ Chatbot Assistant
            </h3>
            <p class="font-body-sm text-xs text-inverse-primary mt-sm relative z-10">Our virtual FAQ assistant is online to help you find quick answers on club protocols.</p>
          </div>

          <!-- Active chatbot console -->
          <div class="bg-white rounded-lg p-sm mt-md flex flex-col h-40 text-black border border-outline-variant shadow-inner overflow-hidden">
            <!-- Messages lists -->
            <div class="flex-grow overflow-y-auto space-y-xs p-xs text-[10px] leading-snug">
              <div v-for="(msg, idx) in chatMessages" :key="idx" :class="[msg.bot ? 'bg-slate-100 text-left mr-6' : 'bg-secondary-container/20 text-right ml-6']" class="p-2 rounded-lg">
                <p class="font-semibold text-[8px] text-on-surface-variant mb-0.5">{{ msg.bot ? 'Assistant' : 'Me' }}</p>
                <p>{{ msg.text }}</p>
              </div>
            </div>
            <!-- Input -->
            <form @submit.prevent="sendBotMessage" class="flex border-t border-outline-variant/30 pt-sm mt-sm">
              <input v-model="botInput" class="flex-grow text-[10px] px-2 py-1 outline-none border border-outline-variant rounded-l" placeholder="Type: cancel, fees, damage..." />
              <button type="submit" class="bg-primary text-on-primary px-3 py-1 rounded-r text-[10px] font-bold">Send</button>
            </form>
          </div>
        </section>

        <!-- Raise a Ticket Form (Left Column, Span 6) -->
        <section :class="[store.currentUser?.role === 'coach' ? 'md:col-span-12' : 'md:col-span-6']" class="bg-white border border-outline-variant rounded-xl p-md shadow-sm">
          <h3 class="font-headline-md text-sm font-bold text-primary mb-md flex items-center gap-sm border-b border-outline-variant pb-sm">
            <span class="material-symbols-outlined text-secondary">edit_document</span>
            Raise a New Ticket
          </h3>
          
          <div v-if="ticketFeedback" class="bg-green-50 border border-green-200 text-green-800 p-sm rounded-lg text-xs font-semibold mb-md">
            {{ ticketFeedback }}
          </div>

          <form @submit.prevent="handleTicketSubmit" class="space-y-md">
            <div class="space-y-1">
              <label class="block font-label-bold text-xs text-on-surface-variant" for="category">Category</label>
              <select v-model="ticketForm.category" class="w-full bg-slate-50 border border-outline-variant rounded px-3 py-2.5 font-body-sm outline-none focus:border-primary" id="category">
                <option>Facility Issue</option>
                <option>Billing &amp; Memberships</option>
                <option>Booking Dispute</option>
                <option>Equipment Damage</option>
                <option>Other</option>
              </select>
            </div>
            <div class="space-y-1">
              <label class="block font-label-bold text-xs text-on-surface-variant" for="subject">Subject</label>
              <input v-model="ticketForm.subject" class="w-full bg-slate-50 border border-outline-variant rounded px-3 py-2.5 font-body-sm outline-none focus:border-primary" id="subject" placeholder="Brief summary of the issue" required type="text"/>
            </div>
            <div class="space-y-1">
              <label class="block font-label-bold text-xs text-on-surface-variant" for="description">Description</label>
              <textarea v-model="ticketForm.description" class="w-full bg-slate-50 border border-outline-variant rounded px-3 py-2.5 font-body-sm outline-none focus:border-primary resize-none" id="description" placeholder="Please provide detailed notes..." rows="3" required></textarea>
            </div>
            <button class="w-full py-2.5 bg-primary text-on-primary font-label-bold text-xs rounded hover:bg-surface-tint transition-colors shadow-sm" type="submit">
              Submit Ticket
            </button>
          </form>
        </section>

        <!-- FAQ Accordion (Right Column, Span 6) -->
        <section v-if="store.currentUser?.role !== 'coach'" class="md:col-span-6 bg-white border border-outline-variant rounded-xl p-md shadow-sm">
          <h3 class="font-headline-md text-sm font-bold text-primary mb-md flex items-center gap-sm border-b border-outline-variant pb-sm">
            <span class="material-symbols-outlined text-secondary">help</span>
            Frequently Asked Questions
          </h3>
          <div class="space-y-sm">
            <div v-for="(faq, idx) in faqs" :key="idx" class="border border-outline-variant rounded-lg overflow-hidden bg-slate-50/50">
              <button 
                @click="toggleFaq(idx)" 
                class="w-full flex items-center justify-between p-sm text-left hover:bg-slate-100 transition-colors focus:outline-none"
              >
                <span class="font-headline-sm text-xs font-semibold text-on-surface">{{ faq.q }}</span>
                <span :class="[faqOpen === idx ? 'rotate-180' : '']" class="material-symbols-outlined text-outline transition-transform duration-200">expand_more</span>
              </button>
              <div v-if="faqOpen === idx" class="px-sm pb-sm text-xs text-on-surface-variant leading-relaxed bg-white">
                <p class="pt-2 border-t border-slate-100">{{ faq.a }}</p>
              </div>
            </div>
          </div>
        </section>

      </div>

      <!-- Ticket chat dialog overlay -->
      <div v-if="activeTicketChat" class="fixed inset-0 bg-primary/40 z-50 flex items-center justify-center p-md">
        <div class="bg-white border border-outline-variant rounded-xl w-full max-w-lg shadow-lg flex flex-col h-[500px]" @click.stop>
          <div class="p-md border-b border-outline-variant flex justify-between items-center bg-slate-50 rounded-t-xl">
            <div>
              <h3 class="font-headline-sm text-sm font-bold text-primary">Ticket Chat: {{ activeTicketChat.id }}</h3>
              <p class="text-[10px] text-on-surface-variant">Subject: {{ activeTicketChat.subject }}</p>
            </div>
            <button @click="activeTicketChat = null" class="p-1 hover:bg-slate-200 rounded-full">
              <span class="material-symbols-outlined text-xl">close</span>
            </button>
          </div>
          
          <!-- Chat messages area -->
          <div class="flex-grow p-md overflow-y-auto space-y-sm bg-slate-50/50">
            <div 
              v-for="(m, idx) in activeTicketChat.messages" 
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
          <form @submit.prevent="sendTicketReply" class="p-sm border-t border-outline-variant flex gap-sm bg-white rounded-b-xl">
            <input v-model="replyText" class="flex-grow border border-outline-variant rounded px-3 py-2 text-xs outline-none focus:border-primary" placeholder="Type your reply..." required />
            <button type="submit" class="bg-primary hover:bg-surface-tint text-on-primary px-4 py-2 rounded text-xs font-bold shadow-sm">Reply</button>
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

const faqOpen = ref(null)
const ticketFeedback = ref('')
const activeTicketChat = ref(null)
const replyText = ref('')

const ticketForm = reactive({
  category: 'Facility Issue',
  subject: '',
  description: ''
})

const myTickets = computed(() => {
  if (!store.currentUser) return []
  return store.tickets.filter(t => t.userEmail === store.currentUser.email)
})

// FAQ chatbot states
const botInput = ref('')
const chatMessages = ref([
  { bot: true, text: 'Hello! I am the NexSport FAQ assistant. Type keywords like "cancel", "fees", "rules", or "damage" to search answers.' }
])

const sendBotMessage = () => {
  if (!botInput.value.trim()) return
  
  const query = botInput.value.toLowerCase()
  chatMessages.value.push({ bot: false, text: botInput.value })
  botInput.value = ''

  setTimeout(() => {
    let reply = 'I am sorry, I did not understand that. Try typing "cancel", "fees", "rules", or "damage".'
    
    if (query.includes('cancel')) {
      reply = 'You can cancel court bookings up to 24 hours in advance in "My Schedule" tab. Late cancellations incur a $10 fee.'
    } else if (query.includes('fee') || query.includes('pay') || query.includes('billing')) {
      reply = 'Annual dues are billed on the 1st. Standard Tier is $600/year, Pro Tier is $1,200/year. Settle dues on the "Payments" tab.'
    } else if (query.includes('damage') || query.includes('broken')) {
      reply = 'Please report damaged court nets or treadmill issues using the "Raise a Ticket" form under the "Equipment Damage" category.'
    } else if (query.includes('rules') || query.includes('safety')) {
      reply = 'Safety instructions require non-marking shoes on courts, cleaning equipment after workout sets, and reporting incidents.'
    }
    
    chatMessages.value.push({ bot: true, text: reply })
  }, 600)
}

const toggleFaq = (idx) => {
  faqOpen.value = faqOpen.value === idx ? null : idx
}

const handleTicketSubmit = () => {
  if (!store.currentUser) return
  store.createTicket(
    store.currentUser.email,
    store.currentUser.name,
    ticketForm.category,
    ticketForm.subject,
    ticketForm.description
  )
  ticketFeedback.value = 'Support ticket submitted successfully! Check the active list.'
  ticketForm.subject = ''
  ticketForm.description = ''
  setTimeout(() => { ticketFeedback.value = '' }, 4000)
}

const openTicketChat = (ticket) => {
  activeTicketChat.value = ticket
}

const sendTicketReply = () => {
  if (!replyText.value.trim() || !activeTicketChat.value || !store.currentUser) return
  store.replyTicket(activeTicketChat.value.id, store.currentUser.name, replyText.value)
  replyText.value = ''
}

const faqs = [
  { q: 'How do I cancel a facility booking?', a: 'You can cancel a booking up to 24 hours in advance through the "My Schedule" tab. Cancellations made within 24 hours may be subject to a late fee as per club policy.' },
  { q: 'When is my monthly membership billed?', a: 'Monthly memberships are billed automatically on the 1st of every month to your default payment method on file. You can update your payment method in the "Payments" section.' },
  { q: 'What if a court is damaged upon arrival?', a: 'Please take a photo immediately and raise a ticket using the "Equipment Damage" category on this page. Do not attempt to use damaged equipment for your safety.' },
  { q: 'How is selection for ISM conducted?', a: 'Selection for Inter-Institute Sports Meet is conducted by club coaches. Eligible athletes must maintain a training attendance rate of 75% or higher to qualify for trials.' }
]
</script>
