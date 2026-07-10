<template>
  <PortalLayout>
    <div class="space-y-gutter">
      <!-- Header -->
      <header class="flex justify-between items-end border-b border-outline-variant pb-sm">
        <div>
          <h1 class="font-display-lg text-display-lg font-bold text-primary tracking-tight">Personal Profile</h1>
          <p class="font-body-lg text-body-lg text-on-surface-variant mt-2">Manage your athlete credentials and account security.</p>
        </div>
      </header>

      <!-- Bento Grid Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        
        <!-- Profile Summary & Details (Span 7) -->
        <div class="lg:col-span-7 bg-white border border-outline-variant rounded-xl p-md shadow-sm space-y-md">
          <div class="border-b border-outline-variant pb-sm flex justify-between items-center">
            <h2 class="font-headline-sm text-sm font-bold text-primary flex items-center gap-xs">
              <span class="material-symbols-outlined text-secondary">badge</span>
              Account Details
            </h2>
            <span class="text-xs bg-slate-100 text-on-surface-variant px-2.5 py-0.5 rounded-full font-semibold capitalize">{{ store.currentUser?.role }} Account</span>
          </div>

          <div v-if="profileFeedback" :class="[profileFeedback.success ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800']" class="p-sm border rounded text-xs font-semibold">
            {{ profileFeedback.message }}
          </div>

          <form @submit.prevent="handleUpdateProfile" class="space-y-md">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-md">
              <div class="space-y-1">
                <label class="block font-label-bold text-xs text-on-surface-variant">Full Name</label>
                <input v-model="profileForm.name" class="w-full bg-slate-50 border border-outline-variant rounded px-3 py-2.5 font-body-sm outline-none focus:border-primary" required type="text" />
              </div>
              <div class="space-y-1">
                <label class="block font-label-bold text-xs text-on-surface-variant">Email Address (Read-Only)</label>
                <input :value="store.currentUser?.email" disabled class="w-full bg-slate-100 border border-outline-variant rounded px-3 py-2.5 font-body-sm outline-none cursor-not-allowed opacity-70 text-on-surface-variant" type="email" />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-md">
              <div class="space-y-1">
                <label class="block font-label-bold text-xs text-on-surface-variant">Phone Number</label>
                <input v-model="profileForm.phone" class="w-full bg-slate-50 border border-outline-variant rounded px-3 py-2.5 font-body-sm outline-none focus:border-primary" placeholder="(555) 000-0000" type="text" />
              </div>
              <div class="space-y-1">
                <label class="block font-label-bold text-xs text-on-surface-variant">Date of Birth</label>
                <input v-model="profileForm.dob" type="date" class="w-full bg-slate-50 border border-outline-variant rounded px-3 py-2.5 font-body-sm outline-none focus:border-primary" />
              </div>
            </div>

            <!-- Coaching Sport display for coach in details -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-md mt-4" v-if="store.currentUser?.role === 'coach'">
              <div class="space-y-1">
                <label class="block font-label-bold text-xs text-on-surface-variant">Coaching Sport (Read-Only)</label>
                <input :value="store.currentUser?.coachingSport" disabled class="w-full bg-slate-100 border border-outline-variant rounded px-3 py-2.5 font-body-sm outline-none cursor-not-allowed opacity-70 text-on-surface-variant" type="text" />
              </div>
            </div>

            <!-- Sports Clubs Selection (only for member) -->
            <div v-if="store.currentUser?.role === 'member'" class="border-t border-outline-variant/30 pt-md mt-md space-y-md">
              <h3 class="font-label-bold text-xs text-primary uppercase tracking-wider">My Sports Clubs</h3>
              <div class="grid grid-cols-2 md:grid-cols-3 gap-sm text-xs">
                <label v-for="club in store.clubs" :key="club" class="flex items-center gap-2 p-sm border border-outline-variant rounded-lg bg-slate-50/50 hover:bg-slate-50 cursor-pointer">
                  <input type="checkbox" v-model="profileForm.clubs" :value="club" class="h-4 w-4 rounded border-outline-variant text-primary" />
                  <span>{{ club }} Club</span>
                </label>
              </div>
            </div>

            <div class="pt-sm">
              <button 
                type="submit" 
                class="bg-primary hover:bg-surface-tint text-on-primary font-label-bold text-xs px-6 py-2.5 rounded shadow-sm transition-colors mt-4"
              >
                Save Profile Changes
              </button>
            </div>
          </form>
        </div>

        <!-- Security Settings (Span 5) -->
        <div class="lg:col-span-5 bg-white border border-outline-variant rounded-xl p-md shadow-sm flex flex-col justify-between">
          <div>
            <div class="border-b border-outline-variant pb-sm mb-md">
              <h2 class="font-headline-sm text-sm font-bold text-primary flex items-center gap-xs">
                <span class="material-symbols-outlined text-secondary">security</span>
                Security Settings
              </h2>
            </div>
            <p class="text-xs text-on-surface-variant mb-md leading-relaxed">
              Keep your credentials and account safe. Update your security password periodically.
            </p>
            <div class="space-y-sm">
              <div class="flex items-center justify-between p-sm rounded-lg bg-slate-50 border border-outline-variant/30 text-xs">
                <div class="flex items-center gap-2">
                  <span class="material-symbols-outlined text-outline">lock</span>
                  <div>
                    <p class="font-semibold text-primary">Account Password</p>
                    <p class="text-[10px] text-on-surface-variant mt-0.5">Last updated: 3 months ago</p>
                  </div>
                </div>
                <a 
                  href="#" 
                  @click.prevent="showPasswordModal = true" 
                  class="font-semibold text-secondary hover:underline cursor-pointer"
                >
                  Change password
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Change Password Dialog Modal -->
    <div v-if="showPasswordModal" class="fixed inset-0 bg-primary/40 backdrop-blur-sm z-50 flex items-center justify-center p-md">
      <div class="bg-white border border-outline-variant rounded-xl w-full max-w-md shadow-lg p-md space-y-md" @click.stop>
        <div class="flex justify-between items-center border-b border-outline-variant pb-sm">
          <h3 class="font-headline-sm text-sm font-bold text-primary flex items-center gap-1">
            <span class="material-symbols-outlined text-secondary">security</span>
            Change Password
          </h3>
          <button type="button" @click="closePasswordModal" class="p-1 hover:bg-slate-100 rounded-full cursor-pointer">
            <span class="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <div v-if="pwFeedback" :class="[pwFeedback.success ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800']" class="p-sm border rounded text-xs font-semibold">
          {{ pwFeedback.message }}
        </div>

        <form @submit.prevent="handleChangePassword" class="space-y-md">
          <div class="space-y-1 text-xs">
            <label class="block font-semibold text-on-surface-variant">Current Password</label>
            <input v-model="pwForm.oldPassword" class="w-full bg-slate-50 border border-outline-variant rounded px-3 py-2 outline-none focus:border-primary" required type="password" />
          </div>
          
          <div class="space-y-1 text-xs">
            <label class="block font-semibold text-on-surface-variant">New Password</label>
            <input v-model="pwForm.newPassword" class="w-full bg-slate-50 border border-outline-variant rounded px-3 py-2 outline-none focus:border-primary" required type="password" />
          </div>

          <div class="space-y-1 text-xs">
            <label class="block font-semibold text-on-surface-variant">Confirm New Password</label>
            <input v-model="pwForm.confirmPassword" class="w-full bg-slate-50 border border-outline-variant rounded px-3 py-2 outline-none focus:border-primary" required type="password" />
          </div>

          <button 
            type="submit" 
            class="w-full py-2.5 bg-secondary text-on-secondary font-label-bold text-xs rounded hover:bg-secondary-container transition-colors shadow-sm cursor-pointer"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  </PortalLayout>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import PortalLayout from '../layouts/PortalLayout.vue'
import { useClubStore } from '../stores/clubStore'

const store = useClubStore()

const profileFeedback = ref(null)
const pwFeedback = ref(null)
const showPasswordModal = ref(false)

const profileForm = reactive({
  name: '',
  phone: '',
  dob: '',
  clubs: [],
  coachingSport: ''
})

const pwForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

onMounted(() => {
  store.restoreSession()
  if (store.currentUser) {
    profileForm.name = store.currentUser.name || ''
    profileForm.phone = store.currentUser.phone || ''
    profileForm.dob = store.currentUser.dob || ''
    profileForm.clubs = store.currentUser.clubs || []
    profileForm.coachingSport = store.currentUser.coachingSport || ''
  }
})

const closePasswordModal = () => {
  showPasswordModal.value = false
  pwForm.oldPassword = ''
  pwForm.newPassword = ''
  pwForm.confirmPassword = ''
  pwFeedback.value = null
}

const handleUpdateProfile = () => {
  profileFeedback.value = null
  if (!store.currentUser) return

  const res = store.updateUserProfile(
    store.currentUser.email,
    profileForm.name,
    profileForm.phone,
    profileForm.dob,
    profileForm.clubs,
    profileForm.coachingSport
  )

  if (res.success) {
    profileFeedback.value = { success: true, message: 'Profile details updated successfully!' }
    setTimeout(() => { profileFeedback.value = null }, 4000)
  } else {
    profileFeedback.value = { success: false, message: res.message || 'Failed to update profile.' }
  }
}

const handleChangePassword = () => {
  pwFeedback.value = null
  if (!store.currentUser) return

  if (pwForm.newPassword !== pwForm.confirmPassword) {
    pwFeedback.value = { success: false, message: 'New passwords do not match.' }
    return
  }

  if (pwForm.newPassword.length < 6) {
    pwFeedback.value = { success: false, message: 'Password must be at least 6 characters.' }
    return
  }

  const res = store.changeUserPassword(
    store.currentUser.email,
    pwForm.oldPassword,
    pwForm.newPassword
  )

  if (res.success) {
    pwFeedback.value = { success: true, message: 'Password updated successfully!' }
    pwForm.oldPassword = ''
    pwForm.newPassword = ''
    pwForm.confirmPassword = ''
    setTimeout(() => { 
      pwFeedback.value = null 
      showPasswordModal.value = false
    }, 2000)
  } else {
    pwFeedback.value = { success: false, message: res.message || 'Failed to update password.' }
  }
}
</script>
