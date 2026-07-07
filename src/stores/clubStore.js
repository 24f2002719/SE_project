import { defineStore } from 'pinia'

export const useClubStore = defineStore('club', {
  state: () => ({
    currentUser: null,
    
    // Accounts list
    users: [
      { name: 'Alex Mercer', email: 'alex@iiserb.ac.in', password: 'password123', role: 'member', tier: 'Pro', onboardingStatus: 'pending', membershipStatus: 'Active', membershipDue: 0, attendanceRate: 85 },
      { name: 'Deepanshi Aggarwal', email: 'deepanshi@iiserb.ac.in', password: 'password123', role: 'coach' },
      { name: 'Sarah Miller', email: 'sarah@iiserb.ac.in', password: 'password123', role: 'coach' },
      { name: 'Krishna Agarwal', email: 'krishna@iiserb.ac.in', password: 'password123', role: 'admin' },
      { name: 'Dr. Verma', email: 'verma@iiserb.ac.in', password: 'password123', role: 'faculty' },
      { name: 'Mr. Mercer (Parent)', email: 'parent@iiserb.ac.in', password: 'password123', role: 'parent', childEmail: 'alex@iiserb.ac.in' }
    ],

    // Facilities Catalog
    courts: [
      { id: 'badminton-a', name: 'Badminton Court A', type: 'Badminton', status: 'AVAILABLE', time: 'Open now until 4:00 PM', next: 'Alex M.', accent: '#10B981' },
      { id: 'badminton-b', name: 'Badminton Court B', type: 'Badminton', status: 'BOOKED', time: 'Booked until 5:30 PM', next: 'Elite Squad Training', accent: '#EF4444' },
      { id: 'volleyball-main', name: 'Volleyball Main', type: 'Volleyball', status: 'MAINTENANCE', time: 'Net Replacement in progress', next: 'Pending Maintenance', accent: '#F59E0B' },
      { id: 'volleyball-practice', name: 'Volleyball Practice', type: 'Volleyball', status: 'AVAILABLE', time: 'Available after 2:00 PM', next: 'Open', accent: '#10B981' },
      { id: 'tennis-1', name: 'Tennis Center 1', type: 'Tennis', status: 'AVAILABLE', time: 'Open until 6:00 PM', next: 'J. Doe', accent: '#10B981' },
      { id: 'tennis-2', name: 'Tennis Center 2', type: 'Tennis', status: 'AVAILABLE', time: 'Available after 4:30 PM', next: 'Open', accent: '#10B981' }
    ],

    // Active Court Bookings
    bookings: [
      { id: 'BK-1001', courtId: 'badminton-b', userEmail: 'alex@iiserb.ac.in', userName: 'Alex Mercer', date: '2026-07-04', startTime: '13:00', endTime: '15:00', status: 'Approved' },
      { id: 'BK-1002', courtId: 'tennis-1', userEmail: 'john@iiserb.ac.in', userName: 'John Doe', date: '2026-07-04', startTime: '14:00', endTime: '15:30', status: 'Approved' }
    ],

    // Member Onboarding wizard data
    onboarding: {
      firstName: '',
      lastName: '',
      dob: '',
      phone: '',
      email: '',
      tier: 'Pro',
      safetySigned: false,
      safetySignature: '',
      waiverSigned: false,
      waiverSignature: '',
      tourCompleted: false,
      step: 1
    },

    // Transaction histories
    payments: [
      { id: 'TXN-901', userEmail: 'alex@iiserb.ac.in', date: '2025-10-15', desc: 'Pro Tier Annual Renewal', amount: 1200.00, status: 'Paid', receiptId: 'REC-10294' },
      { id: 'TXN-902', userEmail: 'alex@iiserb.ac.in', date: '2025-09-02', desc: 'Tennis Court Booking (Indoor)', amount: 45.00, status: 'Paid', receiptId: 'REC-10243' },
      { id: 'TXN-903', userEmail: 'alex@iiserb.ac.in', date: '2025-08-18', desc: 'Summer League Registration', amount: 150.00, status: 'Paid', receiptId: 'REC-09823' }
    ],

    // Tournaments & League events
    events: [
      { id: 1, name: 'Winter Classic Tennis', sport: 'Tennis', format: 'Knockout', date: '2026-11-12', venue: 'Tennis Center 1', registered: 5, max: 8, status: 'Active', deadline: '2026-11-05', 
        roster: [
          { name: 'Alex Mercer', email: 'alex@iiserb.ac.in', attendanceRate: 85, status: 'Approved' },
          { name: 'John Doe', email: 'john@iiserb.ac.in', attendanceRate: 78, status: 'Approved' },
          { name: 'Michael Park', email: 'michael@iiserb.ac.in', attendanceRate: 92, status: 'Approved' },
          { name: 'Sara Connor', email: 'sara@iiserb.ac.in', attendanceRate: 95, status: 'Approved' },
          { name: 'David Lee', email: 'david@iiserb.ac.in', attendanceRate: 72, status: 'Pending Approval' } // attendance below 75%
        ],
        fixtures: [
          { round: 'Semifinals', match: 'Match 1', player1: 'Alex Mercer', player2: 'John Doe', winner: '' },
          { round: 'Semifinals', match: 'Match 2', player1: 'Michael Park', player2: 'Sara Connor', winner: '' }
        ]
      },
      { id: 2, name: 'Youth Swim Meet', sport: 'Swimming', format: 'Round-robin', date: '2026-12-05', venue: 'Aquatics Complex', registered: 4, max: 8, status: 'Active', deadline: '2026-11-30', 
        roster: [
          { name: 'Emma Wilson', email: 'emma@iiserb.ac.in', attendanceRate: 64, status: 'Pending Approval' }
        ],
        fixtures: [] 
      },
      { id: 3, name: 'Badminton Spring Rumbles', sport: 'Badminton', format: 'Knockout', date: '2026-03-15', venue: 'Badminton Court A', registered: 2, max: 16, status: 'Draft', deadline: '2026-03-10', roster: [], fixtures: [] }
    ],

    // Support/Grievance Tickets
    tickets: [
      { id: 'TK-8492', category: 'Facility Issue', subject: 'Court 3 Lighting Issue', date: '2026-07-04', user: 'Alex Mercer', userEmail: 'alex@iiserb.ac.in', status: 'In Progress', messages: [
        { sender: 'Alex Mercer', text: 'Three bulbs on Court A are flickering heavily.', time: '2 hours ago' }
      ] },
      { id: 'TK-8488', category: 'Billing & Memberships', subject: 'Double Billing Inquiry', date: '2026-07-02', user: 'Alex Mercer', userEmail: 'alex@iiserb.ac.in', status: 'Escalated to Admin', messages: [
        { sender: 'Alex Mercer', text: 'I was charged twice for the renewal fee.', time: '2 days ago' }
      ] }
    ],

    // Support Disputes
    disputes: [
      { id: 'DSP-101', event: 'Winter Classic Tennis', loggingUser: 'Krishna Agarwal', subject: 'Player Eligibility Dispute', details: 'Emma Wilson was nominated despite having a 64% training session attendance rate, which is below the mandated 75% threshold.', status: 'Pending Review', date: '2026-07-04', resolution: '' }
    ],

    // In-App Notifications & Announcements
    notifications: [
      { id: 1, title: 'Annual Tournament Registration Open', text: 'Secure your spot for the spring classic before slots fill up.', time: '2 hours ago', type: 'warning' },
      { id: 2, title: 'Facility Maintenance Notice', text: 'Volleyball Main court will be closed for resurfacing on Mar 20th.', time: 'Yesterday', type: 'info' },
      { id: 3, title: 'New Coaching Staff Added', text: 'Welcome Coach Sarah to the elite badminton training program.', time: '3 days ago', type: 'success' }
    ],

    // Coach schedules & attendance rosters
    attendance: [
      { id: 101, sport: 'Badminton', coach: 'Deepanshi Aggarwal', date: '2026-07-04', time: '18:00 - 19:30', title: 'Advanced Badminton Drills', facility: 'Badminton Court A', members: [
        { name: 'Alex Mercer', email: 'alex@iiserb.ac.in', present: true, attendanceRate: 85 },
        { name: 'John Doe', email: 'john@iiserb.ac.in', present: null, attendanceRate: 78 },
        { name: 'Emma Wilson', email: 'emma@iiserb.ac.in', present: null, attendanceRate: 64 }, // Low attendance
        { name: 'Michael Park', email: 'michael@iiserb.ac.in', present: null, attendanceRate: 92 }
      ]},
      { id: 102, sport: 'Volleyball', coach: 'Sarah Miller', date: '2026-07-05', time: '10:00 - 12:00', title: 'Social Volleyball Match', facility: 'Volleyball Practice', members: [
        { name: 'Alex Mercer', email: 'alex@iiserb.ac.in', present: null, attendanceRate: 85 },
        { name: 'David Lee', email: 'david@iiserb.ac.in', present: null, attendanceRate: 72 }, // Low attendance
        { name: 'Sara Connor', email: 'sara@iiserb.ac.in', present: null, attendanceRate: 95 }
      ]}
    ],

    // Gym equipment usage registry
    equipment: [
      { id: 'EQ-001', name: 'Treadmill #3', status: 'Active', usage: 'High', lastCheck: '2026-06-30', notes: 'Running smoothly' },
      { id: 'EQ-002', name: 'Badminton Nets - Court B', status: 'Damaged', usage: 'Needs Restring', lastCheck: '2026-07-01', notes: 'Torn mesh' },
      { id: 'EQ-003', name: 'Dumbbell Rack 10-30kg', status: 'Active', usage: 'Normal', lastCheck: '2026-06-25', notes: 'All weights accounted for' },
      { id: 'EQ-004', name: 'Volleyball Post Tensioner', status: 'Pending Restock', usage: 'Broken', lastCheck: '2026-07-03', notes: 'Replacement post tensioner ordered' }
    ]
  }),

  actions: {
    // Session Auth
    login(email, password) {
      const user = this.users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password)
      if (user) {
        this.currentUser = { ...user }
        // Mock JWT
        sessionStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mockToken')
        sessionStorage.setItem('user', JSON.stringify(this.currentUser))
        return { success: true, user }
      }
      return { success: false, message: 'Invalid email or password.' }
    },
    
    register(name, email, password, role = 'member') {
      // Validate IISER Bhopal email domain
      if (!email.toLowerCase().endsWith('@iiserb.ac.in')) {
        return { success: false, message: 'Signup is restricted to IISER Bhopal users (@iiserb.ac.in).' }
      }
      // Check existing user
      if (this.users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        return { success: false, message: 'Email is already registered.' }
      }
      const newUser = {
        name,
        email,
        password,
        role,
        tier: role === 'member' ? 'Standard' : null,
        onboardingStatus: role === 'member' ? 'pending' : null,
        membershipStatus: role === 'member' ? 'Active' : null,
        membershipDue: role === 'member' ? 1200 : 0,
        attendanceRate: 100
      }
      this.users.push(newUser)
      return { success: true, user: newUser }
    },

    logout() {
      this.currentUser = null
      sessionStorage.removeItem('token')
      sessionStorage.removeItem('user')
    },

    restoreSession() {
      const savedUser = sessionStorage.getItem('user')
      if (savedUser) {
        this.currentUser = JSON.parse(savedUser)
      }
    },

    // Facility Booking
    bookCourt(courtId, userEmail, userName, date, startTime, endTime) {
      // Check eligibility
      const user = this.users.find(u => u.email === userEmail)
      if (user && user.membershipStatus === 'Lapsed') {
        return { success: false, message: 'Booking blocked: Membership has lapsed or has unpaid dues.' }
      }
      if (user && user.onboardingStatus === 'pending') {
        return { success: false, message: 'Booking blocked: Please complete your digital onboarding wizard.' }
      }

      // Check conflict
      const hasConflict = this.bookings.some(b => 
        b.courtId === courtId &&
        b.date === date &&
        b.status !== 'Declined' &&
        ((startTime >= b.startTime && startTime < b.endTime) ||
         (endTime > b.startTime && endTime <= b.endTime) ||
         (startTime <= b.startTime && endTime >= b.endTime))
      )
      
      const court = this.courts.find(c => c.id === courtId)
      if (court && court.status === 'MAINTENANCE') {
        return { success: false, message: 'Booking blocked: Facility is currently under maintenance.' }
      }

      if (hasConflict) {
        return { success: false, message: 'Booking conflict: This court is already reserved for the selected slot.' }
      }

      const newBooking = {
        id: 'BK-' + Math.floor(1000 + Math.random() * 9000),
        courtId,
        userEmail,
        userName,
        date,
        startTime,
        endTime,
        status: 'Approved'
      }

      this.bookings.push(newBooking)
      
      // Update real-time status in list
      if (court && date === new Date().toISOString().split('T')[0]) {
        court.status = 'BOOKED'
        court.time = `Booked until ${endTime}`
        court.next = userName
        court.accent = '#EF4444'
      }

      return { success: true, booking: newBooking }
    },

    cancelBooking(bookingId) {
      const index = this.bookings.findIndex(b => b.id === bookingId)
      if (index !== -1) {
        const booking = this.bookings[index]
        this.bookings.splice(index, 1)

        // Restore court status if it was active
        const court = this.courts.find(c => c.id === booking.courtId)
        if (court) {
          court.status = 'AVAILABLE'
          court.time = 'Open now'
          court.next = 'Open'
          court.accent = '#10B981'
        }

        // Add cancellation notification
        this.notifications.unshift({
          id: Date.now(),
          title: 'Booking Cancelled',
          text: `Your reservation for ${court ? court.name : 'Court'} on ${booking.date} at ${booking.startTime} was cancelled.`,
          time: 'Just now',
          type: 'info'
        })

        // Broadcast to waitlists
        this.broadcastAnnouncement(
          'Court Slot Opened!',
          `A slot for ${court ? court.name : 'Court'} on ${booking.date} at ${booking.startTime} - ${booking.endTime} is now available!`,
          'success'
        )
        return { success: true }
      }
      return { success: false, message: 'Booking not found.' }
    },

    // Admin override/block maintenance
    overrideBooking(courtId, newStatus, details = '') {
      const court = this.courts.find(c => c.id === courtId)
      if (court) {
        court.status = newStatus
        if (newStatus === 'MAINTENANCE') {
          court.time = details || 'Blocked for maintenance'
          court.next = 'Under repair'
          court.accent = '#F59E0B'
          
          // Cancel active bookings for today on this court
          const today = new Date().toISOString().split('T')[0]
          const affectedBookings = this.bookings.filter(b => b.courtId === courtId && b.date === today)
          affectedBookings.forEach(b => {
            this.cancelBooking(b.id)
          })
        } else if (newStatus === 'AVAILABLE') {
          court.time = 'Open now'
          court.next = 'Open'
          court.accent = '#10B981'
        }
        return { success: true }
      }
      return { success: false }
    },

    // Member Onboarding wizard Actions
    completeOnboarding(userEmail, onboardingData) {
      const user = this.users.find(u => u.email === userEmail)
      if (user) {
        user.onboardingStatus = 'completed'
        user.membershipStatus = 'Active'
        user.tier = onboardingData.tier
        user.membershipDue = onboardingData.tier === 'Pro' ? 1200 : 600
        
        // Update Session details if current user
        if (this.currentUser && this.currentUser.email === userEmail) {
          this.currentUser.onboardingStatus = 'completed'
          this.currentUser.membershipStatus = 'Active'
          this.currentUser.tier = onboardingData.tier
          this.currentUser.membershipDue = user.membershipDue
          sessionStorage.setItem('user', JSON.stringify(this.currentUser))
        }

        // Add payment transaction history
        this.payments.unshift({
          id: 'TXN-' + Math.floor(1000 + Math.random() * 9000),
          userEmail,
          date: new Date().toISOString().split('T')[0],
          desc: `${onboardingData.tier} Tier Membership Dues`,
          amount: user.membershipDue,
          status: 'Pending',
          receiptId: 'REC-' + Math.floor(10000 + Math.random() * 90000)
        })

        return { success: true }
      }
      return { success: false, message: 'User not found.' }
    },

    // Payments
    payDues(userEmail, transactionId) {
      const txn = this.payments.find(p => p.id === transactionId && p.userEmail === userEmail)
      if (txn) {
        txn.status = 'Paid'
        const user = this.users.find(u => u.email === userEmail)
        if (user) {
          user.membershipDue = 0
          if (this.currentUser && this.currentUser.email === userEmail) {
            this.currentUser.membershipDue = 0
            sessionStorage.setItem('user', JSON.stringify(this.currentUser))
          }
        }
        return { success: true }
      }
      return { success: false, message: 'Transaction record not found.' }
    },

    // Attendance marking
    confirmAttendance(sessionId, userEmail, presentState) {
      const session = this.attendance.find(s => s.id === sessionId)
      if (session) {
        const member = session.members.find(m => m.email === userEmail)
        if (member) {
          member.present = presentState
          // Simulate recalculating attendanceRate
          const user = this.users.find(u => u.email === userEmail)
          if (user) {
            if (presentState === false) {
              member.attendanceRate = Math.max(50, member.attendanceRate - 5)
            } else {
              member.attendanceRate = Math.min(100, member.attendanceRate + 2)
            }
            user.attendanceRate = member.attendanceRate
          }
          return { success: true }
        }
      }
      return { success: false }
    },

    // Create session (Coach)
    createSession(coachName, sport, date, time, title, facility) {
      const newSession = {
        id: Date.now(),
        sport,
        coach: coachName,
        date,
        time,
        title,
        facility,
        members: this.users
          .filter(u => u.role === 'member' && u.onboardingStatus === 'completed')
          .map(u => ({
            name: u.name,
            email: u.email,
            present: null,
            attendanceRate: u.attendanceRate
          }))
      }
      this.attendance.push(newSession)
      return { success: true, session: newSession }
    },

    updateSession(sessionId, sport, date, time, title, facility) {
      const session = this.attendance.find(s => s.id === sessionId)
      if (session) {
        session.sport = sport
        session.date = date
        session.time = time
        session.title = title
        session.facility = facility
        return { success: true, session }
      }
      return { success: false, message: 'Session not found.' }
    },

    deleteSession(sessionId) {
      const index = this.attendance.findIndex(s => s.id === sessionId)
      if (index !== -1) {
        this.attendance.splice(index, 1)
        return { success: true }
      }
      return { success: false, message: 'Session not found.' }
    },

    // Support tickets
    createTicket(userEmail, userName, category, subject, description) {
      const newTicket = {
        id: 'TK-' + Math.floor(1000 + Math.random() * 9000),
        category,
        subject,
        date: new Date().toISOString().split('T')[0],
        user: userName,
        userEmail,
        status: 'Open',
        messages: [
          { sender: userName, text: description, time: 'Just now' }
        ]
      }
      this.tickets.unshift(newTicket)
      return { success: true, ticket: newTicket }
    },

    replyTicket(ticketId, sender, text) {
      const ticket = this.tickets.find(t => t.id === ticketId)
      if (ticket) {
        ticket.messages.push({
          sender,
          text,
          time: 'Just now'
        })
        if (sender !== ticket.user) {
          ticket.status = 'In Progress'
        }
        return { success: true }
      }
      return { success: false }
    },

    resolveTicket(ticketId) {
      const ticket = this.tickets.find(t => t.id === ticketId)
      if (ticket) {
        ticket.status = 'Resolved'
        return { success: true }
      }
      return { success: false }
    },

    escalateDispute(event, loggingUser, subject, details) {
      const newDispute = {
        id: 'DSP-' + Math.floor(100 + Math.random() * 900),
        event,
        loggingUser,
        subject,
        details,
        status: 'Pending Review',
        date: new Date().toISOString().split('T')[0],
        resolution: ''
      }
      this.disputes.unshift(newDispute)
      
      // Trigger notification
      this.notifications.unshift({
        id: Date.now(),
        title: 'New Dispute Escalation',
        text: `A formal dispute has been logged for event "${event}" and requires Faculty Advisor review.`,
        time: 'Just now',
        type: 'warning'
      })
      return { success: true, dispute: newDispute }
    },

    resolveDispute(disputeId, resolution) {
      const dsp = this.disputes.find(d => d.id === disputeId)
      if (dsp) {
        dsp.status = 'Resolved'
        dsp.resolution = resolution
        return { success: true }
      }
      return { success: false }
    },

    // Tournament Roster approval
    approveRosterPlayer(eventId, playerEmail, status) {
      const event = this.events.find(e => e.id === eventId)
      if (event) {
        const player = event.roster.find(p => p.email === playerEmail)
        if (player) {
          player.status = status
          return { success: true }
        }
      }
      return { success: false }
    },

    // Fixtures generator
    generateFixtures(eventId) {
      const event = this.events.find(e => e.id === eventId)
      if (event) {
        const players = event.roster.filter(p => p.status === 'Approved').map(p => p.name)
        if (players.length < 2) {
          return { success: false, message: 'Need at least 2 approved players to generate fixtures.' }
        }
        
        event.fixtures = []
        if (event.format === 'Knockout') {
          // Semi-random pairs
          for (let i = 0; i < players.length; i += 2) {
            event.fixtures.push({
              round: 'Quarterfinals / Semifinals',
              match: `Match ${Math.floor(i/2) + 1}`,
              player1: players[i],
              player2: players[i+1] || 'BYE',
              winner: ''
            })
          }
        } else {
          // Round Robin: all play all
          let matchNum = 1
          for (let i = 0; i < players.length; i++) {
            for (let j = i + 1; j < players.length; j++) {
              event.fixtures.push({
                round: 'Round Robin',
                match: `Match ${matchNum++}`,
                player1: players[i],
                player2: players[j],
                winner: ''
              })
            }
          }
        }
        return { success: true }
      }
      return { success: false, message: 'Event not found.' }
    },

    setFixtureWinner(eventId, matchIdx, winnerName) {
      const event = this.events.find(e => e.id === eventId)
      if (event && event.fixtures[matchIdx]) {
        event.fixtures[matchIdx].winner = winnerName
        return { success: true }
      }
      return { success: false }
    },

    // Broadcast update
    broadcastAnnouncement(title, text, type = 'info') {
      this.notifications.unshift({
        id: Date.now(),
        title,
        text,
        time: 'Just now',
        type
      })
      return { success: true }
    },

    // Equipment Log updates
    reportEquipmentDamage(equipId, notes) {
      const item = this.equipment.find(e => e.id === equipId)
      if (item) {
        item.status = 'Damaged'
        item.notes = notes
        item.lastCheck = new Date().toISOString().split('T')[0]
        
        // Auto trigger support ticket
        this.createTicket('system@nexsport.com', 'Equipment Registry', 'Equipment Damage', `Damage Reported: ${item.name}`, `Staff reported damage: ${notes}. Needs inspection/repair.`)
        return { success: true }
      }
      return { success: false }
    },

    restockEquipment(equipId) {
      const item = this.equipment.find(e => e.id === equipId)
      if (item) {
        item.status = 'Active'
        item.notes = 'Restocked / Repaired'
        item.lastCheck = new Date().toISOString().split('T')[0]
        return { success: true }
      }
      return { success: false }
    },

    updateUserProfile(email, name, phone, dob) {
      const user = this.users.find(u => u.email.toLowerCase() === email.toLowerCase())
      if (user) {
        user.name = name
        user.phone = phone
        user.dob = dob
        if (this.currentUser && this.currentUser.email.toLowerCase() === email.toLowerCase()) {
          this.currentUser.name = name
          this.currentUser.phone = phone
          this.currentUser.dob = dob
          sessionStorage.setItem('user', JSON.stringify(this.currentUser))
        }
        return { success: true }
      }
      return { success: false, message: 'User not found.' }
    },
    
    changeUserPassword(email, oldPassword, newPassword) {
      const user = this.users.find(u => u.email.toLowerCase() === email.toLowerCase())
      if (user) {
        if (user.password !== oldPassword) {
          return { success: false, message: 'Incorrect old password.' }
        }
        user.password = newPassword
        if (this.currentUser && this.currentUser.email.toLowerCase() === email.toLowerCase()) {
          this.currentUser.password = newPassword
          sessionStorage.setItem('user', JSON.stringify(this.currentUser))
        }
        return { success: true }
      }
      return { success: false, message: 'User not found.' }
    }
  }
})
