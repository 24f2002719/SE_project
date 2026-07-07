<template>
  <PortalLayout>
    <div class="space-y-gutter">
      <!-- Title -->
      <header class="flex justify-between items-end border-b border-outline-variant pb-sm">
        <div>
          <h1 class="font-display-lg text-display-lg font-bold text-primary tracking-tight">Schedule Training Class</h1>
          <p class="font-body-lg text-body-lg text-on-surface-variant">Schedule coaching sessions and reserve training slots.</p>
        </div>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        
        <!-- Form (Span 4) -->
        <div class="lg:col-span-4 bg-white border border-outline-variant rounded-xl p-md shadow-sm h-fit">
          <h2 class="font-headline-sm text-sm font-bold text-primary mb-md border-b border-outline-variant pb-sm flex items-center gap-xs">
            <span class="material-symbols-outlined text-secondary">calendar_today</span>
            {{ editingSession ? 'Edit Training Session' : 'Class Scheduler' }}
          </h2>

          <div v-if="feedback" class="bg-green-50 border border-green-200 text-green-800 p-sm rounded-lg text-xs font-semibold mb-md">
            {{ feedback }}
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-md">
            <div class="space-y-1">
              <label class="block font-label-bold text-xs text-on-surface-variant">Class Title</label>
              <input v-model="form.title" class="w-full bg-slate-50 border border-outline-variant rounded px-3 py-2.5 font-body-sm outline-none focus:border-primary" placeholder="Advanced Badminton Drills" required type="text" />
            </div>
            
            <div class="space-y-1">
              <label class="block font-label-bold text-xs text-on-surface-variant">Sport Type</label>
              <select v-model="form.sport" class="w-full bg-slate-50 border border-outline-variant rounded px-3 py-2.5 font-body-sm outline-none focus:border-primary">
                <option>Badminton</option>
                <option>Volleyball</option>
                <option>Tennis</option>
                <option>Swimming</option>
              </select>
            </div>

            <div class="space-y-1">
              <label class="block font-label-bold text-xs text-on-surface-variant">Select Facility Court</label>
              <select v-model="form.facility" class="w-full bg-slate-50 border border-outline-variant rounded px-3 py-2.5 font-body-sm outline-none focus:border-primary">
                <option v-for="c in store.courts" :key="c.id" :value="c.name">
                  {{ c.name }}
                </option>
              </select>
            </div>

            <div class="space-y-1">
              <label class="block font-label-bold text-xs text-on-surface-variant">Session Date</label>
              <input v-model="form.date" type="date" class="w-full bg-slate-50 border border-outline-variant rounded px-3 py-2.5 font-body-sm outline-none focus:border-primary" required />
            </div>

            <div class="space-y-1">
              <label class="block font-label-bold text-xs text-on-surface-variant">Session Time</label>
              <input v-model="form.time" class="w-full bg-slate-50 border border-outline-variant rounded px-3 py-2.5 font-body-sm outline-none focus:border-primary" placeholder="18:00 - 19:30" required type="text" />
            </div>

            <button 
              type="submit" 
              class="w-full bg-primary hover:bg-surface-tint text-on-primary font-label-bold text-label-bold py-3 rounded transition-colors shadow-sm mt-md"
            >
              {{ editingSession ? 'Update Session' : 'Schedule Session' }}
            </button>
            <button 
              v-if="editingSession"
              type="button"
              @click="cancelEdit"
              class="w-full border border-outline-variant hover:bg-slate-50 text-on-surface-variant font-label-bold text-label-bold py-2.5 rounded transition-colors shadow-sm mt-2"
            >
              Cancel Edit
            </button>
          </form>
        </div>

        <!-- Coach sessions calendar list (Span 8) -->
        <div class="lg:col-span-8 bg-white border border-outline-variant rounded-xl p-md shadow-sm">
          <h2 class="font-headline-sm text-sm font-bold text-primary mb-md pb-sm border-b border-outline-variant">
            My Training Schedule
          </h2>

          <div class="space-y-sm">
            <div 
              v-for="s in myScheduledSessions" 
              :key="s.id"
              class="border border-outline-variant rounded-lg p-sm bg-slate-50/50 flex justify-between items-center"
            >
              <div>
                <h3 class="font-headline-sm text-xs font-bold text-primary">{{ s.title }}</h3>
                <p class="text-xs text-on-surface-variant mt-1">Sport: {{ s.sport }} • Location: {{ s.facility }}</p>
                <p class="text-xs text-on-surface-variant mt-0.5">Time: {{ s.date }} @ {{ s.time }}</p>
              </div>
              <div class="flex items-center gap-xs">
                <button 
                  @click="startEdit(s)"
                  class="p-1.5 text-secondary hover:bg-orange-50 rounded transition-colors flex items-center justify-center"
                  title="Edit Session"
                >
                  <span class="material-symbols-outlined text-[20px]">edit</span>
                </button>
                <button 
                  @click="handleDelete(s.id)"
                  class="p-1.5 text-error hover:bg-red-50 rounded transition-colors flex items-center justify-center"
                  title="Remove Session"
                >
                  <span class="material-symbols-outlined text-[20px]">delete</span>
                </button>
              </div>
            </div>
            
            <div v-if="myScheduledSessions.length === 0" class="text-center py-xl text-sm text-on-surface-variant">
              No sessions scheduled yet.
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

const feedback = ref('')
const editingSession = ref(null)

const form = reactive({
  title: '',
  sport: 'Badminton',
  facility: 'Badminton Court A',
  date: new Date().toISOString().split('T')[0],
  time: '18:00 - 19:30'
})

const myScheduledSessions = computed(() => {
  if (!store.currentUser) return []
  return store.attendance.filter(s => s.coach === store.currentUser.name)
})

const startEdit = (session) => {
  editingSession.value = session
  form.title = session.title
  form.sport = session.sport
  form.facility = session.facility
  form.date = session.date
  form.time = session.time
}

const cancelEdit = () => {
  editingSession.value = null
  form.title = ''
  form.sport = 'Badminton'
  form.facility = 'Badminton Court A'
  form.date = new Date().toISOString().split('T')[0]
  form.time = '18:00 - 19:30'
}

const handleDelete = (id) => {
  if (confirm('Are you sure you want to remove this coaching session?')) {
    store.deleteSession(id)
    feedback.value = 'Coaching session removed successfully.'
    setTimeout(() => { feedback.value = '' }, 4000)
    if (editingSession.value && editingSession.value.id === id) {
      cancelEdit()
    }
  }
}

const handleSubmit = () => {
  if (!store.currentUser) return
  if (editingSession.value) {
    store.updateSession(
      editingSession.value.id,
      form.sport,
      form.date,
      form.time,
      form.title,
      form.facility
    )
    feedback.value = 'Coaching session updated successfully!'
    cancelEdit()
  } else {
    store.createSession(
      store.currentUser.name,
      form.sport,
      form.date,
      form.time,
      form.title,
      form.facility
    )
    feedback.value = 'Coaching session scheduled successfully!'
    form.title = ''
  }
  setTimeout(() => { feedback.value = '' }, 4000)
}
</script>
