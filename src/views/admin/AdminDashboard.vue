<template>
  <PortalLayout>
    <div class="space-y-gutter">
      <!-- Title -->
      <div class="mb-lg flex flex-col md:flex-row md:items-end justify-between gap-md border-b border-outline-variant pb-sm">
        <div>
          <h2 class="font-display-lg text-display-lg font-bold text-primary tracking-tight">Admin Overview</h2>
          <p class="font-body-lg text-body-lg text-on-surface-variant mt-2">Operational status dashboard for today.</p>
        </div>
        <div class="flex gap-2">
          <button 
            @click="openCreateTournamentModal" 
            class="bg-primary text-white font-label-bold text-xs px-5 py-3 rounded-lg hover:bg-surface-tint transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <span class="material-symbols-outlined text-[18px]">add</span>
            Create Tournament
          </button>
          <button 
            @click="openBroadcastModal" 
            class="bg-[#fd761a] text-white font-label-bold text-xs px-5 py-3 rounded-lg hover:bg-secondary transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <span class="material-symbols-outlined text-[18px]">campaign</span>
            New Broadcast
          </button>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="flex border-b border-outline-variant gap-sm mb-md">
        <button 
          @click="activeTab = 'overview'" 
          :class="[activeTab === 'overview' ? 'border-b-2 border-secondary text-secondary font-bold' : 'text-on-surface-variant hover:text-primary']"
          class="pb-2 text-sm px-3 transition-all cursor-pointer font-semibold"
        >
          Overview
        </button>
        <button 
          @click="activeTab = 'tournaments'" 
          :class="[activeTab === 'tournaments' ? 'border-b-2 border-secondary text-secondary font-bold' : 'text-on-surface-variant hover:text-primary']"
          class="pb-2 text-sm px-3 transition-all cursor-pointer font-semibold"
        >
          Tournament Manager
        </button>
      </div>

      <!-- Overview Tab -->
      <div v-if="activeTab === 'overview'" class="grid grid-cols-1 md:grid-cols-12 gap-gutter">
        
        <!-- Registration Pipeline approvals (Span 8) -->
        <div class="md:col-span-8 bg-white border border-outline-variant rounded-xl p-md shadow-sm relative overflow-hidden">
          <div class="absolute top-0 right-0 w-32 h-32 bg-[#dae2fd]/20 rounded-bl-full -z-10"></div>
          
          <div class="flex justify-between items-center mb-md border-b border-outline-variant pb-sm">
            <h3 class="font-headline-sm text-sm font-bold text-primary flex items-center gap-2">
              <span class="material-symbols-outlined text-surface-tint">how_to_reg</span>
              Pending Registration Approvals
            </h3>
            <span class="text-xs bg-slate-100 text-on-surface-variant px-2.5 py-0.5 rounded-full font-semibold">{{ pendingApprovals.length }} Applicants</span>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="border-b border-outline-variant font-label-bold text-label-bold text-xs text-on-surface-variant bg-slate-50">
                  <th class="p-3">Applicant</th>
                  <th class="p-3">Registered Program / Tier</th>
                  <th class="p-3">Status</th>
                  <th class="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="text-xs font-body-sm">
                <tr 
                  v-for="u in pendingApprovals" 
                  :key="u.email"
                  class="border-b border-outline-variant/30 hover:bg-slate-50/50"
                >
                  <td class="p-3 flex items-center gap-2">
                    <div class="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-primary text-[10px]">
                      {{ u.name[0] }}{{ u.name.split(' ')[1]?.[0] || '' }}
                    </div>
                    <div>
                      <p class="font-semibold text-primary">{{ u.name }}</p>
                      <p class="text-[10px] text-on-surface-variant">{{ u.email }}</p>
                    </div>
                  </td>
                  <td class="p-3 text-on-surface">{{ u.tier }} Tier Membership</td>
                  <td class="p-3">
                    <span class="px-2 py-0.5 rounded bg-yellow-100 text-yellow-800 text-[9px] font-bold">
                      PENDING ONBOARD
                    </span>
                  </td>
                  <td class="p-3 text-right flex gap-1 justify-end">
                    <button 
                      @click="approveMember(u.email)"
                      class="p-1.5 text-green-700 hover:bg-green-50 rounded cursor-pointer"
                      title="Approve Member"
                    >
                      <span class="material-symbols-outlined text-[20px]">check_circle</span>
                    </button>
                    <button 
                      @click="declineMember(u.email)"
                      class="p-1.5 text-error hover:bg-red-50 rounded cursor-pointer"
                      title="Reject Applicant"
                    >
                      <span class="material-symbols-outlined text-[20px]">cancel</span>
                    </button>
                  </td>
                </tr>
                <tr v-if="pendingApprovals.length === 0">
                  <td colspan="4" class="p-4 text-center text-on-surface-variant">No pending member registrations.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Fee Payment Cycle Tracking (Span 4) -->
        <div class="md:col-span-4 bg-white border border-outline-variant rounded-xl p-md flex flex-col justify-between shadow-sm">
          <div>
            <h3 class="font-headline-sm text-sm font-bold text-primary mb-1">Fee Tracking Cycle</h3>
            <p class="text-xs text-on-surface-variant mb-md">Current dues cycle collections</p>
            
            <div class="flex items-end gap-2 mb-md">
              <span class="font-display-lg text-display-lg font-bold text-primary">82%</span>
              <span class="text-xs text-surface-tint mb-2">Collected</span>
            </div>
            
            <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-lg">
              <div class="h-full bg-primary rounded-full" style="width: 82%"></div>
            </div>
            
            <div class="space-y-3 text-xs">
              <div class="flex justify-between items-center p-3 rounded-lg bg-red-50 border border-red-200">
                <div class="flex items-center gap-2">
                  <span class="material-symbols-outlined text-error text-[20px]">warning</span>
                  <span class="font-label-bold text-error">Dues Pending Members</span>
                </div>
                <span class="font-headline-sm text-sm font-bold text-error">{{ pendingDuesCount }}</span>
              </div>
            </div>
          </div>
          
          <button 
            @click="sendDuesReminders"
            class="w-full mt-md px-4 py-3 border border-outline-variant text-primary font-label-bold text-xs rounded-lg hover:bg-slate-50 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span class="material-symbols-outlined text-[18px]">send</span> Send Reminders
          </button>
        </div>

        <!-- Upcoming Tournaments summary (Span 6) -->
        <div class="md:col-span-6 bg-white border border-outline-variant rounded-xl p-md shadow-sm">
          <div class="flex justify-between items-center mb-md border-b border-outline-variant pb-sm">
            <h3 class="font-headline-sm text-sm font-bold text-primary flex items-center gap-2">
              <span class="material-symbols-outlined text-surface-tint">emoji_events</span>
              Upcoming Tournaments
            </h3>
            <button @click="activeTab = 'tournaments'" class="text-xs text-secondary font-label-bold hover:underline cursor-pointer">Manage All</button>
          </div>

          <div class="space-y-md">
            <div 
              v-for="e in store.events" 
              :key="e.id"
              class="flex items-start gap-4 p-3 rounded-lg border border-outline-variant bg-slate-50/50 relative overflow-hidden"
            >
              <div class="absolute left-0 top-0 bottom-0 w-1" :class="[e.status === 'Completed' || e.status === 'Finished' ? 'bg-green-500' : 'bg-secondary-container']"></div>
              <div class="bg-slate-200 rounded p-2 text-center min-w-[56px] text-xs font-semibold">
                <span class="block text-primary uppercase text-[9px]">{{ formatMonth(e.date) }}</span>
                <span class="block text-primary text-sm font-bold">{{ e.date.split('-')[2] }}</span>
              </div>
              <div class="flex-grow text-xs">
                <div class="flex justify-between items-start">
                  <h4 class="font-headline-sm text-xs font-bold text-primary mb-1">{{ e.name }}</h4>
                  <span class="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-100 text-outline border border-outline-variant/30">{{ e.status }}</span>
                </div>
                <p class="text-on-surface-variant flex items-center gap-0.5 mt-1">
                  <span class="material-symbols-outlined text-xs">group</span> 
                  {{ e.registered || e.roster?.length || 0 }} / {{ e.max }} Registered
                </p>
                <div class="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mt-2">
                  <div class="h-full bg-secondary-container rounded-full" :style="{ width: Math.min(((e.registered || e.roster?.length || 0) / e.max) * 100, 100) + '%' }"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Faculty Escalations and Alerts (Span 6) -->
        <div class="md:col-span-6 bg-white border border-outline-variant rounded-xl p-md shadow-sm flex flex-col justify-between">
          <div>
            <div class="flex justify-between items-center mb-md border-b border-outline-variant pb-sm">
              <h3 class="font-headline-sm text-sm font-bold text-error flex items-center gap-2">
                <span class="material-symbols-outlined">priority_high</span>
                Escalations &amp; Disputes
              </h3>
              <span class="text-xs bg-red-100 text-error px-2.5 py-0.5 rounded-full font-semibold">{{ store.disputes.length }} Active</span>
            </div>

            <div class="space-y-sm text-xs">
              <div 
                v-for="d in store.disputes" 
                :key="d.id"
                class="bg-red-50/50 border border-red-200 p-3 rounded-lg flex justify-between items-center"
              >
                <div>
                  <p class="font-bold text-primary">{{ d.subject }}</p>
                  <p class="text-[10px] text-on-surface-variant mt-0.5">Event: {{ d.event }} • Date: {{ d.date }}</p>
                </div>
                <router-link to="/admin/support" class="text-xs text-error font-bold hover:underline">Manage</router-link>
              </div>
              <div v-if="store.disputes.length === 0" class="text-center py-md text-xs text-on-surface-variant">
                No active dispute escalations.
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- Tournament Manager Tab -->
      <div v-else-if="activeTab === 'tournaments'" class="space-y-md">
        <div class="flex justify-between items-center pb-sm border-b border-outline-variant">
          <h3 class="font-headline-md text-sm font-bold text-primary flex items-center gap-xs">
            <span class="material-symbols-outlined text-secondary">emoji_events</span>
            Tournament Fixtures &amp; Hierarchy
          </h3>
        </div>

        <div class="space-y-md">
          <div 
            v-for="event in store.events" 
            :key="event.id"
            class="bg-white border border-outline-variant rounded-xl p-md shadow-sm space-y-md"
          >
            <!-- Header of Tournament Card -->
            <div class="flex justify-between items-start border-b border-outline-variant/30 pb-xs">
              <div>
                <h3 class="font-headline-sm text-sm font-bold text-primary">{{ event.name }}</h3>
                <p class="text-xs text-on-surface-variant mt-1">
                  Sport: <span class="font-semibold capitalize text-primary">{{ event.sport }}</span> • 
                  Date: <span class="font-semibold">{{ event.date }}</span> • 
                  Venue: <span class="font-semibold">{{ event.venue }}</span>
                </p>
              </div>
              <div class="flex items-center gap-xs">
                <span 
                  :class="[
                    event.status === 'Active' ? 'bg-blue-100 text-blue-800' :
                    event.status === 'Registration Closed' ? 'bg-orange-100 text-orange-800' :
                    event.status === 'Finished' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                  ]"
                  class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase"
                >
                  {{ event.status }}
                </span>
              </div>
            </div>

            <!-- Active / Registration Open State -->
            <div v-if="event.status === 'Active'" class="grid grid-cols-1 md:grid-cols-12 gap-md items-center">
              <div class="md:col-span-8 space-y-xs">
                <p class="text-xs font-semibold text-primary">Registered Roster Players:</p>
                <div class="flex flex-wrap gap-xs">
                  <span 
                    v-for="p in event.roster" 
                    :key="p.email"
                    class="px-2 py-0.5 bg-slate-50 border border-outline-variant text-[11px] rounded-full text-on-surface-variant font-medium flex items-center gap-1"
                  >
                    {{ p.name }}
                    <span class="text-[9px] text-[#065F46] bg-[#D1FAE5] px-1 rounded-full font-bold">Approved</span>
                  </span>
                  <span v-if="event.roster.length === 0" class="text-xs text-on-surface-variant italic">No players registered yet.</span>
                </div>
              </div>
              <div class="md:col-span-4 text-right">
                <button 
                  @click="closeRegAndGenerate(event.id)"
                  class="px-4 py-2.5 bg-secondary text-white rounded font-label-bold text-xs hover:bg-secondary-container transition-all flex items-center gap-1 cursor-pointer w-full md:w-auto justify-center"
                >
                  <span class="material-symbols-outlined text-sm">event_busy</span>
                  Timeline Over: Generate Fixtures
                </button>
              </div>
            </div>

            <!-- Brackets & Winner selection state -->
            <div v-else-if="event.status === 'Registration Closed' || event.status === 'Finished' || event.status === 'Completed'" class="space-y-sm">
              
              <!-- Winners Announcement banner if Completed -->
              <div v-if="event.status === 'Completed' || event.status === 'Finished'" class="bg-green-50 border border-green-200 rounded-lg p-sm flex items-center justify-between text-xs">
                <div class="flex items-center gap-2">
                  <span class="material-symbols-outlined text-green-700 text-lg">workspace_premium</span>
                  <div>
                    <p class="font-bold text-green-800">Tournament Champion determined!</p>
                    <p class="text-green-700">Winner: <span class="font-extrabold text-green-950 uppercase">{{ event.winner }}</span></p>
                  </div>
                </div>
                <span class="text-[10px] text-green-800 font-bold bg-green-100 px-2 py-0.5 rounded-full">Finished</span>
              </div>

              <div class="space-y-sm">
                <h4 class="font-bold text-primary text-xs uppercase tracking-wider flex items-center gap-1">
                  <span class="material-symbols-outlined text-xs text-secondary">account_tree</span>
                  Current Brackets: {{ event.fixtures[0]?.round || 'Finals' }}
                </h4>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-sm">
                  <div 
                    v-for="(fixture, idx) in event.fixtures" 
                    :key="idx" 
                    class="p-sm bg-slate-50 border border-outline-variant rounded-lg space-y-sm text-xs"
                  >
                    <div class="flex justify-between items-center text-[10px] text-outline font-semibold">
                      <span>{{ fixture.match }}</span>
                      <span>{{ fixture.round }}</span>
                    </div>
                    <div class="flex justify-between items-center gap-sm">
                      <span :class="[fixture.winner === fixture.player1 ? 'font-bold text-green-700' : 'text-primary']">
                        {{ fixture.player1 }}
                      </span>
                      <span class="text-outline font-body-sm text-[10px]">vs</span>
                      <span :class="[fixture.winner === fixture.player2 ? 'font-bold text-green-700' : 'text-primary']">
                        {{ fixture.player2 }}
                      </span>
                    </div>
                    
                    <!-- Winner Selection Actions -->
                    <div v-if="event.status !== 'Completed' && event.status !== 'Finished'" class="pt-sm border-t border-outline-variant/30 flex items-center gap-sm justify-between">
                      <span class="text-[10px] text-on-surface-variant font-semibold">Select Winner:</span>
                      <div class="flex gap-1">
                        <button 
                          @click="selectWinner(event.id, idx, fixture.player1)" 
                          :class="[fixture.winner === fixture.player1 ? 'bg-green-700 text-white border-green-700' : 'border border-outline-variant text-on-surface-variant hover:bg-slate-100']"
                          class="px-2.5 py-1 rounded text-[9px] font-bold cursor-pointer"
                        >
                          {{ fixture.player1 }}
                        </button>
                        <button 
                          @click="selectWinner(event.id, idx, fixture.player2)" 
                          :class="[fixture.winner === fixture.player2 ? 'bg-green-700 text-white border-green-700' : 'border border-outline-variant text-on-surface-variant hover:bg-slate-100']"
                          class="px-2.5 py-1 rounded text-[9px] font-bold cursor-pointer"
                          v-if="fixture.player2 !== 'BYE'"
                        >
                          {{ fixture.player2 }}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Advance Round actions -->
                <div class="pt-sm flex justify-end gap-sm" v-if="event.status === 'Registration Closed'">
                  <button 
                    @click="advanceRound(event.id)"
                    class="px-4 py-2 bg-secondary text-white rounded font-label-bold text-xs hover:bg-secondary-container transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <span class="material-symbols-outlined text-sm">arrow_forward</span>
                    Advance Round / Generate Hierarchy
                  </button>
                </div>
                <div class="pt-sm flex justify-end gap-sm" v-if="event.status === 'Finished'">
                  <button 
                    @click="announceWinner(event.id)"
                    class="px-4 py-2 bg-green-700 text-white rounded font-label-bold text-xs hover:bg-green-800 transition-all flex items-center gap-1 cursor-pointer shadow-sm animate-pulse"
                  >
                    <span class="material-symbols-outlined text-sm">campaign</span>
                    Announce Champion to Public 🎉
                  </button>
                </div>
              </div>

            </div>
          </div>
          <div v-if="store.events.length === 0" class="text-center py-md text-xs text-on-surface-variant bg-white border rounded-xl">
            No tournaments currently created. Use "Create Tournament" to add one.
          </div>
        </div>
      </div>

      <!-- Broadcast announcement dialog overlay -->
      <div v-if="showBroadcastModal" class="fixed inset-0 bg-primary/40 z-50 flex items-center justify-center p-md">
        <form @submit.prevent="submitBroadcast" class="bg-white border border-outline-variant rounded-xl w-full max-w-md shadow-lg flex flex-col p-md space-y-md" @click.stop>
          <div class="flex justify-between items-center border-b border-outline-variant pb-sm">
            <h3 class="font-headline-sm text-sm font-bold text-primary flex items-center gap-1">
              <span class="material-symbols-outlined text-secondary">campaign</span>
              Broadcast Announcement
            </h3>
            <button type="button" @click="showBroadcastModal = false" class="p-1 hover:bg-slate-100 rounded-full cursor-pointer">
              <span class="material-symbols-outlined text-xl">close</span>
            </button>
          </div>
          
          <div class="space-y-1 text-xs">
            <label class="block font-semibold text-on-surface-variant">Announcement Title</label>
            <input v-model="broadcastForm.title" class="w-full bg-slate-50 border border-outline-variant rounded px-3 py-2.5 outline-none focus:border-primary" placeholder="e.g. Facility Maintenance" required />
          </div>
          
          <div class="space-y-1 text-xs">
            <label class="block font-semibold text-on-surface-variant">Message Details</label>
            <textarea v-model="broadcastForm.text" class="w-full bg-slate-50 border border-outline-variant rounded px-3 py-2.5 outline-none focus:border-primary resize-none" rows="3" placeholder="Write announcement text..." required></textarea>
          </div>

          <div class="space-y-1 text-xs">
            <label class="block font-semibold text-on-surface-variant">Message Severity</label>
            <select v-model="broadcastForm.type" class="w-full bg-slate-50 border border-outline-variant rounded px-3 py-2.5 outline-none focus:border-primary">
              <option value="info">Info (Blue)</option>
              <option value="warning">Warning (Orange)</option>
              <option value="success">Success (Green)</option>
            </select>
          </div>

          <button type="submit" class="w-full py-2.5 bg-primary text-on-primary font-label-bold text-xs rounded hover:bg-surface-tint transition-all shadow-sm cursor-pointer">
            Publish Announcement
          </button>
        </form>
      </div>

      <!-- Create Tournament Dialog overlay -->
      <div v-if="showCreateTournamentModal" class="fixed inset-0 bg-primary/40 backdrop-blur-sm z-50 flex items-center justify-center p-md">
        <form @submit.prevent="submitCreateTournament" class="bg-white border border-outline-variant rounded-xl w-full max-w-md shadow-lg flex flex-col p-md space-y-md animate-fade-in" @click.stop>
          <div class="flex justify-between items-center border-b border-outline-variant pb-sm">
            <h3 class="font-headline-sm text-sm font-bold text-primary flex items-center gap-1">
              <span class="material-symbols-outlined text-secondary">emoji_events</span>
              Create Tournament
            </h3>
            <button type="button" @click="showCreateTournamentModal = false" class="p-1 hover:bg-slate-100 rounded-full cursor-pointer">
              <span class="material-symbols-outlined text-xl">close</span>
            </button>
          </div>
          
          <div class="space-y-1 text-xs">
            <label class="block font-semibold text-on-surface-variant">Tournament Name</label>
            <input v-model="newTournamentForm.name" class="w-full bg-slate-50 border border-outline-variant rounded px-3 py-2 outline-none focus:border-primary" placeholder="e.g. Spring Rumbles Open" required />
          </div>

          <div class="grid grid-cols-2 gap-sm">
            <div class="space-y-1 text-xs">
              <label class="block font-semibold text-on-surface-variant">Sport</label>
              <select v-model="newTournamentForm.sport" class="w-full bg-slate-50 border border-outline-variant rounded px-3 py-2 outline-none focus:border-primary">
                <option value="Badminton">Badminton</option>
                <option value="Volleyball">Volleyball</option>
                <option value="Tennis">Tennis</option>
                <option value="Swimming">Swimming</option>
                <option value="Athletics">Athletics</option>
              </select>
            </div>
            <div class="space-y-1 text-xs">
              <label class="block font-semibold text-on-surface-variant">Bracket Format</label>
              <select v-model="newTournamentForm.format" class="w-full bg-slate-50 border border-outline-variant rounded px-3 py-2 outline-none focus:border-primary">
                <option value="Knockout">Knockout</option>
                <option value="Round-robin">Round Robin</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-sm">
            <div class="space-y-1 text-xs">
              <label class="block font-semibold text-on-surface-variant">Tournament Date</label>
              <input type="date" v-model="newTournamentForm.date" class="w-full bg-slate-50 border border-outline-variant rounded px-3 py-2 outline-none focus:border-primary" required />
            </div>
            <div class="space-y-1 text-xs">
              <label class="block font-semibold text-on-surface-variant">Reg. Deadline</label>
              <input type="date" v-model="newTournamentForm.deadline" class="w-full bg-slate-50 border border-outline-variant rounded px-3 py-2 outline-none focus:border-primary" required />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-sm">
            <div class="space-y-1 text-xs">
              <label class="block font-semibold text-on-surface-variant">Venue</label>
              <input v-model="newTournamentForm.venue" class="w-full bg-slate-50 border border-outline-variant rounded px-3 py-2 outline-none focus:border-primary" placeholder="e.g. Badminton Court A" required />
            </div>
            <div class="space-y-1 text-xs">
              <label class="block font-semibold text-on-surface-variant">Max Players / Teams</label>
              <select v-model="newTournamentForm.max" class="w-full bg-slate-50 border border-outline-variant rounded px-3 py-2 outline-none focus:border-primary">
                <option value="2">2 Players (Finals)</option>
                <option value="4">4 Players (Semifinals)</option>
                <option value="8">8 Players (Quarterfinals)</option>
                <option value="16">16 Players</option>
              </select>
            </div>
          </div>

          <button type="submit" class="w-full py-2.5 bg-primary text-on-primary font-label-bold text-xs rounded hover:bg-surface-tint transition-all shadow-sm cursor-pointer">
            Publish Tournament
          </button>
        </form>
      </div>

    </div>
  </PortalLayout>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import PortalLayout from '../../layouts/PortalLayout.vue'
import { useClubStore } from '../../stores/clubStore'

const store = useClubStore()

const activeTab = ref('overview')
const showBroadcastModal = ref(false)
const showCreateTournamentModal = ref(false)

const broadcastForm = reactive({
  title: '',
  text: '',
  type: 'info'
})

const newTournamentForm = reactive({
  name: '',
  sport: 'Tennis',
  format: 'Knockout',
  date: '',
  venue: '',
  max: 8,
  deadline: ''
})

const formatMonth = (dateStr) => {
  if (!dateStr) return 'DATE'
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const parts = dateStr.split('-')
  if (parts.length < 2) return 'DATE'
  const monthIdx = parseInt(parts[1], 10) - 1
  return months[monthIdx] || 'DATE'
}

const pendingApprovals = computed(() => {
  return store.users.filter(u => u.role === 'member' && u.onboardingStatus === 'pending')
})

const pendingDuesCount = computed(() => {
  return store.users.filter(u => u.role === 'member' && u.membershipDue > 0).length
})

const approveMember = (email) => {
  store.completeOnboarding(email, { tier: 'Pro' })
  const u = store.users.find(us => us.email === email)
  if (u) { u.membershipDue = 0 }
  alert(`Member (${email}) onboarding approved.`)
}

const declineMember = (email) => {
  const index = store.users.findIndex(u => u.email === email)
  if (index !== -1) {
    store.users.splice(index, 1)
    alert(`Registration declined for ${email}.`)
  }
}

const sendDuesReminders = () => {
  store.broadcastAnnouncement(
    'Payment Dues Reminder',
    'Outstanding annual dues for memberships have been flagged. Please settle pending dues on the Payments dashboard.',
    'warning'
  )
  alert('Dues reminder notifications sent to all pending members.')
}

const openBroadcastModal = () => {
  showBroadcastModal.value = true
}

const submitBroadcast = () => {
  store.broadcastAnnouncement(broadcastForm.title, broadcastForm.text, broadcastForm.type)
  showBroadcastModal.value = false
  broadcastForm.title = ''
  broadcastForm.text = ''
}

const openCreateTournamentModal = () => {
  newTournamentForm.name = ''
  newTournamentForm.sport = 'Tennis'
  newTournamentForm.format = 'Knockout'
  newTournamentForm.date = ''
  newTournamentForm.venue = ''
  newTournamentForm.max = 8
  newTournamentForm.deadline = ''
  showCreateTournamentModal.value = true
}

const submitCreateTournament = () => {
  store.createTournament(
    newTournamentForm.name,
    newTournamentForm.sport,
    newTournamentForm.format,
    newTournamentForm.date,
    newTournamentForm.venue,
    newTournamentForm.max,
    newTournamentForm.deadline
  )
  showCreateTournamentModal.value = false
  activeTab.value = 'tournaments'
  alert(`Tournament "${newTournamentForm.name}" created successfully.`)
}

const closeRegAndGenerate = (eventId) => {
  store.closeRegistrationAndGenerateFixtures(eventId)
  alert('Registration timeline over. Initial round brackets automatically generated from approved roster.')
}

const selectWinner = (eventId, idx, winnerName) => {
  store.setFixtureWinner(eventId, idx, winnerName)
}

const advanceRound = (eventId) => {
  const res = store.generateNextRound(eventId)
  if (!res.success) {
    alert(res.message)
  } else if (res.finished) {
    alert(`Final round matches fixed! Champion: ${res.winner}`)
  } else {
    alert('Round advanced. Next round matches generated.')
  }
}

const announceWinner = (eventId) => {
  store.announceTournamentWinner(eventId)
  alert('Winner successfully announced, broadcasted, and tournament finished!')
}
</script>
