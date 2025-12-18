📘 MindSettler Backend

API backend for MindSettler — a session-based mental wellness platform with admin approval and chatbot-assisted booking.

⸻

🛠 Tech Stack
	•	Django
	•	Django REST Framework
	•	Session-based authentication
	•	SQLite (dev)

⸻

🚀 Setup Instructions
    git clone <repo-url>
    cd mindsettler-backend
    python -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    python manage.py migrate
    python manage.py createsuperuser
    python manage.py runserver

    Server runs at:http://127.0.0.1:8000

🔐 Authentication
	•	Session-based authentication
	•	Login via API
	•	Cookies are required (credentials: "include")

    Login
    POST /api/users/login/
     {
    "username": "user",
    "password": "password"
    }
    Logout POST /api/users/logout/

    📅 Booking APIs

Create session request
POST /api/bookings/request/
{
  "requested_slot": "2025-12-20T15:30:00Z"
}
Rules
	•	Only one active request (pending or approved) allowed per user

Get my session requests GET /api/bookings/my-requests/

Response:
[
  {
    "id": 1,
    "requested_slot": "...",
    "status": "pending",
    "admin_comment": "",
    "created_at": "..."
  }
]
⸻

🤖 Chatbot API

Book via chatbot
POST /api/chatbot/intent/
{
  "intent": "book_session",
  "requested_slot": "2025-12-22T16:00:00Z"
}
Response:
	•	Success → booking created
	•	Failure → message returned

/admin/
Admin can:
	•	Approve / reject session requests
	•	Add admin comments

Frontend must not implement admin logic.


⸻

⚠️ Notes for Frontend Team
	•	Always send cookies:
    fetch(url, { credentials: "include" })
	•	Backend does not serve HTML
	•	UI is fully frontend-managed
	•	API responses are stable

⸻

🔄 Future Improvements
	•	JWT authentication
	•	Email notifications
	•	Payments
	•	Slot availability system

⸻
