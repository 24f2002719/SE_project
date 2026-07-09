<template>
  <div class="bg-background text-on-surface min-h-screen flex flex-col md:flex-row antialiased">
    <!-- Left branding panel -->
    <div class="hidden md:flex md:w-5/12 lg:w-1/3 bg-primary-container relative overflow-hidden flex-col justify-between p-xl z-10 text-on-primary">
      <div class="absolute inset-0 z-0">
        <div class="w-full h-full bg-cover bg-center opacity-40 mix-blend-luminosity" style="background-image: url('https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=800')"></div>
        <div class="absolute inset-0 bg-gradient-to-b from-primary-container/90 via-primary-container/70 to-primary-container"></div>
      </div>
      <div class="relative z-10">
        <router-link to="/" class="flex items-center gap-sm mb-xl">
          <span class="material-symbols-outlined text-secondary-container" style="font-size: 32px; font-variation-settings: 'FILL' 1;">speed</span>
          <span class="font-headline-md text-on-primary">NexSport</span>
        </router-link>
        <h1 class="font-display-lg text-on-primary mb-md">Welcome to NexSport</h1>
        <p class="font-body-lg text-inverse-primary max-w-sm">
          Your journey to peak performance starts here. Complete your setup to access world-class facilities and specialized training.
        </p>
      </div>
      <div class="relative z-10 flex gap-gutter">
        <div class="h-1 w-12 bg-secondary-container rounded-full"></div>
        <div class="h-1 w-4 bg-tertiary-fixed-dim rounded-full opacity-50"></div>
        <div class="h-1 w-4 bg-tertiary-fixed-dim rounded-full opacity-50"></div>
      </div>
    </div>

    <!-- Right wizard panel -->
    <div class="w-full md:w-7/12 lg:w-2/3 flex flex-col justify-center min-h-screen p-margin-mobile md:p-margin-desktop lg:p-xl relative bg-background">
      <div class="max-w-2xl w-full mx-auto flex flex-col h-full">
        <!-- Mobile Logo -->
        <div class="md:hidden flex items-center gap-sm mb-lg">
          <span class="material-symbols-outlined text-secondary-container" style="font-size: 28px; font-variation-settings: 'FILL' 1;">speed</span>
          <h1 class="font-headline-md text-primary">NexSport Onboarding</h1>
        </div>

        <!-- Stepper Indicator -->
        <div class="mb-xl w-full">
          <div class="flex items-center justify-between relative">
            <div class="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-outline-variant/30 -z-10"></div>
            
            <div 
              v-for="s in 5" 
              :key="s" 
              class="flex flex-col items-center gap-xs relative z-10"
            >
              <div 
                :class="[
                  step === s ? 'bg-primary-container text-white scale-110 shadow-md ring-4 ring-white' : 
                  step > s ? 'bg-secondary text-white' : 'bg-white text-outline border-2 border-outline-variant'
                ]" 
                class="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 font-bold"
              >
                <span v-if="step > s" class="material-symbols-outlined text-sm">check</span>
                <span v-else>{{ s }}</span>
              </div>
              <span 
                :class="[step === s ? 'text-primary font-bold' : 'text-outline']" 
                class="font-label-bold absolute -bottom-6 text-[10px] whitespace-nowrap"
              >
                {{ stepNames[s-1] }}
              </span>
            </div>
          </div>
        </div>

        <!-- Stepper Canvas Cards -->
        <div class="flex-grow flex flex-col justify-center mt-4">
          <div class="bg-white border border-outline-variant rounded-xl p-margin-mobile md:p-lg shadow-sm">
            
            <!-- Step 1: Details -->
            <div v-if="step === 1" class="space-y-md">
              <div>
                <h2 class="font-headline-sm text-primary mb-xs">Personal Details</h2>
                <p class="font-body-sm text-on-surface-variant">Please provide your foundational information to establish your athlete profile.</p>
              </div>
              <div class="space-y-sm">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-md">
                  <div class="space-y-1">
                    <label class="font-label-bold text-on-surface-variant text-xs">First Name</label>
                    <input v-model="form.firstName" class="w-full bg-white border border-outline-variant rounded-md px-4 py-2.5 font-body-md input-glow transition-all" placeholder="Alex" />
                  </div>
                  <div class="space-y-1">
                    <label class="font-label-bold text-on-surface-variant text-xs">Last Name</label>
                    <input v-model="form.lastName" class="w-full bg-white border border-outline-variant rounded-md px-4 py-2.5 font-body-md input-glow transition-all" placeholder="Mercer" />
                  </div>
                </div>
                <div class="space-y-1">
                  <label class="font-label-bold text-on-surface-variant text-xs">Phone Number</label>
                  <input v-model="form.phone" class="w-full bg-white border border-outline-variant rounded-md px-4 py-2.5 font-body-md input-glow transition-all" placeholder="(555) 123-4567" />
                </div>
                <div class="space-y-1">
                  <label class="font-label-bold text-on-surface-variant text-xs">Date of Birth</label>
                  <input v-model="form.dob" type="date" class="w-full bg-white border border-outline-variant rounded-md px-4 py-2.5 font-body-md input-glow transition-all" />
                </div>
                <div class="space-y-1 pt-xs">
                  <label class="font-label-bold text-on-surface-variant text-xs">Clubs You Want to Join</label>
                  <div class="grid grid-cols-2 md:grid-cols-3 gap-sm text-xs mt-1">
                    <label v-for="club in ['Badminton', 'Volleyball', 'Tennis', 'Swimming', 'Athletics']" :key="club" class="flex items-center gap-2 p-2 border border-outline-variant rounded-lg bg-slate-50/50 hover:bg-slate-50 cursor-pointer">
                      <input type="checkbox" v-model="form.clubs" :value="club" class="h-4.5 w-4.5 rounded border-outline-variant text-primary" />
                      <span>{{ club }} Club</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <!-- Step 2: Choose Plan -->
            <div v-if="step === 2" class="space-y-md">
              <div>
                <h2 class="font-headline-sm text-primary mb-xs">Select Membership Tier</h2>
                <p class="font-body-sm text-on-surface-variant">Choose the plan that suits your competitive goals.</p>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-md pt-xs">
                <!-- Standard Tier -->
                <div 
                  @click="form.tier = 'Standard'" 
                  :class="[form.tier === 'Standard' ? 'border-primary ring-2 ring-primary bg-surface-container-low' : 'border-outline-variant hover:bg-slate-50']" 
                  class="border-2 rounded-xl p-md cursor-pointer transition-all flex flex-col justify-between"
                >
                  <div>
                    <h3 class="font-headline-sm text-primary">Standard Tier</h3>
                    <p class="text-xs text-on-surface-variant mt-1">General facility bookings and matches.</p>
                    <ul class="text-xs text-on-surface mt-sm space-y-1">
                      <li>• Gym access (6 AM - 10 PM)</li>
                      <li>• Booking Badminton &amp; Volleyball</li>
                      <li>• 2 Active reservations max</li>
                    </ul>
                  </div>
                  <div class="mt-md pt-sm border-t border-outline-variant/30 flex justify-between items-end">
                    <span class="text-xs text-on-surface-variant">Annual Dues</span>
                    <span class="font-headline-md text-primary">$600</span>
                  </div>
                </div>

                <!-- Pro Tier -->
                <div 
                  @click="form.tier = 'Pro'" 
                  :class="[form.tier === 'Pro' ? 'border-secondary ring-2 ring-secondary bg-secondary-fixed/10' : 'border-outline-variant hover:bg-slate-50']" 
                  class="border-2 rounded-xl p-md cursor-pointer transition-all flex flex-col justify-between"
                >
                  <div class="relative">
                    <span class="absolute top-0 right-0 px-2 py-0.5 bg-secondary text-white text-[9px] font-bold rounded-full">RECOMMENDED</span>
                    <h3 class="font-headline-sm text-secondary">Pro Tier</h3>
                    <p class="text-xs text-on-surface-variant mt-1">Elite athlete and competition preparation.</p>
                    <ul class="text-xs text-on-surface mt-sm space-y-1">
                      <li>• Unlimited court bookings</li>
                      <li>• Eligible for Inter-Institute selection</li>
                      <li>• Advanced coach consultation</li>
                      <li>• Locker room &amp; sauna privileges</li>
                    </ul>
                  </div>
                  <div class="mt-md pt-sm border-t border-outline-variant/30 flex justify-between items-end">
                    <span class="text-xs text-on-surface-variant">Annual Dues</span>
                    <span class="font-headline-md text-secondary">$1,200</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Step 3: Safety Checklist -->
            <div v-if="step === 3" class="space-y-md">
              <div>
                <h2 class="font-headline-sm text-primary mb-xs">Safety Regulations</h2>
                <p class="font-body-sm text-on-surface-variant">Please acknowledge the safety protocols before entering physical spaces.</p>
              </div>
              <div class="space-y-sm bg-slate-50 p-sm rounded-lg border border-outline-variant/30 max-h-56 overflow-y-auto text-xs leading-relaxed">
                <p class="font-semibold text-primary">Gym &amp; Facility Regulations:</p>
                <p>1. Always warm up thoroughly before commencing training to avoid muscular injuries.</p>
                <p>2. Report any damage in facility floorings or equipment immediately using the ticket reporting tool.</p>
                <p>3. Wipe down equipment after use to keep standard training regions hygienic.</p>
                <p>4. Do not exceed capacity rules inside the swimming pools or basketball layouts.</p>
                <p>5. Wear appropriate sport non-marking shoes on badminton wood floors to prevent slipping.</p>
              </div>
              <div class="flex items-start gap-sm pt-xs">
                <input v-model="form.safetySigned" type="checkbox" id="safety-check" class="mt-1 h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary-container" />
                <label for="safety-check" class="text-xs text-on-surface-variant leading-snug">
                  I have read, understood, and formally agree to the safety guidelines, workout recommendations, and court equipment rules.
                </label>
              </div>
            </div>

            <!-- Step 4: Waiver Signature -->
            <div v-if="step === 4" class="space-y-md">
              <div>
                <h2 class="font-headline-sm text-primary mb-xs">Disclaimer &amp; Waiver</h2>
                <p class="font-body-sm text-on-surface-variant">Sign the digital disclaimer and waiver form to complete your registry.</p>
              </div>
              <div class="bg-slate-50 p-sm rounded-lg border border-outline-variant/30 text-xs leading-relaxed max-h-40 overflow-y-auto">
                <p class="font-semibold text-primary">NexSport Liability Release Form:</p>
                <p class="mt-1">By signing below, I voluntarily assume all risks associated with training, competitions, tournament selection, and physical exercises performed on NexSport premises, acknowledging that the club does not bear liability for accidental personal damages.</p>
              </div>
              <div class="space-y-2">
                <label class="block font-label-bold text-xs text-on-surface-variant">Write Your Full Name to Sign Digitally</label>
                <input v-model="form.waiverSignature" class="w-full bg-white border border-outline-variant rounded-md px-4 py-2.5 font-body-md font-mono italic text-secondary border-dashed" placeholder="Alex Mercer" />
              </div>
            </div>

            <!-- Step 5: Tour -->
            <div v-if="step === 5" class="space-y-md">
              <div>
                <h2 class="font-headline-sm text-primary mb-xs">Virtual Tour &amp; Induction</h2>
                <p class="font-body-sm text-on-surface-variant">Review the club layouts before completing onboarding.</p>
              </div>
              <div class="grid grid-cols-2 gap-sm text-center pt-xs">
                <div class="p-sm bg-slate-50 rounded border border-outline-variant/50 flex flex-col items-center">
                  <span class="material-symbols-outlined text-secondary text-2xl">sports_volleyball</span>
                  <span class="font-label-bold text-xs mt-1">Indoor Courts</span>
                  <span class="text-[10px] text-on-surface-variant">Badminton A/B &amp; Volleyball</span>
                </div>
                <div class="p-sm bg-slate-50 rounded border border-outline-variant/50 flex flex-col items-center">
                  <span class="material-symbols-outlined text-secondary text-2xl">fitness_center</span>
                  <span class="font-label-bold text-xs mt-1">Gym &amp; Athletics</span>
                  <span class="text-[10px] text-on-surface-variant">Dumbbells, Treadmills &amp; Racks</span>
                </div>
                <div class="p-sm bg-slate-50 rounded border border-outline-variant/50 flex flex-col items-center">
                  <span class="material-symbols-outlined text-secondary text-2xl">pool</span>
                  <span class="font-label-bold text-xs mt-1">Swimming Center</span>
                  <span class="text-[10px] text-on-surface-variant">Pro Standard Aquatics</span>
                </div>
                <div class="p-sm bg-slate-50 rounded border border-outline-variant/50 flex flex-col items-center">
                  <span class="material-symbols-outlined text-secondary text-2xl">support_agent</span>
                  <span class="font-label-bold text-xs mt-1">Help Desk</span>
                  <span class="text-[10px] text-on-surface-variant">FAQ chatbot &amp; support tickets</span>
                </div>
              </div>
              <div class="flex items-center gap-sm pt-xs">
                <input v-model="form.tourCompleted" type="checkbox" id="tour-check" class="h-4 w-4 rounded border-outline-variant text-primary" />
                <label for="tour-check" class="text-xs text-on-surface-variant">I acknowledge the virtual layout tour and know where facilities are.</label>
              </div>
            </div>

            <!-- Validation Message -->
            <p v-if="validationError" class="text-error text-xs font-semibold mt-sm flex gap-1 items-center">
              <span class="material-symbols-outlined text-sm">error</span>
              <span>{{ validationError }}</span>
            </p>

          </div>
        </div>

        <!-- Wizard Buttons -->
        <div class="mt-xl flex items-center justify-between border-t border-outline-variant/30 pt-lg">
          <button 
            @click="prevStep" 
            :class="[step === 1 ? 'invisible' : '']" 
            class="px-6 py-3 font-label-bold text-on-surface-variant border border-outline-variant rounded-full hover:bg-slate-50 transition-colors"
          >
            Previous
          </button>
          
          <button 
            @click="nextStep" 
            class="flex items-center gap-xs px-8 py-3 bg-primary hover:bg-surface-tint text-on-primary font-label-bold rounded-full transition-all group shadow hover:shadow-md"
          >
            <span>{{ step === 5 ? 'Complete Setup' : 'Next Step' }}</span>
            <span class="material-symbols-outlined group-hover:translate-x-1 transition-transform" style="font-size: 18px;">arrow_forward</span>
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useClubStore } from '../../stores/clubStore'

const router = useRouter()
const store = useClubStore()

const step = ref(1)
const stepNames = ['Details', 'Plan', 'Safety', 'Disclaimer', 'Tour']
const validationError = ref('')

const form = reactive({
  firstName: '',
  lastName: '',
  phone: '',
  dob: '',
  email: '',
  tier: 'Pro',
  clubs: [],
  safetySigned: false,
  waiverSignature: '',
  tourCompleted: false
})

onMounted(() => {
  store.restoreSession()
  if (store.currentUser) {
    form.email = store.currentUser.email
    const names = store.currentUser.name.split(' ')
    form.firstName = names[0] || ''
    form.lastName = names[1] || ''
    form.clubs = store.currentUser.clubs || []
    
    // Redirect if already completed
    if (store.currentUser.onboardingStatus === 'completed') {
      router.push('/member/dashboard')
    }
  }
})

const prevStep = () => {
  validationError.value = ''
  if (step.value > 1) {
    step.value--
  }
}

const nextStep = () => {
  validationError.value = ''

  if (step.value === 1) {
    if (!form.firstName || !form.lastName || !form.phone || !form.dob) {
      validationError.value = 'Please fill in all personal details.'
      return
    }
  }

  if (step.value === 3) {
    if (!form.safetySigned) {
      validationError.value = 'You must acknowledge the safety guidelines to proceed.'
      return
    }
  }

  if (step.value === 4) {
    if (!form.waiverSignature || form.waiverSignature.trim().toLowerCase() !== `${form.firstName} ${form.lastName}`.trim().toLowerCase()) {
      validationError.value = 'Please sign using your exact full name matching step 1.'
      return
    }
  }

  if (step.value === 5) {
    if (!form.tourCompleted) {
      validationError.value = 'Please check the box confirming you completed the tour.'
      return
    }
    
    // Finish onboarding
    const res = store.completeOnboarding(form.email, form)
    if (res.success) {
      router.push('/member/dashboard')
    } else {
      validationError.value = res.message || 'Onboarding update failed.'
    }
    return
  }

  step.value++
}
</script>
