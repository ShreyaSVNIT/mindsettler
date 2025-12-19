Backend – Session Booking & Consultation System

Overview

This backend powers a session booking and consultation platform with email verification, booking constraints, and a scalable architecture designed to later support chatbot-driven bookings and a frontend-first development workflow.

The system is built with Django + Django REST Framework (DRF) and follows a clean, modular structure so multiple team members can work independently.

⸻

What Is Implemented So Far ✅

1. Core Architecture
	•	Django project initialized with REST-first design
	•	Django REST Framework configured
	•	Modular app-based structure (users, consultants, bookings – logical separation)
	•	Centralized settings for scalability

⸻

2. Authentication & Security
	•	Email-based login flow (planned-first, partially implemented)
	•	Token-based authentication
	•	CORS configured for frontend integration
	•	CSRF not used (API-first architecture)

Rationale: Since the frontend will consume APIs directly, CSRF protection is intentionally skipped and token-based auth is preferred.

⸻

3. User Model (In Progress)
	•	Custom user model planned
	•	Email will be the primary identifier
	•	No mandatory registration initially

Design Decision:
Users can:
	•	Book a session using email verification only
	•	Later register with the same email for dashboard features

⸻

4. Booking Logic (Design Finalized, Implementation Pending)

The booking system will enforce:
	•	One active/pending request per user
	•	Email verification before booking
	•	Visibility of available dates during booking
	•	Status tracking via acknowledgement ID

Planned booking states:
	•	PENDING
	•	CONFIRMED
	•	REJECTED
	•	COMPLETED

⸻

5. API Philosophy
	•	Frontend-first development approach
	•	APIs designed to be directly consumed by UI (minimal Postman usage)
	•	Clear separation of concerns between:
	•	Validation
	•	Business logic
	•	Response formatting

⸻

What Is NOT Implemented Yet ❌

1. Complete Booking Workflow
	•	Slot availability logic
	•	Conflict handling
	•	Booking confirmation flow
	•	Admin approval actions

⸻

2. Consultant Module
	•	Consultant model
	•	Availability calendar
	•	Multiple consultants per slot (future scalability)

⸻

3. Chatbot Integration
	•	Chatbot logic is not part of backend yet
	•	Chatbot will later:
	•	Guide users
	•	Trigger booking APIs
	•	Check booking status

Current Instruction for Chatbot Developer:

Focus on general conversation and website navigation for now. Booking APIs will be plugged in later.

⸻

4. User Dashboard (Optional / Phase 2)
	•	Session history
	•	Follow-up sessions
	•	Profile-based features

⸻

Tech Stack
	•	Backend: Django, Django REST Framework
	•	Database: SQLite (development), PostgreSQL (planned)
	•	Auth: Token-based
	•	API Style: REST

⸻

CORS & Security Summary
	•	CORS: Enabled for frontend
	•	CSRF: Not used (API-only backend)
	•	Authentication: Token-based
	•	Email verification: Mandatory before booking

⸻

Development Roadmap 🛣️
	1.	Finalize User, Consultant, and Booking models
	2.	Implement booking constraints & availability logic
	3.	Status-check APIs (using acknowledgement ID)
	4.	Admin controls for approvals
	5.	Chatbot → Backend integration
	6.	Optional user dashboard

⸻

Notes for Team Members
	•	Backend APIs are being designed assuming a dynamic frontend
	•	Avoid hardcoding flows in the chatbot
	•	Expect changes in booking logic as frontend UX evolves

⸻

Status

🟡 Backend foundation ready
🔴 Core booking features pending
🟢 Architecture finalized

⸻
