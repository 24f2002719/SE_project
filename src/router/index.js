import { createRouter, createWebHistory } from 'vue-router'
import { useClubStore } from '../stores/clubStore'

import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import ApiSwagger from '../views/dev/ApiSwagger.vue'

// Member Views
import MemberDashboard from '../views/member/MemberDashboard.vue'
import FacilityBooking from '../views/member/FacilityBooking.vue'
import MySchedule from '../views/member/MySchedule.vue'
import MemberEvents from '../views/member/Events.vue'
import MemberPayments from '../views/member/Payments.vue'
import OnboardingWizard from '../views/member/OnboardingWizard.vue'
import MemberSupport from '../views/member/Support.vue'

// Coach Views
import CoachDashboard from '../views/coach/CoachDashboard.vue'
import CoachSchedule from '../views/coach/CoachSchedule.vue'
import AttendanceAnalytics from '../views/coach/AttendanceAnalytics.vue'

// Admin Views
import AdminDashboard from '../views/admin/AdminDashboard.vue'
import FacilityManagement from '../views/admin/FacilityManagement.vue'
import SupportTickets from '../views/admin/SupportTickets.vue'

// Faculty Views
import FacultyDashboard from '../views/faculty/FacultyDashboard.vue'

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/login', name: 'login', component: LoginView },
  { path: '/dev-api', name: 'swagger', component: ApiSwagger },
  
  // Member Routes
  { path: '/member/dashboard', name: 'member-dashboard', component: MemberDashboard, meta: { role: 'member' } },
  { path: '/member/booking', name: 'member-booking', component: FacilityBooking, meta: { role: 'member' } },
  { path: '/member/schedule', name: 'member-schedule', component: MySchedule, meta: { role: 'member' } },
  { path: '/member/events', name: 'member-events', component: MemberEvents, meta: { role: 'member' } },
  { path: '/member/payments', name: 'member-payments', component: MemberPayments, meta: { role: 'member' } },
  { path: '/member/onboarding', name: 'member-onboarding', component: OnboardingWizard, meta: { role: 'member' } },
  { path: '/member/support', name: 'member-support', component: MemberSupport, meta: { role: 'member' } },

  // Coach Routes
  { path: '/coach/dashboard', name: 'coach-dashboard', component: CoachDashboard, meta: { role: 'coach' } },
  { path: '/coach/schedule', name: 'coach-schedule', component: CoachSchedule, meta: { role: 'coach' } },
  { path: '/coach/attendance', name: 'coach-attendance', component: AttendanceAnalytics, meta: { role: 'coach' } },
  { path: '/coach/support', name: 'coach-support', component: MemberSupport, meta: { role: 'coach' } }, // Reusing support view

  // Admin Routes
  { path: '/admin/dashboard', name: 'admin-dashboard', component: AdminDashboard, meta: { role: 'admin' } },
  { path: '/admin/facilities', name: 'admin-facilities', component: FacilityManagement, meta: { role: 'admin' } },
  { path: '/admin/support', name: 'admin-support', component: SupportTickets, meta: { role: 'admin' } },

  // Faculty Routes
  { path: '/faculty/dashboard', name: 'faculty-dashboard', component: FacultyDashboard, meta: { role: 'faculty' } }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

// Route Navigation Guard
router.beforeEach((to, from, next) => {
  const store = useClubStore()
  store.restoreSession()

  const hasToken = sessionStorage.getItem('token')
  const requiresAuth = to.meta.role !== undefined

  if (requiresAuth) {
    if (!hasToken || !store.currentUser) {
      return next('/login')
    }
    
    // Validate role
    if (store.currentUser.role !== to.meta.role) {
      // Redirect to correct dashboard
      const dashboardMap = {
        member: '/member/dashboard',
        coach: '/coach/dashboard',
        admin: '/admin/dashboard',
        faculty: '/faculty/dashboard'
      }
      return next(dashboardMap[store.currentUser.role] || '/')
    }
  }

  // Redirect if logged in
  if (to.name === 'login' && hasToken && store.currentUser) {
    const dashboardMap = {
      member: '/member/dashboard',
      coach: '/coach/dashboard',
      admin: '/admin/dashboard',
      faculty: '/faculty/dashboard'
    }
    return next(dashboardMap[store.currentUser.role])
  }

  next()
})

export default router
