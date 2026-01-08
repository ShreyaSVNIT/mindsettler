# MindSettler

> Your journey to mental wellness, one conversation at a time.

## 🌟 What is MindSettler?

MindSettler is a mental wellness platform that makes it easy to book confidential counseling sessions with qualified psychologists. Whether you're dealing with stress, anxiety, relationship issues, or just need someone to talk to, we're here to help—both online and offline.

Think of us as your mental health companion: we provide a safe space to explore your thoughts, understand yourself better, and work through life's challenges with professional support.

---

## 🎯 What We Offer

- **One-on-One Counseling**: Book personal sessions with licensed psychologists
- **Flexible Options**: Choose between online video sessions or in-person meetings
- **AI Chat Support**: Get immediate responses and guidance through our chatbot
- **Corporate Wellness**: Mental health programs designed for organizations
- **Educational Resources**: Learn about mental health through our curated content
- **Complete Privacy**: Your conversations and bookings are completely confidential

---

## 🚀 Technology Stack

**Frontend**: Next.js 16, React 18, TypeScript, Tailwind CSS  
**Backend**: Django 6.0, Django REST Framework  
**AI/Chatbot**: PyTorch, Transformers, NLP models  
**Database**: PostgreSQL (production), SQLite (development)  
**Authentication**: Firebase Auth, JWT tokens  
**Hosting**: Vercel (frontend), Firebase (functions)

---

## 🌐 Website Structure & User Journey

### The Homepage Experience

When users land on MindSettler, they're greeted with a calming, animated interface designed to immediately put them at ease.

**What Users See First:**
1. **Hero Section** - A welcoming introduction with smooth animations that explain what MindSettler is about
2. **Mental Health Basics** - Easy-to-understand information about mental wellness and why it matters
3. **Mission Statement** - Our commitment to making mental health support accessible and judgment-free
4. **Journey Roadmap** - A visual guide showing how the process works from first visit to ongoing support
5. **Music Player** - Relaxing background music to create a peaceful browsing experience
6. **Chat Widget** - Instant access to our AI chatbot for immediate support

### All Our Pages

#### 🏠 **Home (`/`)**
The main landing page where visitors learn about MindSettler. Features beautiful animations, flowing text, and an overall calming design. This is where first impressions are made, and we guide users toward understanding how we can help them.

#### ℹ️ **About (`/about`)**
Tells the story of MindSettler—why we exist, what we believe in, and how we're different from traditional therapy services. This page builds trust and helps users understand our philosophy.

#### 📖 **How It Works (`/how-it-works`)**
A detailed explanation of the entire process:
- How to get started
- What to expect in your first session
- How booking works
- What happens during sessions
- Frequently asked questions

This page removes uncertainty and makes the process transparent for new users.

#### 📅 **Book a Session (`/book`)**
The booking flow where users can:
1. Choose between online or offline sessions
2. Select their preferred psychologist
3. Pick a date and time that works for them
4. Complete their booking

The interface is clean and simple—no overwhelming forms, just the essential information we need.

#### 💬 **ChatBot Page (`/ChatBot`)**
A dedicated space for our AI-powered chatbot. Users can:
- Ask questions about mental health
- Get immediate support 24/7
- Understand if they need professional help
- Learn about different therapy approaches
- Get guidance on booking their first session

The chatbot is smart enough to detect when someone needs urgent help and directs them to appropriate resources.

#### 🔐 **Authentication Pages**

**Login (`/login`)**: Returning users can sign in to access their dashboard, view booking history, and manage appointments.

**Sign Up (`/signup`)**: New users create their account with just their email. We keep it simple—no lengthy forms on day one. We verify emails to ensure security while keeping the process smooth.

**Email Verification (`/verify-email`)**: After signing up, users confirm their email address. This helps us maintain security and ensures users can receive booking confirmations.

#### 💳 **Payment (`/payment`)**
Secure payment processing for session bookings. Users can:
- See pricing details
- Choose payment methods
- Receive instant confirmation
- Get receipts via email

#### ✅ **Verification Pages**

**Verify Booking (`/verify-booking`)**: After booking a session, users are taken here to confirm everything is set up correctly. They see their appointment details and receive confirmation via email.

**Verify Cancellation (`/verify-cancellation`)**: If users need to cancel, this page confirms the cancellation and explains any policies around rescheduling or refunds.

#### ✨ **Status Page (`/status`)**
Shows users the current status of their bookings:
- Upcoming sessions
- Past sessions
- Pending confirmations
- Any messages from psychologists

#### 📚 **Resources (`/resources`)**
Educational content about mental health:
- Articles about common issues (anxiety, depression, stress)
- Self-help techniques
- Understanding when to seek help
- Mental health tips and coping strategies

This isn't just a booking platform—we're also here to educate and empower.

#### 🏢 **Corporate (`/corporate`)**
Information for businesses interested in providing MindSettler services to their employees:
- Corporate wellness packages
- Benefits for organizations
- How to set up company-wide access
- Pricing for teams

#### 📄 **Legal & Policy Pages**

**Privacy Policy (`/privacy-policy`)**: How we handle and protect user data. We believe in complete transparency about privacy.

**Confidentiality Policy (`/confidentiality-policy`)**: Explains that all sessions and conversations are completely private. This builds trust with users who may be hesitant about seeking help.

**Non-Refund Policy (`/non-refund-policy`)**: Clear explanation of our cancellation and refund policies to set proper expectations.

---

## 🛤️ The Complete User Journey

### First-Time Visitor
1. **Lands on homepage** → Sees calming design and learns what MindSettler offers
2. **Explores "How It Works"** → Understands the process and feels reassured
3. **Checks Resources** → Reads about mental health topics relevant to them
4. **Tries the Chatbot** → Gets immediate support and personalized guidance
5. **Decides to Book** → Feels confident enough to schedule a session

### Booking Flow
1. **Clicks "Book a Session"** → Starts the booking process
2. **Creates Account** → Quick signup with email
3. **Verifies Email** → Confirms their email address
4. **Selects Session Type** → Chooses online or offline
5. **Picks Psychologist** → Views profiles and selects who they're comfortable with
6. **Chooses Date/Time** → Sees available slots and picks what works
7. **Makes Payment** → Securely pays for the session
8. **Gets Confirmation** → Receives booking details via email

### Returning User
1. **Logs In** → Quick access to their dashboard
2. **Views Status** → Sees upcoming and past sessions
3. **Books Follow-Up** → Easily schedules another session with the same or different psychologist
4. **Accesses Resources** → Continues learning between sessions
5. **Uses Chatbot** → Gets support between scheduled sessions

### Corporate User
1. **Company Signs Up** → Organization registers for corporate program
2. **Employees Get Access** → Staff receive invitation codes
3. **Employees Book Sessions** → Team members book confidential sessions
4. **Company Gets Analytics** → Admin dashboard shows anonymized usage (not personal details)

---

## 🛠️ Getting Started (For Developers)

### Prerequisites
- Node.js 20+ and npm
- Python 3.10+
- PostgreSQL (for production)
- Firebase account
- SendGrid account (for emails)

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Visit `http://localhost:3000`

### Backend Setup
```bash
cd mindsettler-backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```
API runs at `http://localhost:8000`

### Chatbot Setup
```bash
cd chatbot-backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py runserver 8001
```
Chatbot API at `http://localhost:8001`

---

## 📝 License

Proprietary and confidential.

---

## 👤 Credits

**MindSettler by Parnika**   
Built for **GWoC (Google Winter of Code)**

---

**Built with care for mental wellness** 
