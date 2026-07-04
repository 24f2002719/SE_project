<template>
  <div class="bg-background text-on-background font-body-md min-h-screen flex flex-col antialiased">
    <!-- TopNavBar -->
    <nav class="bg-white text-primary font-body-md text-body-md top-0 border-b border-outline-variant flat no shadows transition-all duration-200 sticky z-50">
      <div class="flex justify-between items-center w-full px-margin-desktop max-w-7xl mx-auto py-4">
        <div class="flex items-center gap-xs font-display-lg text-headline-md font-bold text-primary">
          <span class="material-symbols-outlined text-secondary-container text-3xl font-variation-settings-['FILL'_1]">sports_soccer</span>
          <span>NexSport</span>
        </div>
        <div class="hidden md:flex space-x-gutter items-center">
          <a class="text-on-surface-variant hover:text-secondary transition-colors font-semibold" href="#features">Features</a>
          <a class="text-on-surface-variant hover:text-secondary transition-colors font-semibold" href="#about">About</a>
          <router-link class="text-on-surface-variant hover:text-secondary transition-colors font-semibold" to="/dev-api">API Documentation</router-link>
        </div>
        <div class="flex space-x-sm">
          <router-link to="/login" class="px-6 py-2 border border-outline rounded-lg text-primary font-label-bold text-label-bold hover:bg-surface-variant transition-colors">Login</router-link>
          <router-link to="/login?signup=true" class="px-6 py-2 bg-secondary text-on-secondary rounded-lg font-label-bold text-label-bold hover:bg-secondary-container transition-colors">Join Now</router-link>
        </div>
      </div>
    </nav>

    <!-- Main Content Area -->
    <main class="flex-grow">
      <!-- Hero Section -->
      <section class="relative pt-xl pb-xl px-margin-desktop max-w-7xl mx-auto overflow-hidden">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-xl items-center relative z-10">
          <div class="space-y-lg">
            <h1 class="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-background leading-tight">
              Elevate Your Game,<br/>Simplify Your Club.
            </h1>
            <p class="font-body-lg text-body-lg text-on-surface-variant max-w-lg">
              The all-in-one management platform for high-performance sports clubs. Ditch the endless WhatsApp chats and take control of scheduling, rosters, and communications.
            </p>
            <div class="flex flex-col sm:flex-row gap-sm">
              <router-link to="/login?signup=true" class="px-8 py-3 bg-secondary text-on-secondary rounded-lg font-label-bold text-label-bold hover:bg-secondary-container transition-colors shadow-sm text-center">
                Join the Club
              </router-link>
              <router-link to="/login" class="px-8 py-3 bg-white text-primary border border-outline rounded-lg font-label-bold text-label-bold hover:bg-surface-variant transition-colors shadow-sm text-center">
                Member Login
              </router-link>
            </div>
          </div>
          <div class="relative rounded-xl overflow-hidden shadow-lg border border-outline-variant group h-96 bg-primary-container">
            <div class="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style="background-image: url('https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=800')"></div>
            <div class="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent"></div>
            <div class="absolute bottom-md left-md right-md bg-white/90 backdrop-blur-md p-md rounded-lg border border-outline-variant">
              <div class="flex items-center justify-between">
                <div>
                  <p class="font-label-bold text-[10px] text-on-surface-variant uppercase tracking-wider">Next Match</p>
                  <p class="font-headline-sm text-headline-sm text-primary mt-1">Court 1 - Finals</p>
                </div>
                <span class="material-symbols-outlined text-secondary text-3xl">sports_tennis</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Features Bento Grid -->
      <section class="py-xl bg-surface-container-lowest px-margin-desktop border-y border-outline-variant" id="features">
        <div class="max-w-7xl mx-auto space-y-lg">
          <div class="text-center max-w-2xl mx-auto space-y-sm">
            <h2 class="font-headline-md text-headline-md text-primary">High-Performance Tools</h2>
            <p class="font-body-md text-body-md text-on-surface-variant">Everything you need to manage your facility, teams, and events in one unified ecosystem.</p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-md">
            <!-- Feature 1 -->
            <div class="bg-white rounded-xl p-lg border border-outline-variant shadow-sm hover:shadow-md transition-shadow group flex flex-col justify-between h-full min-h-[300px]">
              <div class="space-y-sm">
                <div class="w-12 h-12 rounded-full bg-secondary-fixed flex items-center justify-center mb-md group-hover:bg-secondary-fixed-dim transition-colors">
                  <span class="material-symbols-outlined text-on-secondary-fixed text-2xl">event_available</span>
                </div>
                <h3 class="font-headline-sm text-headline-sm text-primary">Real-Time Booking</h3>
                <p class="font-body-md text-body-md text-on-surface-variant">Instant court reservations with live availability tracking. Eliminate double-bookings forever.</p>
              </div>
              <div class="mt-lg w-full h-2 bg-surface-variant rounded-full overflow-hidden">
                <div class="h-full bg-secondary w-3/4 rounded-full"></div>
              </div>
            </div>
            <!-- Feature 2 -->
            <div class="bg-primary-container text-on-primary-container rounded-xl p-lg border border-primary-fixed group flex flex-col justify-between h-full min-h-[300px] md:col-span-2 relative overflow-hidden">
              <div class="relative z-10 space-y-sm max-w-md">
                <div class="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center mb-md">
                  <span class="material-symbols-outlined text-on-primary-fixed text-2xl">notifications_active</span>
                </div>
                <h3 class="font-headline-sm text-headline-sm text-on-primary">Automated Notifications</h3>
                <p class="font-body-md text-body-md text-primary-fixed-dim">Keep every member informed instantly. Automated alerts for schedule changes, match results, and club announcements.</p>
              </div>
              <span class="material-symbols-outlined absolute -bottom-10 -right-10 text-[200px] text-white opacity-5 rotate-12">campaign</span>
            </div>
            <!-- Feature 3 -->
            <div class="bg-white rounded-xl p-lg border border-outline-variant shadow-sm hover:shadow-md transition-shadow group flex flex-col justify-between h-full min-h-[300px] md:col-span-3">
              <div class="flex flex-col md:flex-row items-center gap-lg">
                <div class="flex-1 space-y-sm">
                  <div class="w-12 h-12 rounded-full bg-tertiary-fixed flex items-center justify-center mb-md">
                    <span class="material-symbols-outlined text-on-tertiary-fixed text-2xl">emoji_events</span>
                  </div>
                  <h3 class="font-headline-sm text-headline-sm text-primary">Event Management</h3>
                  <p class="font-body-md text-body-md text-on-surface-variant">From casual round-robins to competitive league tournaments, orchestrate every detail effortlessly.</p>
                  <router-link to="/login?signup=true" class="mt-sm font-label-bold text-label-bold text-secondary flex items-center hover:underline">
                    Get Started <span class="material-symbols-outlined text-sm ml-1">arrow_forward</span>
                  </router-link>
                </div>
                <div class="flex-1 w-full relative h-48 rounded-lg overflow-hidden border border-outline-variant bg-slate-200">
                  <div class="w-full h-full bg-cover bg-center" style="background-image: url('https://images.unsplash.com/photo-1577223625816-7546f13df25d?auto=format&fit=crop&q=80&w=800')"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- About Section -->
      <section class="py-xl px-margin-desktop max-w-7xl mx-auto" id="about">
        <div class="bg-surface-container-low rounded-2xl p-xl border border-outline-variant relative overflow-hidden">
          <div class="absolute top-0 right-0 w-64 h-64 bg-secondary opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div class="relative z-10 max-w-3xl">
            <h2 class="font-headline-md text-headline-md text-primary mb-md">Our Mission by DevX</h2>
            <p class="font-body-lg text-body-lg text-on-surface-variant mb-lg leading-relaxed">
              We are DevX, Team-029. We built NexSport with a singular focus: to eliminate the chaos of manual WhatsApp coordination and spreadsheet scheduling for sports clubs. We believe administrators should spend less time wrangling messages and more time building their community.
            </p>
            <div class="flex items-center space-x-md">
              <div class="flex -space-x-4">
                <div class="w-12 h-12 rounded-full border-2 border-white bg-slate-300 flex items-center justify-center font-bold text-xs text-primary">SM</div>
                <div class="w-12 h-12 rounded-full border-2 border-white bg-slate-400 flex items-center justify-center font-bold text-xs text-primary">VM</div>
                <div class="w-12 h-12 rounded-full border-2 border-white bg-slate-500 flex items-center justify-center font-bold text-xs text-primary">VS</div>
                <div class="w-12 h-12 rounded-full border-2 border-white bg-surface-variant flex items-center justify-center font-label-bold text-on-surface-variant text-xs">+2</div>
              </div>
              <span class="font-label-bold text-label-bold text-on-surface-variant">Team DevX • Milestone 1 Deployment</span>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t border-outline-variant w-full py-xl text-on-surface opacity-80 hover:opacity-100 transition-opacity">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-gutter px-margin-desktop max-w-7xl mx-auto">
        <div class="space-y-sm col-span-1 md:col-span-2">
          <div class="font-headline-sm text-headline-sm font-bold text-primary flex items-center gap-xs">
            <span class="material-symbols-outlined text-secondary-container text-2xl font-variation-settings-['FILL'_1]">sports_soccer</span>
            <span>NexSport</span>
          </div>
          <p class="text-on-surface-variant max-w-sm text-sm">Empowering clubs to manage smarter, play harder, and grow faster.</p>
          <p class="text-on-surface-variant text-xs mt-lg">© 2026 NexSport Club Management. Submitted by Team-029.</p>
        </div>
        <div class="space-y-md">
          <h4 class="font-label-bold text-label-bold text-primary uppercase tracking-wider">Platform</h4>
          <ul class="space-y-sm text-sm">
            <li><a class="text-on-surface-variant hover:text-secondary underline" href="#features">Features</a></li>
            <li><router-link class="text-on-surface-variant hover:text-secondary underline" to="/dev-api">Developer API specs</router-link></li>
          </ul>
        </div>
        <div class="space-y-md">
          <h4 class="font-label-bold text-label-bold text-primary uppercase tracking-wider">Legal & Contact</h4>
          <ul class="space-y-sm text-sm">
            <li><span class="text-on-surface-variant">IISER Bhopal Sports Complex</span></li>
            <li><span class="text-on-surface-variant">Email: support@nexsport.com</span></li>
          </ul>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
// Landing page setup
</script>
