<template>
  <PortalLayout>
    <div class="space-y-gutter">
      <!-- Header -->
      <header class="mb-xl flex flex-col md:flex-row md:items-end justify-between gap-md border-b border-outline-variant pb-sm">
        <div>
          <h1 class="font-display-lg text-display-lg font-bold text-primary mb-2">Membership &amp; Financials</h1>
          <p class="font-body-lg text-body-lg text-on-surface-variant">Manage your account tier, payments, and club access.</p>
        </div>
      </header>

      <!-- Bento Grid Layout -->
      <div class="grid grid-cols-1 md:grid-cols-12 gap-gutter">
        
        <!-- Digital Membership Card (Bento Item 1 - Wide, Span 8) -->
        <div class="md:col-span-8 glass-card rounded-xl p-0 overflow-hidden relative group shadow-sm hover:shadow-md transition-shadow">
          <div class="absolute inset-0 bg-gradient-to-br from-surface-container-highest to-white opacity-60 z-0"></div>
          
          <div class="relative z-10 p-md flex flex-col sm:flex-row h-full gap-md justify-between">
            <!-- Card Details -->
            <div class="flex-1 flex flex-col justify-between">
              <div>
                <div class="flex items-center gap-2 mb-4">
                  <span class="material-symbols-outlined text-secondary-container text-2xl">workspace_premium</span>
                  <span class="font-label-bold text-label-bold text-secondary-container uppercase tracking-wider">{{ store.currentUser?.tier }} Tier Member</span>
                </div>
                <h2 class="font-headline-md text-headline-md text-primary mb-1">{{ store.currentUser?.name }}</h2>
                <p class="font-body-md text-xs text-on-surface-variant">ID: NEX-{{ store.currentUser?.name[0] }}{{ store.currentUser?.name[5] || 'A' }}-8829-M</p>
              </div>
              
              <div class="mt-xl">
                <div class="flex items-center gap-2 text-on-surface text-xs font-semibold">
                  <span class="material-symbols-outlined text-sm text-green-600">verified</span>
                  <span>Eligible for Inter-Institute Tournament Selection</span>
                </div>
                <p class="font-body-sm text-[10px] text-on-surface-variant mt-1">Status valid until Nov 2026</p>
              </div>
            </div>

            <!-- QR Code Area -->
            <div class="sm:w-48 flex flex-col items-center justify-center bg-white rounded-lg p-4 border border-outline-variant shadow-inner">
              <div class="w-32 h-32 bg-gradient-to-br from-primary to-secondary rounded-md flex items-center justify-center mb-3">
                <span class="material-symbols-outlined text-white text-6xl">qr_code_2</span>
              </div>
              <span class="font-label-bold text-[10px] text-on-surface-variant text-center">Scan at Desk for Gym Entry</span>
            </div>
          </div>
        </div>

        <!-- Renewal CTA (Bento Item 2 - Tall, Span 4) -->
        <div class="md:col-span-4 bg-white rounded-xl p-md border border-outline-variant flex flex-col justify-between shadow-sm relative overflow-hidden">
          <div class="absolute -right-8 -top-8 w-32 h-32 bg-secondary-fixed-dim rounded-full blur-2xl opacity-20 pointer-events-none"></div>
          
          <div>
            <h3 class="font-headline-sm text-sm font-bold text-primary mb-2">Membership Renewal</h3>
            <div class="font-display-lg text-display-lg text-secondary-container mb-1">
              {{ store.currentUser?.membershipDue > 0 ? 'Dues Pending' : '14 Days' }}
            </div>
            <p class="font-body-sm text-xs text-on-surface-variant">
              {{ store.currentUser?.membershipDue > 0 ? 'You have unpaid annual membership fees.' : 'Until your annual Pro Tier expires.' }}
            </p>
          </div>

          <div class="mt-lg">
            <div class="flex justify-between items-center mb-4 border-t border-outline-variant pt-4 text-xs font-semibold">
              <span class="text-on-surface">Annual Fee</span>
              <span class="font-headline-sm text-primary">${{ store.currentUser?.tier === 'Pro' ? '1,200' : '600' }}</span>
            </div>
            
            <button 
              @click="payAllPendingDues"
              :disabled="store.currentUser?.membershipDue === 0"
              :class="[store.currentUser?.membershipDue === 0 ? 'bg-slate-300 cursor-not-allowed text-slate-500' : 'bg-secondary-container hover:bg-secondary text-white']"
              class="w-full font-label-bold text-label-bold py-3 px-6 rounded-lg transition-colors shadow-sm flex justify-center items-center gap-2"
            >
              <span class="material-symbols-outlined text-sm">credit_card</span>
              {{ store.currentUser?.membershipDue === 0 ? 'Dues Settled' : 'Pay Annual Dues' }}
            </button>
          </div>
        </div>

        <!-- Payment History Table (Bento Item 3 - Full Width, Span 12) -->
        <div class="md:col-span-12 bg-white rounded-xl border border-outline-variant overflow-hidden shadow-sm mt-md">
          <div class="p-md border-b border-outline-variant flex justify-between items-center bg-slate-50">
            <h3 class="font-headline-sm text-sm font-bold text-primary">Payment History</h3>
            <button 
              @click="exportCSV" 
              class="text-secondary-container font-label-bold text-xs hover:text-secondary flex items-center gap-1 transition-colors"
            >
              <span class="material-symbols-outlined text-sm">download</span> Export Receipts (CSV)
            </button>
          </div>
          
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="border-b border-outline-variant bg-white font-label-bold text-label-bold text-xs text-on-surface-variant">
                  <th class="p-4 pl-md font-semibold">Date</th>
                  <th class="p-4 font-semibold">Description</th>
                  <th class="p-4 font-semibold">Amount</th>
                  <th class="p-4 font-semibold">Status</th>
                  <th class="p-4 pr-md font-semibold text-right">Receipt</th>
                </tr>
              </thead>
              <tbody class="font-body-sm text-xs">
                <tr 
                  v-for="p in myPayments" 
                  :key="p.id" 
                  class="border-b border-outline-variant/30 hover:bg-slate-50/20 h-[56px]"
                >
                  <td class="p-4 pl-md text-on-surface">{{ p.date }}</td>
                  <td class="p-4 text-on-surface">{{ p.desc }}</td>
                  <td class="p-4 text-primary font-medium">${{ p.amount.toFixed(2) }}</td>
                  <td class="p-4">
                    <span 
                      :class="[p.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800']"
                      class="inline-flex items-center px-2 py-0.5 rounded-full font-label-bold text-[9px]"
                    >
                      {{ p.status }}
                    </span>
                  </td>
                  <td class="p-4 pr-md text-right">
                    <button 
                      v-if="p.status === 'Paid'"
                      @click="downloadReceipt(p)" 
                      class="text-on-surface-variant hover:text-secondary-container transition-colors p-2 rounded-full hover:bg-slate-100"
                    >
                      <span class="material-symbols-outlined text-xl">receipt_long</span>
                    </button>
                    <button 
                      v-else 
                      @click="paySingleDue(p.id)"
                      class="text-secondary font-label-bold hover:underline text-xs"
                    >
                      Pay Now
                    </button>
                  </td>
                </tr>
                <tr v-if="myPayments.length === 0">
                  <td colspan="5" class="p-4 text-center text-on-surface-variant">No transaction history.</td>
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

const myPayments = computed(() => {
  if (!store.currentUser) return []
  return store.payments.filter(p => p.userEmail === store.currentUser.email)
})

const payAllPendingDues = () => {
  if (!store.currentUser) return
  const pendingTxn = myPayments.value.find(p => p.status === 'Pending')
  if (pendingTxn) {
    store.payDues(store.currentUser.email, pendingTxn.id)
  }
}

const paySingleDue = (id) => {
  if (store.currentUser) {
    store.payDues(store.currentUser.email, id)
  }
}

const downloadReceipt = (p) => {
  // Simulate PDF download
  const content = `NEXSPORT CLUB RECEIPT\nReceipt ID: ${p.receiptId}\nDate: ${p.date}\nDescription: ${p.desc}\nAmount Paid: $${p.amount.toFixed(2)}\nStatus: PAID\n\nThank you for training with NexSport!`
  const blob = new Blob([content], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `Receipt_${p.receiptId}.txt`
  a.click()
}

const exportCSV = () => {
  let csv = 'Date,Description,Amount,Status,ReceiptID\n'
  myPayments.value.forEach(p => {
    csv += `${p.date},"${p.desc}",${p.amount},${p.status},${p.receiptId || ''}\n`
  })
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `Payments_History.csv`
  a.click()
}
</script>
