# NexSport - Sports Club Management & Member Engagement Platform

NexSport is a modular, role-based web platform designed to replace the fragmented, WhatsApp-driven operational models of sports clubs. This repository houses the frontend application built with **Vue 3**, **Vite**, and **Tailwind CSS**. It connects Club Members, Coaches, Admins/Secretaries, and Faculty Advisors into a unified, state-driven ecosystem.

---

## Workspace Layout

```text
Project Root
├── Design of Components.pdf      # System architectural component definitions
├── NexSport_Milestone1.pdf       # User research, pain points, epics, and user stories
├── ER Diagram.png                # Database ER Diagram
├── UI/                           # Static HTML screen designs provided for reference
├── WireFrame/                    # SVG/Excalidraw wireframes
└── nexsport-frontend/            # Live interactive Vue 3 Single Page Application (SPA)
    ├── src/
    │   ├── stores/clubStore.js   # Pinia state database (mock backend APIs)
    │   ├── router/index.js       # Vue Router routes and access control guards
    │   ├── layouts/PortalLayout.vue # Unified dashboard wrapper
    │   ├── components/SvgChart.vue  # Reusable responsive SVG line/bar chart
    │   └── views/                # Role-specific portal views
    ├── tailwind.config.js        # Design System tokens configuration
    └── index.html                # Entry point
```

---

## Core Components Implemented

The application implements the 9 operational components detailed in the components specification:
1. **Authentication & Access:** JWT-simulated session storage and IISER Bhopal domain checks (`*@iiserb.ac.in`).
2. **Member Onboarding:** A 5-step wizard (Details, Plan, Safety, Waiver, Tour) that must be signed to unlock bookings.
3. **Facility Booking:** Conflict-safe court reservation logs preventing double-bookings.
4. **Membership & Fees:** Billing cycle tracking, Pro/Standard tier selectors, payment receipts, and QR code access passes.
5. **Attendance Registry:** Roster dashboards for coaches to mark attendance and record check-in logs.
6. **Communication Layer:** In-app announcements, cancellations alerts, and broadcast composing tools.
7. **Event Management:** Roster nominating forms, selection audits, and automatic bracket fixture generators.
8. **Support & Grievances:** smart FAQ chatbot assistant, query tickets logger, and dispute logs escalations.
9. **Reporting & Analytics:** Footfall SVG charts, gym equipment damage reporters, and CSV data exporters.

---

## Running the Application Locally

Navigate to the `nexsport-frontend` directory to install dependencies and run the local developer server:

```powershell
# Navigate into the frontend app
cd nexsport-frontend

# Install node dependencies
npm install

# Run the local developer server
npm run dev
```

The application will default to running on `http://localhost:5173`. Open your browser and head to that address.

---

## Evaluation Credentials & Quick Login

A **Quick Evaluation Login** panel is embedded at the bottom of the sign-in page to allow evaluators to switch roles with a single click. Alternatively, you can use these mock credentials:

| Portal Role | Email | Password | Role Description |
| :--- | :--- | :--- | :--- |
    | **Club Member** | `alex@iiserb.ac.in` | `password123` | Can book courts, register for tournaments, pay renewal dues, and raise support tickets. |
    | **Volunteer Coach** | `deepanshi@iiserb.ac.in` | `password123` | Can schedule drills classes, view rosters, and mark attendance sheet checks. |
    | **Secretary (Admin)** | `krishna@iiserb.ac.in` | `password123` | Can approve member signups, override court states, manage tickets, and broadcast messages. |
    | **Faculty Advisor** | `verma@iiserb.ac.in` | `password123` | Audits ISM rosters, reviews player eligibility, and resolves escalated disputes. |

*Note: There is also a live **Developer API / Swagger Mock** portal accessible via the header icon or at `/dev-api` documenting all endpoints, parameters, and responses for subsequent Flask backend blueprint setups.*
