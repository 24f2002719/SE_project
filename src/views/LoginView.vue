<template>
  <div class="bg-background min-h-screen flex text-on-surface font-body-md">
    <div class="flex w-full min-h-screen">
      <!-- Left Side: Dynamic Branding (Hidden on Mobile) -->
      <div class="hidden lg:flex lg:w-1/2 relative bg-primary-container overflow-hidden flex-col justify-between p-xl">
        <div class="absolute inset-0 bg-cover bg-center opacity-50 mix-blend-luminosity" style="background-image: url('https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&q=80&w=800')"></div>
        <div class="absolute inset-0 bg-gradient-to-t from-primary-container via-primary-container/40 to-transparent"></div>
        
        <div class="relative z-10">
          <router-link to="/" class="flex items-center gap-xs font-display-lg text-headline-md font-bold text-on-primary">
            <span class="material-symbols-outlined text-secondary-container text-3xl font-variation-settings-['FILL'_1]">sports_soccer</span>
            <span>NexSport</span>
          </router-link>
        </div>

        <div class="relative z-10 text-on-primary mb-xl">
          <h2 class="font-display-lg text-display-lg mb-sm">Elevate Your Game</h2>
          <p class="font-body-lg text-body-lg max-w-md opacity-90">Join NexSport to book facilities, manage rosters, check attendance, and track competitive progress all in one place.</p>
        </div>

        <div class="relative z-10 flex gap-xs">
          <div class="h-1 w-12 bg-secondary-container rounded-full"></div>
          <div class="h-1 w-4 bg-tertiary-fixed-dim rounded-full opacity-40"></div>
          <div class="h-1 w-4 bg-tertiary-fixed-dim rounded-full opacity-40"></div>
        </div>
      </div>

      <!-- Right Side: Forms -->
      <div class="w-full lg:w-1/2 flex items-center justify-center p-margin-mobile lg:p-margin-desktop bg-[#F8FAFC]">
        <div class="w-full max-w-md bg-white border border-outline-variant rounded-lg p-lg shadow-sm hover:shadow-md transition-shadow duration-300">
          <!-- Logo for mobile -->
          <div class="lg:hidden mb-lg text-center">
            <span class="font-display-lg-mobile text-display-lg-mobile font-bold text-primary">NexSport</span>
          </div>

          <!-- Page Headers -->
          <div class="mb-lg text-center lg:text-left">
            <h1 class="font-headline-md text-headline-md text-primary mb-xs">
              {{ isSignUp ? 'Create Account' : 'Welcome Back' }}
            </h1>
            <p class="font-body-sm text-body-sm text-on-surface-variant">
              {{ isSignUp ? 'Sign up to register as an athlete or coach.' : 'Sign in to manage your bookings and schedule.' }}
            </p>
          </div>

          <!-- Feedback alerts -->
          <div v-if="feedback" :class="[feedback.success ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800']" class="p-sm border rounded-lg mb-md flex gap-2 items-start text-xs font-semibold">
            <span class="material-symbols-outlined text-sm mt-0.5">{{ feedback.success ? 'check_circle' : 'error' }}</span>
            <span>{{ feedback.message }}</span>
          </div>

          <!-- Sign In Form -->
          <form v-if="!isSignUp" @submit.prevent="handleLogin" class="space-y-gutter">
            <div>
              <label class="block font-label-bold text-label-bold text-on-surface-variant mb-xs" for="email">Email Address</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span class="material-symbols-outlined text-outline">mail</span>
                </div>
                <input 
                  v-model="loginEmail" 
                  class="block w-full pl-10 pr-3 py-3 border border-outline-variant rounded bg-white text-on-surface font-body-md input-focus-ring placeholder-outline transition-all" 
                  id="email" 
                  placeholder="name@iiserb.ac.in" 
                  required 
                  type="email"
                />
              </div>
            </div>

            <div>
              <div class="flex justify-between items-center mb-xs">
                <label class="block font-label-bold text-label-bold text-on-surface-variant" for="password">Password</label>
                <a class="font-label-bold text-label-bold text-secondary hover:text-secondary-container transition-colors" href="#">Forgot Password?</a>
              </div>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span class="material-symbols-outlined text-outline">lock</span>
                </div>
                <input 
                  v-model="loginPassword" 
                  class="block w-full pl-10 pr-10 py-3 border border-outline-variant rounded bg-white text-on-surface font-body-md input-focus-ring placeholder-outline transition-all" 
                  id="password" 
                  placeholder="••••••••" 
                  required 
                  :type="showPassword ? 'text' : 'password'"
                />
                <div @click="showPassword = !showPassword" class="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer">
                  <span class="material-symbols-outlined text-outline hover:text-primary transition-colors">
                    {{ showPassword ? 'visibility' : 'visibility_off' }}
                  </span>
                </div>
              </div>
            </div>

            <div class="flex items-center">
              <input class="h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary-container bg-white" id="remember-me" type="checkbox"/>
              <label class="ml-2 block font-body-sm text-body-sm text-on-surface-variant" for="remember-me">
                Remember me for 30 days
              </label>
            </div>

            <div class="pt-sm space-y-md">
              <button class="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded bg-primary text-on-primary font-label-bold text-label-bold hover:bg-surface-tint transition-colors shadow-sm" type="submit">
                Sign In
                <span class="material-symbols-outlined ml-2 text-[18px]">arrow_forward</span>
              </button>

              <div class="relative">
                <div class="absolute inset-0 flex items-center">
                  <div class="w-full border-t border-outline-variant"></div>
                </div>
                <div class="relative flex justify-center text-sm">
                  <span class="px-2 bg-white text-on-surface-variant font-body-sm text-body-sm">Or</span>
                </div>
              </div>

              <button @click="isSignUp = true" class="w-full flex justify-center items-center py-3 px-4 border border-outline-variant rounded bg-white text-primary font-label-bold text-label-bold hover:bg-surface-variant transition-colors" type="button">
                Register as a New Member
              </button>
            </div>
          </form>

          <!-- Sign Up Form -->
          <form v-else @submit.prevent="handleRegister" class="space-y-gutter">
            <div>
              <label class="block font-label-bold text-label-bold text-on-surface-variant mb-xs" for="reg-name">Full Name</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span class="material-symbols-outlined text-outline">person</span>
                </div>
                <input 
                  v-model="regName" 
                  class="block w-full pl-10 pr-3 py-3 border border-outline-variant rounded bg-white text-on-surface font-body-md input-focus-ring placeholder-outline transition-all" 
                  id="reg-name" 
                  placeholder="Alex Mercer" 
                  required 
                  type="text"
                />
              </div>
            </div>

            <div>
              <label class="block font-label-bold text-label-bold text-on-surface-variant mb-xs" for="reg-email">Institute Email</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span class="material-symbols-outlined text-outline">mail</span>
                </div>
                <input 
                  v-model="regEmail" 
                  class="block w-full pl-10 pr-3 py-3 border border-outline-variant rounded bg-white text-on-surface font-body-md input-focus-ring placeholder-outline transition-all" 
                  id="reg-email" 
                  placeholder="username@iiserb.ac.in" 
                  required 
                  type="email"
                />
              </div>
              <p class="text-[10px] text-on-surface-variant mt-1">Must be a valid IISER Bhopal email domain (@iiserb.ac.in)</p>
            </div>

            <div>
              <label class="block font-label-bold text-label-bold text-on-surface-variant mb-xs" for="reg-password">Password</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span class="material-symbols-outlined text-outline">lock</span>
                </div>
                <input 
                  v-model="regPassword" 
                  class="block w-full pl-10 pr-3 py-3 border border-outline-variant rounded bg-white text-on-surface font-body-md input-focus-ring placeholder-outline transition-all" 
                  id="reg-password" 
                  placeholder="••••••••" 
                  required 
                  type="password"
                />
              </div>
            </div>

            <div>
              <label class="block font-label-bold text-label-bold text-on-surface-variant mb-xs" for="reg-role">Roster Role</label>
              <select 
                v-model="regRole"
                class="block w-full px-3 py-3 border border-outline-variant rounded bg-white text-on-surface font-body-md input-focus-ring transition-all outline-none"
                id="reg-role"
              >
                <option value="member">Club Member / Player</option>
                <option value="coach">Volunteer Coach</option>
              </select>
            </div>

            <div class="pt-sm space-y-md">
              <button class="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded bg-primary text-on-primary font-label-bold text-label-bold hover:bg-surface-tint transition-colors shadow-sm" type="submit">
                Create Account
                <span class="material-symbols-outlined ml-2 text-[18px]">how_to_reg</span>
              </button>

              <div class="relative">
                <div class="absolute inset-0 flex items-center">
                  <div class="w-full border-t border-outline-variant"></div>
                </div>
                <div class="relative flex justify-center text-sm">
                  <span class="px-2 bg-white text-on-surface-variant font-body-sm text-body-sm">Or</span>
                </div>
              </div>

              <button @click="isSignUp = false" class="w-full flex justify-center items-center py-3 px-4 border border-outline-variant rounded bg-white text-primary font-label-bold text-label-bold hover:bg-surface-variant transition-colors" type="button">
                Back to Sign In
              </button>
            </div>
          </form>

          <!-- Evaluation Role Switcher (Divider + Quick Access) -->
          <div class="mt-lg pt-md border-t border-outline-variant/60">
            <h3 class="text-center font-label-bold text-label-bold text-secondary uppercase tracking-wider mb-sm">Quick Evaluation Login</h3>
            <div class="grid grid-cols-2 gap-xs">
              <button @click="quickLogin('alex@iiserb.ac.in')" class="py-2 border border-outline-variant rounded text-xs font-semibold hover:bg-surface-container transition-colors flex flex-col items-center">
                <span>Member Portal</span>
                <span class="text-[10px] text-on-surface-variant">Alex Mercer</span>
              </button>
              <button @click="quickLogin('deepanshi@iiserb.ac.in')" class="py-2 border border-outline-variant rounded text-xs font-semibold hover:bg-surface-container transition-colors flex flex-col items-center">
                <span>Coach Portal</span>
                <span class="text-[10px] text-on-surface-variant">Deepanshi A.</span>
              </button>
              <button @click="quickLogin('krishna@iiserb.ac.in')" class="py-2 border border-outline-variant rounded text-xs font-semibold hover:bg-surface-container transition-colors flex flex-col items-center">
                <span>Secretary Portal</span>
                <span class="text-[10px] text-on-surface-variant">Krishna A.</span>
              </button>
              <button @click="quickLogin('verma@iiserb.ac.in')" class="py-2 border border-outline-variant rounded text-xs font-semibold hover:bg-surface-container transition-colors flex flex-col items-center">
                <span>Faculty Advisor</span>
                <span class="text-[10px] text-on-surface-variant">Dr. Verma</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useClubStore } from '../stores/clubStore'

const router = useRouter()
const route = useRoute()
const store = useClubStore()

const isSignUp = ref(false)
const showPassword = ref(false)
const feedback = ref(null)

// Login fields
const loginEmail = ref('')
const loginPassword = ref('')

// Signup fields
const regName = ref('')
const regEmail = ref('')
const regPassword = ref('')
const regRole = ref('member')

onMounted(() => {
  if (route.query.signup) {
    isSignUp.value = true
  }
})

const handleLogin = () => {
  feedback.value = null
  const res = store.login(loginEmail.value, loginPassword.value)
  if (res.success) {
    navigateUser(res.user.role)
  } else {
    feedback.value = { success: false, message: res.message }
  }
}

const handleRegister = () => {
  feedback.value = null
  const res = store.register(regName.value, regEmail.value, regPassword.value, regRole.value)
  if (res.success) {
    feedback.value = { success: true, message: 'Account registered! Please log in.' }
    isSignUp.value = false
    loginEmail.value = regEmail.value
    loginPassword.value = regPassword.value
  } else {
    feedback.value = { success: false, message: res.message }
  }
}

const quickLogin = (email) => {
  feedback.value = null
  const res = store.login(email, 'password123')
  if (res.success) {
    navigateUser(res.user.role)
  } else {
    feedback.value = { success: false, message: 'Quick login failed.' }
  }
}

const navigateUser = (role) => {
  const dashboards = {
    member: '/member/onboarding', // Send to onboarding checklist first
    coach: '/coach/dashboard',
    admin: '/admin/dashboard',
    faculty: '/faculty/dashboard'
  }
  
  // If Member onboarding is already completed, skip to dashboard
  if (role === 'member' && store.currentUser?.onboardingStatus === 'completed') {
    return router.push('/member/dashboard')
  }

  router.push(dashboards[role] || '/')
}
</script>
