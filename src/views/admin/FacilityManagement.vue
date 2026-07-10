<template>
  <PortalLayout>
    <div class="space-y-gutter">
      <!-- Header -->
      <header class="bg-white border-b border-outline-variant px-margin-desktop py-md flex justify-between items-center shrink-0 rounded-xl shadow-sm">
        <div>
          <h2 class="font-headline-sm text-sm font-bold text-primary">Facility Management Control Panel</h2>
          <p class="text-xs text-on-surface-variant mt-1">Manage court status, maintenance blockouts, and gym equipment registries.</p>
        </div>
        <button 
          @click="openAddFacilityModal"
          class="px-4 py-2.5 bg-primary text-white rounded-lg text-xs font-label-bold hover:bg-surface-tint transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
        >
          <span class="material-symbols-outlined text-sm font-bold">add</span>
          Add Facility
        </button>
      </header>

      <!-- Stats overview -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-gutter">
        <div class="glass-panel rounded-lg p-md flex items-center gap-md shadow-sm">
          <div class="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white">
            <span class="material-symbols-outlined">sports_tennis</span>
          </div>
          <div>
            <p class="text-xs text-on-surface-variant font-semibold">Total Courts Active</p>
            <p class="font-headline-md text-sm font-bold text-primary">{{ activeCourtsCount }} / {{ store.courts.length }}</p>
          </div>
        </div>
        <div class="glass-panel rounded-lg p-md flex items-center gap-md shadow-sm">
          <div class="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-white">
            <span class="material-symbols-outlined">group</span>
          </div>
          <div>
            <p class="text-xs text-on-surface-variant font-semibold">Today's Inducted Footfall</p>
            <p class="font-headline-md text-sm font-bold text-primary">1,204 Athletes</p>
          </div>
        </div>
        <div class="glass-panel rounded-lg p-md flex items-center gap-md shadow-sm">
          <div class="w-12 h-12 rounded-full bg-error-container flex items-center justify-center text-on-error-container">
            <span class="material-symbols-outlined">build</span>
          </div>
          <div>
            <p class="text-xs text-on-surface-variant font-semibold">Maintenance Blocks</p>
            <p class="font-headline-md text-sm font-bold text-error">{{ maintenanceCount }} Active</p>
          </div>
        </div>
      </div>

      <!-- Main Panels split -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        <!-- Live Facility Grid (Span 8) -->
        <div class="lg:col-span-8 bg-white border border-outline-variant rounded-xl p-md shadow-sm">
          <div class="flex justify-between items-center mb-md border-b border-outline-variant pb-sm">
            <h3 class="font-headline-sm text-sm font-bold text-primary">Live Facility Grid</h3>
            <span class="text-xs bg-slate-100 text-on-surface-variant px-2.5 py-0.5 rounded-full font-semibold">Status Sync</span>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-md">
            <div 
              v-for="c in store.courts" 
              :key="c.id" 
              class="border border-outline-variant rounded-lg p-sm relative overflow-hidden bg-slate-50/20"
            >
              <div class="absolute left-0 top-0 bottom-0 w-1" :style="{ backgroundColor: c.accent }"></div>
              <div class="pl-sm">
                <div class="flex justify-between items-start mb-2">
                  <h4 class="font-headline-sm text-xs font-bold text-primary">{{ c.name }}</h4>
                  <span 
                    :class="[
                      c.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' :
                      c.status === 'BOOKED' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                    ]" 
                    class="px-2 py-0.5 rounded text-[8px] font-bold"
                  >
                    {{ c.status }}
                  </span>
                </div>
                <p class="text-xs text-on-surface-variant mt-1">{{ c.time }}</p>
                <p class="text-[10px] text-outline mt-1 mb-xs">Next: {{ c.next }}</p>

                <!-- Embedded Equipment Log for this Facility -->
                <div class="mt-xs pt-xs border-t border-outline-variant/30 space-y-1 mb-sm">
                  <p class="font-label-bold text-[9px] uppercase text-outline tracking-wider flex items-center gap-0.5">
                    <span class="material-symbols-outlined text-[10px]">fitness_center</span>
                    Facility Equipment
                  </p>
                  <div class="space-y-1">
                    <div 
                      v-for="eq in getCourtEquipment(c.id)" 
                      :key="eq.id" 
                      class="flex items-center justify-between text-[11px] bg-white p-1.5 rounded border border-outline-variant/20 shadow-sm"
                    >
                      <div class="truncate mr-1">
                        <span class="font-bold text-primary">{{ eq.name }}</span>
                        <span v-if="eq.notes" class="block text-[9px] text-outline truncate italic">{{ eq.notes }}</span>
                      </div>
                      <div class="flex items-center gap-1 shrink-0">
                        <span 
                          :class="[
                            eq.status === 'Active' ? 'bg-green-50 text-green-700' : 
                            eq.status === 'Damaged' ? 'bg-red-50 text-error' : 'bg-yellow-50 text-yellow-700'
                          ]"
                          class="px-1 py-0.5 rounded text-[8px] font-bold"
                        >
                          {{ eq.status }}
                        </span>
                        <!-- Quick Action Toggle inside grid -->
                        <button 
                          v-if="eq.status === 'Active'" 
                          @click.stop="reportDamage(eq.id)"
                          class="text-error hover:bg-red-50 p-0.5 rounded cursor-pointer"
                          title="Report Damage"
                        >
                          <span class="material-symbols-outlined text-xs">report_problem</span>
                        </button>
                        <button 
                          v-else 
                          @click.stop="orderRestock(eq.id)"
                          class="text-green-700 hover:bg-green-50 p-0.5 rounded cursor-pointer"
                          title="Settle / Restock"
                        >
                          <span class="material-symbols-outlined text-xs">check_circle</span>
                        </button>
                      </div>
                    </div>
                    <p v-if="!getCourtEquipment(c.id).length" class="text-[10px] text-on-surface-variant italic pl-1">
                      No registered equipment.
                    </p>
                  </div>
                </div>
                
                <div class="flex gap-1.5 text-xs">
                  <button 
                    v-if="c.status !== 'MAINTENANCE'"
                    @click="toggleMaintenanceBlock(c.id, true)"
                    class="flex-grow bg-primary hover:bg-surface-tint text-on-primary py-1.5 rounded font-semibold transition-colors cursor-pointer text-center text-[10px]"
                  >
                    Block Maint.
                  </button>
                  <button 
                    v-else
                    @click="toggleMaintenanceBlock(c.id, false)"
                    class="flex-grow bg-green-700 hover:bg-green-800 text-white py-1.5 rounded font-semibold transition-colors cursor-pointer text-center text-[10px]"
                  >
                    Clear Block
                  </button>
                  <button 
                    @click="openEditFacilityModal(c)"
                    class="px-2 py-1.5 border border-outline-variant hover:bg-slate-50 text-primary rounded font-semibold transition-colors cursor-pointer flex items-center"
                    title="Edit Facility"
                  >
                    <span class="material-symbols-outlined text-xs">edit</span>
                  </button>
                  <button 
                    @click="deleteFacility(c.id, c.name)"
                    class="px-2 py-1.5 border border-red-200 hover:bg-red-50 text-error rounded font-semibold transition-colors cursor-pointer flex items-center"
                    title="Delete Facility"
                  >
                    <span class="material-symbols-outlined text-xs">delete</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Equipment Inventory Registry (Span 4) -->
        <div class="lg:col-span-4 bg-white border border-outline-variant rounded-xl p-md shadow-sm space-y-md">
          <div class="flex justify-between items-center border-b border-outline-variant pb-sm">
            <h3 class="font-headline-sm text-sm font-bold text-primary flex items-center gap-2">
              <span class="material-symbols-outlined text-secondary">fitness_center</span>
              Equipment Registry Log
            </h3>
            <button 
              @click="openAddEquipModal" 
              class="px-2.5 py-1 bg-secondary text-white rounded text-[10px] font-label-bold hover:bg-secondary-container transition-colors flex items-center gap-0.5 shadow-sm cursor-pointer"
            >
              <span class="material-symbols-outlined text-xs font-bold">add</span>
              Log Item
            </button>
          </div>
          
          <div class="space-y-sm max-h-[850px] overflow-y-auto text-xs pr-1">
            <div 
              v-for="eq in store.equipment" 
              :key="eq.id"
              class="p-sm border border-outline-variant rounded-lg bg-slate-50/30 hover:bg-slate-50 hover:shadow-sm transition-all space-y-2"
            >
              <div class="flex justify-between items-start">
                <div>
                  <span class="px-1.5 py-0.5 rounded bg-slate-100 text-slate-800 text-[8px] font-mono font-bold">{{ eq.id }}</span>
                  <h4 class="font-bold text-primary text-xs mt-1">{{ eq.name }}</h4>
                </div>
                <span 
                  :class="[
                    eq.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200' : 
                    eq.status === 'Damaged' ? 'bg-red-50 text-error border-red-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                  ]"
                  class="px-2.5 py-0.5 rounded-full border text-[9px] font-bold"
                >
                  {{ eq.status }}
                </span>
              </div>
              
              <div class="space-y-1 text-[10px] text-on-surface-variant">
                <p class="flex items-center gap-1">
                  <span class="material-symbols-outlined text-xs">speed</span>
                  <span>Usage Load: <span class="font-semibold text-primary">{{ eq.usage }}</span></span>
                </p>
                <p class="flex items-center gap-1">
                  <span class="material-symbols-outlined text-xs">calendar_today</span>
                  <span>Last Checked: {{ eq.lastCheck }}</span>
                </p>
                <p v-if="eq.notes" class="flex items-start gap-1 p-1 bg-slate-100/50 rounded mt-1 italic text-slate-600">
                  <span class="material-symbols-outlined text-[10px] mt-0.5">sticky_note_2</span>
                  <span>{{ eq.notes }}</span>
                </p>
              </div>

              <div class="flex gap-2 pt-1 border-t border-outline-variant/30 justify-end">
                <button 
                  v-if="eq.status === 'Active'" 
                  @click="reportDamage(eq.id)"
                  class="px-3 py-1 border border-red-200 text-error hover:bg-error hover:text-white rounded text-[10px] font-bold transition-all flex items-center gap-0.5 cursor-pointer"
                >
                  <span class="material-symbols-outlined text-xs">report_problem</span>
                  Report Damage
                </button>
                <button 
                  v-else 
                  @click="orderRestock(eq.id)"
                  class="px-3 py-1 bg-green-700 text-white hover:bg-green-800 rounded text-[10px] font-bold transition-all flex items-center gap-0.5 cursor-pointer"
                >
                  <span class="material-symbols-outlined text-xs">check_circle</span>
                  Settle / Restock
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Log New Equipment Modal -->
    <div v-if="showAddEquipModal" class="fixed inset-0 bg-primary/40 backdrop-blur-sm z-50 flex items-center justify-center p-md">
      <form @submit.prevent="submitAddEquipment" class="bg-white border border-outline-variant rounded-xl w-full max-w-md shadow-lg flex flex-col p-md space-y-md animate-fade-in" @click.stop>
        <div class="flex justify-between items-center border-b border-outline-variant pb-sm">
          <h3 class="font-headline-sm text-sm font-bold text-primary flex items-center gap-1">
            <span class="material-symbols-outlined text-secondary">fitness_center</span>
            Log New Equipment
          </h3>
          <button type="button" @click="showAddEquipModal = false" class="p-1 hover:bg-slate-100 rounded-full cursor-pointer">
            <span class="material-symbols-outlined text-xl">close</span>
          </button>
        </div>
        
        <div class="space-y-1 text-xs">
          <label class="block font-semibold text-on-surface-variant">Equipment Name</label>
          <input v-model="newEquipForm.name" class="w-full bg-slate-50 border border-outline-variant rounded px-3 py-2.5 outline-none focus:border-primary" placeholder="e.g. Tennis Balls Box" required />
        </div>

        <div class="space-y-1 text-xs">
          <label class="block font-semibold text-on-surface-variant">Associated Facility / Court</label>
          <select v-model="newEquipForm.facilityId" class="w-full bg-slate-50 border border-outline-variant rounded px-3 py-2.5 outline-none focus:border-primary" required>
            <option value="" disabled>Select Facility Location</option>
            <option v-for="c in store.courts" :key="c.id" :value="c.id">{{ c.name }}</option>
          </select>
        </div>

        <div class="space-y-1 text-xs">
          <label class="block font-semibold text-on-surface-variant">Usage Load</label>
          <select v-model="newEquipForm.usage" class="w-full bg-slate-50 border border-outline-variant rounded px-3 py-2.5 outline-none focus:border-primary">
            <option value="Low">Low</option>
            <option value="Normal">Normal</option>
            <option value="High">High</option>
          </select>
        </div>

        <div class="space-y-1 text-xs">
          <label class="block font-semibold text-on-surface-variant">Initial Status</label>
          <select v-model="newEquipForm.status" class="w-full bg-slate-50 border border-outline-variant rounded px-3 py-2.5 outline-none focus:border-primary">
            <option value="Active">Active</option>
            <option value="Damaged">Damaged</option>
            <option value="Pending Restock">Pending Restock</option>
          </select>
        </div>

        <div class="space-y-1 text-xs">
          <label class="block font-semibold text-on-surface-variant">Description / Notes</label>
          <input v-model="newEquipForm.notes" class="w-full bg-slate-50 border border-outline-variant rounded px-3 py-2.5 outline-none focus:border-primary" placeholder="e.g. Installed new tensioner hook" />
        </div>

        <button type="submit" class="w-full py-2.5 bg-primary text-on-primary font-label-bold text-xs rounded hover:bg-surface-tint transition-all shadow-sm cursor-pointer">
          Register Equipment
        </button>
      </form>
    </div>

    <!-- Add Facility Modal -->
    <div v-if="showAddFacilityModal" class="fixed inset-0 bg-primary/40 backdrop-blur-sm z-50 flex items-center justify-center p-md">
      <form @submit.prevent="submitAddFacility" class="bg-white border border-outline-variant rounded-xl w-full max-w-md shadow-lg flex flex-col p-md space-y-md animate-fade-in" @click.stop>
        <div class="flex justify-between items-center border-b border-outline-variant pb-sm">
          <h3 class="font-headline-sm text-sm font-bold text-primary flex items-center gap-1">
            <span class="material-symbols-outlined text-secondary">build</span>
            Add New Facility
          </h3>
          <button type="button" @click="showAddFacilityModal = false" class="p-1 hover:bg-slate-100 rounded-full cursor-pointer">
            <span class="material-symbols-outlined text-xl">close</span>
          </button>
        </div>
        
        <div class="space-y-1 text-xs">
          <label class="block font-semibold text-on-surface-variant">Facility Name</label>
          <input v-model="facilityForm.name" class="w-full bg-slate-50 border border-outline-variant rounded px-3 py-2.5 outline-none focus:border-primary" placeholder="e.g. Badminton Court C" required />
        </div>

        <div class="space-y-1 text-xs">
          <label class="block font-semibold text-on-surface-variant">Sport Type</label>
          <select v-model="facilityForm.type" class="w-full bg-slate-50 border border-outline-variant rounded px-3 py-2.5 outline-none focus:border-primary" required>
            <option v-for="sport in store.clubs" :key="sport" :value="sport">{{ sport }}</option>
          </select>
        </div>

        <div class="space-y-1 text-xs">
          <label class="block font-semibold text-on-surface-variant">Status</label>
          <select v-model="facilityForm.status" class="w-full bg-slate-50 border border-outline-variant rounded px-3 py-2.5 outline-none focus:border-primary">
            <option value="AVAILABLE">AVAILABLE</option>
            <option value="BOOKED">BOOKED</option>
            <option value="MAINTENANCE">MAINTENANCE</option>
          </select>
        </div>


        <div class="space-y-1 text-xs">
          <label class="block font-semibold text-on-surface-variant">Accent Color Picker</label>
          <div class="flex items-center gap-sm">
            <input type="color" v-model="facilityForm.accent" class="h-10 w-12 border border-outline-variant rounded p-0.5 bg-slate-50 cursor-pointer" />
            <span class="text-xs font-mono text-outline">{{ facilityForm.accent }}</span>
          </div>
        </div>

        <button type="submit" class="w-full py-2.5 bg-primary text-on-primary font-label-bold text-xs rounded hover:bg-surface-tint transition-all shadow-sm cursor-pointer">
          Create Facility
        </button>
      </form>
    </div>

    <!-- Edit Facility Modal -->
    <div v-if="showEditFacilityModal" class="fixed inset-0 bg-primary/40 backdrop-blur-sm z-50 flex items-center justify-center p-md">
      <form @submit.prevent="submitEditFacility" class="bg-white border border-outline-variant rounded-xl w-full max-w-md shadow-lg flex flex-col p-md space-y-md animate-fade-in" @click.stop>
        <div class="flex justify-between items-center border-b border-outline-variant pb-sm">
          <h3 class="font-headline-sm text-sm font-bold text-primary flex items-center gap-1">
            <span class="material-symbols-outlined text-secondary">build</span>
            Edit Facility
          </h3>
          <button type="button" @click="showEditFacilityModal = false" class="p-1 hover:bg-slate-100 rounded-full cursor-pointer">
            <span class="material-symbols-outlined text-xl">close</span>
          </button>
        </div>
        
        <div class="space-y-1 text-xs">
          <label class="block font-semibold text-on-surface-variant">Facility Name</label>
          <input v-model="editFacilityForm.name" class="w-full bg-slate-50 border border-outline-variant rounded px-3 py-2.5 outline-none focus:border-primary" placeholder="e.g. Badminton Court C" required />
        </div>

        <div class="space-y-1 text-xs">
          <label class="block font-semibold text-on-surface-variant">Sport Type</label>
          <select v-model="editFacilityForm.type" class="w-full bg-slate-50 border border-outline-variant rounded px-3 py-2.5 outline-none focus:border-primary" required>
            <option v-for="sport in store.clubs" :key="sport" :value="sport">{{ sport }}</option>
          </select>
        </div>

        <div class="space-y-1 text-xs">
          <label class="block font-semibold text-on-surface-variant">Status</label>
          <select v-model="editFacilityForm.status" class="w-full bg-slate-50 border border-outline-variant rounded px-3 py-2.5 outline-none focus:border-primary">
            <option value="AVAILABLE">AVAILABLE</option>
            <option value="BOOKED">BOOKED</option>
            <option value="MAINTENANCE">MAINTENANCE</option>
          </select>
        </div>



        <div class="space-y-1 text-xs">
          <label class="block font-semibold text-on-surface-variant">Accent Color Picker</label>
          <div class="flex items-center gap-sm">
            <input type="color" v-model="editFacilityForm.accent" class="h-10 w-12 border border-outline-variant rounded p-0.5 bg-slate-50 cursor-pointer" />
            <span class="text-xs font-mono text-outline">{{ editFacilityForm.accent }}</span>
          </div>
        </div>

        <button type="submit" class="w-full py-2.5 bg-primary text-on-primary font-label-bold text-xs rounded hover:bg-surface-tint transition-all shadow-sm cursor-pointer">
          Save Changes
        </button>
      </form>
    </div>
  </PortalLayout>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import PortalLayout from '../../layouts/PortalLayout.vue'
import { useClubStore } from '../../stores/clubStore'

const store = useClubStore()

const showAddEquipModal = ref(false)
const showAddFacilityModal = ref(false)
const showEditFacilityModal = ref(false)

const newEquipForm = reactive({
  name: '',
  facilityId: '',
  usage: 'Normal',
  status: 'Active',
  notes: ''
})

const facilityForm = reactive({
  name: '',
  type: 'Badminton',
  status: 'AVAILABLE',
  time: 'Open now',
  accent: '#10B981'
})

const editFacilityForm = reactive({
  id: '',
  name: '',
  type: 'Badminton',
  status: 'AVAILABLE',
  time: 'Open now',
  next: 'Open',
  accent: '#10B981'
})

const getCourtEquipment = (courtId) => {
  return store.equipment.filter(eq => eq.facilityId === courtId)
}

const activeCourtsCount = computed(() => {
  return store.courts.filter(c => c.status !== 'MAINTENANCE').length
})

const maintenanceCount = computed(() => {
  return store.courts.filter(c => c.status === 'MAINTENANCE').length
})

const toggleMaintenanceBlock = (courtId, isBlock) => {
  if (isBlock) {
    const reason = prompt('Specify maintenance reason:', 'Post tensioner breakdown / Net repair')
    if (reason !== null) {
      store.overrideBooking(courtId, 'MAINTENANCE', reason)
    }
  } else {
    store.overrideBooking(courtId, 'AVAILABLE')
  }
}

const reportDamage = (equipId) => {
  const notes = prompt('Specify damage details:')
  if (notes) {
    store.reportEquipmentDamage(equipId, notes)
  }
}

const orderRestock = (equipId) => {
  store.restockEquipment(equipId)
  alert('Equipment item status updated to Active / Settle.')
}

const openAddEquipModal = () => {
  newEquipForm.name = ''
  newEquipForm.facilityId = ''
  newEquipForm.usage = 'Normal'
  newEquipForm.status = 'Active'
  newEquipForm.notes = ''
  showAddEquipModal.value = true
}

const submitAddEquipment = () => {
  store.addEquipment(
    newEquipForm.name,
    newEquipForm.facilityId,
    newEquipForm.usage,
    newEquipForm.status,
    newEquipForm.notes
  )
  showAddEquipModal.value = false
  alert(`Equipment "${newEquipForm.name}" registered successfully.`)
}

const openAddFacilityModal = () => {
  facilityForm.name = ''
  facilityForm.type = store.clubs[0] || 'Badminton'
  facilityForm.status = 'AVAILABLE'
  facilityForm.time = 'Open now'
  facilityForm.accent = '#10B981'
  showAddFacilityModal.value = true
}

const submitAddFacility = () => {
  store.addCourt(
    facilityForm.name,
    facilityForm.type,
    facilityForm.status,
    facilityForm.time,
    'Open',
    facilityForm.accent
  )
  showAddFacilityModal.value = false
  alert(`Facility "${facilityForm.name}" created successfully.`)
}

const openEditFacilityModal = (court) => {
  editFacilityForm.id = court.id
  editFacilityForm.name = court.name
  editFacilityForm.type = court.type
  editFacilityForm.status = court.status
  editFacilityForm.time = court.time
  editFacilityForm.next = court.next
  editFacilityForm.accent = court.accent
  showEditFacilityModal.value = true
}

const submitEditFacility = () => {
  store.updateCourt(editFacilityForm.id, {
    name: editFacilityForm.name,
    type: editFacilityForm.type,
    status: editFacilityForm.status,
    time: editFacilityForm.time,
    next: editFacilityForm.next,
    accent: editFacilityForm.accent
  })
  showEditFacilityModal.value = false
  alert(`Facility "${editFacilityForm.name}" updated successfully.`)
}

const deleteFacility = (id, name) => {
  if (confirm(`Are you sure you want to delete facility "${name}"? This will also remove any bookings and equipment associated with this facility.`)) {
    store.deleteCourt(id)
    alert(`Facility "${name}" deleted successfully.`)
  }
}
</script>
