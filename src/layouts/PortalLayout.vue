<template>
  <div class="min-h-screen bg-[#F8FAFC] flex text-on-surface font-body-md antialiased">
    <!-- Desktop Side Navigation -->
    <aside class="hidden md:flex flex-col h-full w-64 fixed left-0 top-0 bg-[#131b2e] py-lg border-r border-white/5 z-40 transition-all duration-300">
      <div class="px-md mb-xl flex flex-col items-center">
        <!-- Logo -->
        <div class="flex items-center gap-xs mb-md self-start">
          <span class="material-symbols-outlined text-secondary-container text-3xl font-variation-settings-['FILL'_1]">sports_soccer</span>
          <span class="font-headline-md text-headline-md font-bold text-white tracking-tight">NexSport</span>
        </div>
        
        <!-- Profile info block -->
        <router-link 
          :to="'/' + (store.currentUser?.role || 'member') + '/profile'"
          class="flex items-center gap-sm mt-md p-sm rounded-lg bg-white/5 w-full border border-white/10 hover:bg-white/10 transition-colors group cursor-pointer"
        >
          <div class="w-10 h-10 rounded-full bg-white/10 overflow-hidden flex-shrink-0 flex items-center justify-center border-2 border-white/20 group-hover:border-secondary-container transition-colors">
            <span class="material-symbols-outlined text-white/80 text-xl">person</span>
          </div>
          <div class="overflow-hidden">
            <p class="font-label-bold text-label-bold text-white truncate group-hover:text-secondary-container transition-colors">{{ store.currentUser?.name || 'User Profile' }}</p>
            <p class="font-body-sm text-body-sm text-white/60 truncate capitalize">{{ store.currentUser?.role }} Portal</p>
          </div>
        </router-link>
      </div>

      <!-- Navigation Links -->
      <nav class="flex-1 overflow-y-auto px-sm space-y-xs">
        <router-link 
          v-for="link in currentLinks" 
          :key="link.to"
          :to="link.to" 
          class="flex items-center gap-md py-sm rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-all pl-4 group scale-98 hover:scale-100 duration-200"
          active-class="border-l-4 border-secondary-container bg-white/10 pl-3 font-bold text-white"
        >
          <span class="material-symbols-outlined group-hover:text-white transition-colors">{{ link.icon }}</span>
          <span class="font-label-bold text-label-bold">{{ link.name }}</span>
        </router-link>
      </nav>

      <!-- Sidebar Footer Action -->
      <div class="px-md mt-auto space-y-sm">
        <router-link 
          v-if="store.currentUser?.role === 'member'" 
          to="/member/booking" 
          class="w-full bg-[#fd761a] hover:bg-secondary text-white font-label-bold text-label-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
        >
          <span class="material-symbols-outlined text-[18px]">add</span>
          Book a Court
        </router-link>
        
        <button 
          @click="handleLogout" 
          class="w-full border border-white/20 hover:bg-error/20 hover:border-error hover:text-white text-white/80 font-label-bold text-label-bold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <span class="material-symbols-outlined text-[18px]">logout</span>
          Logout
        </button>
      </div>
    </aside>
    <!-- Mobile Top Navigation Header -->
    <header class="md:hidden flex justify-between items-center w-full px-margin-mobile h-16 bg-white border-b border-outline-variant fixed top-0 z-40 shadow-sm">
      <div class="flex items-center gap-xs">
        <span class="material-symbols-outlined text-secondary-container text-2xl font-variation-settings-['FILL'_1]">sports_soccer</span>
        <h1 class="font-display-lg-mobile text-headline-sm font-bold text-primary">NexSport</h1>
      </div>
      <div class="flex items-center gap-sm">
        <!-- Notification bell -->
        <button @click="showNotifDrawer = !showNotifDrawer" class="relative p-2 text-on-surface-variant hover:bg-surface-variant rounded-full transition-colors">
          <span class="material-symbols-outlined text-2xl">notifications</span>
          <span v-if="unreadCount > 0" class="absolute top-1 right-1 w-2.5 h-2.5 bg-error rounded-full border border-white"></span>
        </button>
        <!-- Burger menu -->
        <button @click="showMobileMenu = !showMobileMenu" class="text-on-surface hover:bg-surface-variant p-2 rounded-full">
          <span class="material-symbols-outlined text-2xl">menu</span>
        </button>
      </div>
    </header>

    <!-- Mobile Navigation Drawer -->
    <div 
      v-if="showMobileMenu" 
      class="md:hidden fixed inset-0 bg-primary/40 z-50 transition-opacity duration-300"
      @click="showMobileMenu = false"
    >
      <div 
        class="absolute right-0 top-0 bottom-0 w-64 bg-white py-lg border-l border-outline-variant z-50 flex flex-col h-full shadow-lg"
        @click.stop
      >
        <div class="px-md mb-md flex justify-between items-center">
          <h2 class="font-headline-sm text-headline-sm font-bold text-primary">Portal Navigation</h2>
          <button @click="showMobileMenu = false" class="p-1 hover:bg-surface-variant rounded-full">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
        <router-link 
          :to="'/' + (store.currentUser?.role || 'member') + '/profile'"
          class="px-md py-sm bg-surface-container mb-md border-y border-outline-variant/30 flex items-center gap-2 hover:bg-surface-variant transition-colors cursor-pointer w-full"
          @click="showMobileMenu = false"
        >
          <div class="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center font-bold text-primary text-xs">
            {{ store.currentUser?.name ? store.currentUser.name[0] : 'U' }}
          </div>
          <div class="overflow-hidden">
            <p class="font-label-bold text-xs truncate">{{ store.currentUser?.name }}</p>
            <p class="text-[10px] text-on-surface-variant truncate capitalize">{{ store.currentUser?.role }}</p>
          </div>
        </router-link>
        <nav class="flex-1 px-sm space-y-xs">
          <router-link 
            v-for="link in currentLinks" 
            :key="link.to"
            :to="link.to" 
            class="flex items-center gap-md py-3 rounded-lg text-on-surface-variant pl-4 hover:bg-surface-variant"
            active-class="bg-surface-container font-bold text-secondary border-l-4 border-secondary"
            @click="showMobileMenu = false"
          >
            <span class="material-symbols-outlined">{{ link.icon }}</span>
            <span class="font-label-bold text-label-bold">{{ link.name }}</span>
          </router-link>
        </nav>
        <div class="px-md mt-auto pt-sm">
          <button 
            @click="handleLogout" 
            class="w-full bg-error text-on-error font-label-bold text-label-bold py-3 rounded-lg flex items-center justify-center gap-2"
          >
            <span class="material-symbols-outlined">logout</span>
            Logout
          </button>
        </div>
      </div>
    </div>

    <!-- Main Portal Wrapper -->
    <main class="flex-1 md:ml-64 mt-16 md:mt-0 p-margin-mobile md:p-margin-desktop bg-[#F8FAFC] flex flex-col min-h-screen">
      <!-- Desktop Header (Search, Notifications & Role quick-swapping) -->
      <header class="hidden md:flex justify-between items-center w-full px-margin-desktop max-w-7xl mx-auto h-20 sticky top-0 z-30 bg-[#F8FAFC]/90 backdrop-blur-md border-b border-outline-variant/30 shrink-0">
        <div class="flex items-center flex-1 max-w-xl mr-md">
          <div class="relative w-full">
            <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
            <input 
              v-model="searchQuery"
              @input="handleSearch"
              class="w-full pl-10 pr-4 py-2 bg-white border border-outline-variant rounded-full focus:outline-none focus:border-primary focus:ring-2 focus:ring-tertiary-fixed-dim/20 transition-all font-body-sm text-body-sm shadow-sm" 
              placeholder="Search bookings, payments, rules or announcements..." 
              type="text"
            />
          </div>
        </div>

        <div class="flex items-center gap-md">
          <!-- Notification Bell Dropdown Button -->
          <div class="relative">
            <button 
              @click="showNotifDrawer = !showNotifDrawer"
              class="relative p-2 text-on-surface-variant hover:bg-surface-variant rounded-full transition-colors focus:outline-none"
            >
              <span class="material-symbols-outlined">notifications</span>
              <span v-if="unreadCount > 0" class="absolute top-1 right-1 w-2.5 h-2.5 bg-error rounded-full border border-white"></span>
            </button>
            
            <!-- Notification Panel Dropdown -->
            <div 
              v-if="showNotifDrawer" 
              class="absolute right-0 mt-2 w-80 bg-white border border-outline-variant rounded-xl shadow-lg z-50 py-sm"
            >
              <div class="px-md py-xs border-b border-outline-variant/30 flex justify-between items-center bg-surface-container-low rounded-t-xl">
                <span class="font-headline-sm text-sm font-bold text-primary">Announcements</span>
                <span class="bg-secondary-container text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{{ unreadCount }} New</span>
              </div>
              <div class="max-h-64 overflow-y-auto">
                <div 
                  v-for="notif in store.notifications" 
                  :key="notif.id" 
                  class="p-sm border-b border-outline-variant/20 last:border-b-0 hover:bg-surface-bright transition-colors relative"
                >
                  <div class="flex gap-2 items-start">
                    <span class="material-symbols-outlined text-[18px] mt-0.5 text-secondary">campaign</span>
                    <div>
                      <h4 class="font-label-bold text-xs font-semibold text-primary">{{ notif.title }}</h4>
                      <p class="font-body-sm text-[11px] text-on-surface-variant mt-1 leading-normal">{{ notif.text }}</p>
                      <span class="text-[9px] text-outline mt-1 block">{{ notif.time }}</span>
                    </div>
                  </div>
                </div>
                <div v-if="store.notifications.length === 0" class="py-md text-center text-xs text-on-surface-variant">
                  No announcements at this time.
                </div>
              </div>
              <div class="px-md pt-xs border-t border-outline-variant/30 text-center">
                <router-link to="/dev-api" class="text-xs text-secondary hover:underline" @click="showNotifDrawer = false">Developer API Swagger Specs</router-link>
              </div>
            </div>
          </div>

          <!-- Dev API link icon -->
          <router-link to="/dev-api" class="p-2 text-on-surface-variant hover:bg-surface-variant rounded-full transition-colors" title="Developer API Swagger Mock">
            <span class="material-symbols-outlined">api</span>
          </router-link>
          
          <div class="flex gap-sm">
            <span class="px-sm py-1 rounded bg-secondary-container/10 border border-secondary-container/20 text-secondary font-label-bold text-label-bold text-xs self-center">
              Active Mode: {{ store.currentUser?.role }}
            </span>
          </div>
        </div>
      </header>


      <!-- Main Canvas Slots -->
      <div class="flex-1 max-w-7xl mx-auto w-full py-md">
        <slot />
      </div>
    </main>

    <!-- Mobile Bottom Navigation (Visible only on small screens) -->
    <nav class="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-outline-variant flex justify-around py-xs pb-4 z-40 shadow-lg">
      <router-link 
        v-for="link in mobileLinks" 
        :key="link.to"
        :to="link.to" 
        class="flex flex-col items-center p-xs text-on-surface-variant"
        active-class="text-secondary"
      >
        <span class="material-symbols-outlined">{{ link.icon }}</span>
        <span class="text-[10px] font-label-bold mt-1">{{ link.shortName }}</span>
      </router-link>
    </nav>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useClubStore } from '../stores/clubStore'

const router = useRouter()
const route = useRoute()
const store = useClubStore()

const showMobileMenu = ref(false)
const showNotifDrawer = ref(false)
const searchQuery = ref('')

const unreadCount = computed(() => store.notifications.length)

// Watch route changes to close dropdowns
watch(() => route.path, () => {
  showMobileMenu.value = false
  showNotifDrawer.value = false
})

// Sidebar links per user role
const linksMap = {
  member: [
    { name: 'Dashboard', shortName: 'Dash', icon: 'dashboard', to: '/member/dashboard' },
    { name: 'Facility Booking', shortName: 'Book', icon: 'calendar_today', to: '/member/booking' },
    { name: 'My Schedule', shortName: 'Schedule', icon: 'event_note', to: '/member/schedule' },
    { name: 'Events', shortName: 'Events', icon: 'sports_soccer', to: '/member/events' },
    { name: 'My Attendance', shortName: 'Attendance', icon: 'rule', to: '/member/attendance' },
    { name: 'Payments', shortName: 'Payments', icon: 'payments', to: '/member/payments' },
    { name: 'Onboarding', shortName: 'Setup', icon: 'speed', to: '/member/onboarding' },
    { name: 'Support Center', shortName: 'Support', icon: 'help_outline', to: '/member/support' }
  ],
  coach: [
    { name: 'Coach Dashboard', shortName: 'Dash', icon: 'dashboard', to: '/coach/dashboard' },
    { name: 'My Schedule', shortName: 'Schedule', icon: 'event_note', to: '/coach/schedule' },
    { name: 'Attendance Analytics', shortName: 'Analytics', icon: 'analytics', to: '/coach/attendance' },
    { name: 'Support', shortName: 'Support', icon: 'help_outline', to: '/coach/support' }
  ],
  admin: [
    { name: 'Secretary Portal', shortName: 'Portal', icon: 'dashboard', to: '/admin/dashboard' },
    { name: 'Facilities Grid', shortName: 'Facilities', icon: 'build', to: '/admin/facilities' },
    { name: 'Support Queue', shortName: 'Support', icon: 'support_agent', to: '/admin/support' }
  ],
  faculty: [
    { name: 'Faculty Dashboard', shortName: 'Advisor', icon: 'dashboard', to: '/faculty/dashboard' }
  ],
  parent: [
    { name: 'Parent Dashboard', shortName: 'Dash', icon: 'dashboard', to: '/parent/dashboard' },
    { name: 'Support', shortName: 'Support', icon: 'help_outline', to: '/parent/support' }
  ]
}

const currentLinks = computed(() => {
  const role = store.currentUser?.role || 'member'
  const links = linksMap[role] || []
  if (role === 'member' && store.currentUser?.onboardingStatus === 'completed') {
    return links.filter(l => l.to !== '/member/onboarding')
  }
  return links
})

// Select 3 links for bottom mobile navigation
const mobileLinks = computed(() => {
  const list = currentLinks.value
  if (list.length <= 3) return list
  return [list[0], list[1], list[list.length - 1]] // Dash, second item, and Support
})

const handleLogout = () => {
  store.logout()
  router.push('/login')
}

const handleSearch = () => {
  // Emit event or search globally (simple reactive filter can be used in views)
}
</script>
