from sentence_transformers import SentenceTransformer, util
import torch
import threading
import os
import threading
import datetime
import torch
import numpy as np
from sentence_transformers import SentenceTransformer, util

# ─────────────────────────
# THREAD-SAFE SINGLETONS
# ─────────────────────────
_model = None
_intent_embeddings = None
_lock = threading.Lock()

MODEL_NAME = "all-MiniLM-L6-v2"

# ─────────────────────────
# MODEL LOADER (Singleton)
# ─────────────────────────
def get_model():
    """
    Loads SentenceTransformer only once per process.
    Thread-safe for Gunicorn workers.
    """
    global _model

    if _model is None:
        with _lock:
            if _model is None:
                print("🔹 Loading SentenceTransformer model...")
                _model = SentenceTransformer(MODEL_NAME)
                print("✅ Model loaded")

    return _model


# ─────────────────────────
# INTENT DEFINITIONS
# ─────────────────────────
INTENTS = {
    # ─── CLINICAL & EMOTIONAL SUPPORT ───
    "depression_support": {
        "examples": [
            "I feel depressed", "I'm so sad", "I can't get out of bed", 
            "life feels hopeless", "I've lost interest in everything", "feeling empty",
            "I cry for no reason", "nothing makes me happy anymore", "low mood",
            "I feel worthless", "don't want to exist", "everything is gray",
            "I'm struggling with depression", "clinical depression symptoms",
            "I feel heavy and tired all the time", "no energy to do anything",
            "is this depression?", "unhappy for months", "can't stop crying",
            "I feel like a failure", "isolated and alone", "lost my spark"
        ],
        "responses": ["It sounds like things are incredibly heavy right now. Please know that what you're feeling is valid, and you don't have to carry it alone. Our therapists specialize in mood disorders and provide a safe space to process these feelings."],
        "link": "/book"
    },
    "anxiety_stress": {
        "examples": [
            "I am so stressed", "constant worrying", "I have panic attacks", 
            "my heart is racing", "I feel overwhelmed", "I can't stop overthinking",
            "chest tightness", "I feel restless", "social anxiety", "nervous all the time",
            "I'm scared for no reason", "fear of the future", "work stress is killing me",
            "exam stress", "I feel like I'm losing control", "anxiety help",
            "shaking and sweating", "fear of crowds", "performance anxiety",
            "I feel like something bad will happen", "constant dread", "can't relax"
        ],
        "responses": ["Anxiety can make your mind and body feel like they're in a constant state of alarm. We use evidence-based approaches like CBT and grounding techniques to help you find your calm again."],
        "link": "/book"
    },
    "session_cost": {
        "examples": [
            "how much does a session cost", "what is the price", "session fees",
            "how much do I have to pay", "cost of therapy", "online session price",
            "offline session charges", "is there a fee for the first meeting",
            "how expensive is therapy", "tell me the rates", "billing amount",
            "price list for sessions", "how much per hour", "consultation cost"
        ],
        "responses": ["Session pricing varies based on the type and location. Online sessions start at Rs. 1000, while offline sessions range from Rs. 2000 - Rs. 5000. For detailed pricing or information on specialized sessions, please feel free to contact us."],
        "link": "/book"
    },
    "booking": {
        "examples": [
            "book a session", "schedule appointment", "how to meet a doctor",
            "I want to talk to someone", "need a slot", "is anyone available today",
            "make a reservation", "can I book online", "set up a meeting",
            "I need therapy", "start my journey", "register for a session",
            "appointment availability", "can I see a therapist tomorrow"
        ],
        "responses": ["Ready to take the first step? You can view all available time slots and book your preferred therapist directly through our portal."],
        "link": "/book"
    },
    "relationship_issues": {
        "examples": [
            "problems with my partner", "going through a breakup", "marriage issues", 
            "fighting with parents", "loneliness", "I feel unloved", "divorce",
            "toxic relationship", "cheating partner", "heartbreak", "trust issues",
            "I can't get over my ex", "family conflict", "friendship problems",
            "my parents don't understand", "marriage counseling", "couple therapy"
        ],
        "responses": ["Relationships are central to our happiness but can also be deeply painful. Whether you're navigating a breakup or family tension, our counselors can help you build healthier boundaries and communication."],
        "link": "/book"
    },
    "grief_loss": {
        "examples": [
            "I lost someone", "dealing with death", "grief counseling", 
            "I can't get over my loss", "mourning", "my dad passed away",
            "my mom died", "losing a pet", "I lost my best friend",
            "bereavement support", "how to cope with death", "grief is overwhelming",
            "missing someone who passed away", "still grieving after years",
            "can't move on from the loss", "death of a sibling", "loss of a spouse",
            "heartbroken over a death", "feeling numb after a funeral",
            "sudden loss of a family member", "miscarriage support",
            "how to deal with the pain of loss", "everything reminds me of them",
            "I feel empty since they left", "it's been months and I still cry",
            "is it normal to feel this way after a death", "loss of a loved one",
            "dealing with a terminal illness in the family", "coping with a tragedy"
        ],
        "responses": ["I am so sorry for your loss. Grief has no timeline, and you don't have to carry it alone. Our counselors provide a safe space to process your feelings and help you navigate this difficult journey at your own pace."],
        "link": "/book"
    },
    "sleep_issues": {
        "examples": [
            "can't sleep", "insomnia", "sleeping too much", "nightmares",
            "tired all the time", "no energy", "brain fog", "restless sleep",
            "waking up at night", "exhausted", "fatigue", "tossing and turning",
            "can't fall asleep", "staying awake all night", "waking up too early",
            "sleep deprivation", "poor sleep quality", "constant yawning",
            "daytime sleepiness", "groggy in the morning", "sleep schedule is ruined",
            "racing thoughts at night", "overactive mind before bed",
            "trouble staying asleep", "unrefreshing sleep", "frequent awakenings",
            "vivid dreams", "disturbed sleep", "feeling drained",
            "no motivation to wake up", "slept through my alarm",
            "sleeping 12 hours and still tired", "night terrors", 
            "anxiety keeping me awake", "can't shut my brain off at night"
        ],
        "responses": ["Sleep and mental health are deeply linked. Issues with sleep—whether it's sleeping too little or too much—are often signs of underlying stress, anxiety, or mood concerns. We can help you identify the root cause and improve your sleep hygiene through evidence-based practices."],
        "link": "/book"
    },

    # ─── LOGISTICS & SERVICES ───
    "therapist_credentials": {
        "examples": [
            "are you doctors", "who are the experts", "are they qualified",
            "M.Phil or PhD", "years of experience", "licensed psychologists",
            "is the therapist experienced", "who will I talk to", "expert team",
            "what are their qualifications", "are the counselors certified",
            "RCI registered psychologists", "clinical psychology background",
            "do they have a license to practice", "how do you vet your therapists",
            "are they trained professionals", "can I see their profiles",
            "Master's in Psychology", "MSc or MA psychologists",
            "how many years of practice", "are they senior therapists",
            "specialized training", "are they background checked",
            "who is the best therapist here", "verification of degrees",
            "are they trauma-informed", "certified practitioners"
        ],
        "responses": ["Your well-being is in safe hands. All MindSettler therapists are licensed professionals (RCI registered where applicable) with a minimum of a Master's degree in Clinical or Counselling Psychology and extensive clinical experience. We follow a rigorous vetting process to ensure you receive the highest quality of care."],
        "link": "/about"
    },
    "online_vs_offline": {
        "examples": [
            "is it online", "do you have a clinic", "can I meet in person", 
            "video call sessions", "where are you located", "physical office",
            "address of the center", "face to face therapy", "teletherapy",
            "virtual sessions", "can I book a home visit", "offline center address",
            "do you do therapy on WhatsApp", "Zoom or Google Meet sessions",
            "is online therapy effective", "can I switch from online to offline",
            "which city are you in", "clinic near me", "in-person appointment",
            "remote counseling", "do I have to come to the office",
            "can I talk to a therapist from home", "hospital location",
            "where is MindSettler located", "directions to the clinic"
        ],
        "responses": ["We offer the flexibility of both worlds: comfortable offline sessions at our dedicated centers for face-to-face support, and convenient online video consultations via secure platforms from the privacy of your home. You can choose the mode that makes you feel most at ease."],
        "link": "/how-it-works"
    },
    "session_duration": {
        "examples": [
            "what is the duration of a typical session", "how long is a session",
            "how many minutes do I get", "session length", "time per session",
            "is it an hour long", "how long will the talk last",
            "appointment duration", "how much time is one session",
            "standard session time", "does it last 45 or 60 minutes",
            "time limit for a meeting"
        ],
        "responses": ["Each session lasts approximately 60 minutes, providing ample time for meaningful discussion and structured guidance. This duration ensures we can dive deep into your concerns without feeling rushed."],
        "link": "/how-it-works"
    },
    
    "insurance_payment": {
        "examples": [
            "do you take insurance", "payment methods", "can I pay with UPI", 
            "covered by health insurance", "reimbursement", "GPay", "PhonePe",
            "Paytm", "Google Pay", "Apple Pay", "credit card payment",
            "debit card", "net banking", "do you accept cash", 
            "payment link", "how do I pay for my session", "transaction failed",
            "is mental health covered by my policy", "corporate insurance",
            "can I get a GST invoice", "receipt for office reimbursement",
            "Star Health insurance", "HDFC Ergo mental health", "insurance claim",
            "do you provide a medical certificate for reimbursement",
            "billing questions", "pre-payment or post-payment", 
            "cashless insurance facility", "money transfer"
        ],
        "responses": ["We support a variety of secure payment methods including UPI (GPay, PhonePe, Paytm), all major credit/debit cards, and net banking. While we don't offer cashless insurance at the moment, we provide detailed medical invoices that you can submit to your insurance provider or employer for reimbursement."],
        "link": "/how-it-works"
    },
    "first_session_expectations": {
        "examples": [
            "what should I expect during my first session", "first session info",
            "what happens in the first meeting", "I'm nervous about my first appointment",
            "what do I talk about first", "how does the first therapy session start",
            "intake session details", "do I have to share everything immediately",
            "what will the psychologist ask me first", "first time in therapy",
            "how long is the first session", "pre-session requirements",
            "what is an initial assessment", "goal setting in therapy"
        ],
        "responses": ["Your first session is a safe, non-judgmental space that includes an initial assessment, goal setting, and building rapport with your psychologist. We'll discuss your concerns, history, and what you hope to achieve, eventually creating a personalized plan for your mental wellness journey."],
        "link": "/how-it-works"
    },
    "confidentiality_privacy": {
        "examples": [
            "is my information kept confidential", "is therapy private",
            "will you tell anyone what I say", "are my sessions recorded",
            "who can see my data", "privacy policy for sessions",
            "is my secret safe", "confidentiality agreement",
            "do you share my info with my parents", "is this anonymous",
            "protection of personal information", "data security",
            "will my boss find out I'm in therapy"
        ],
        "responses": ["Absolutely. All sessions are conducted under strict confidentiality agreements. Your personal information and session details are protected and never shared without your explicit consent, adhering to international ethical standards for psychological practice."],
        "link": "/privacy-policy"
    },
"corporate_wellness": {
        "examples": [
            "help for employees", "corporate packages", "wellness for companies", 
            "office mental health", "workplace stress", "Employee Assistance Program",
            "EAP services", "mental health benefits for staff", "corporate tie-up",
            "wellness workshops for teams", "burnout prevention for employees",
            "how to support my team's mental health", "company wellness plan",
            "HR mental health solutions", "group therapy for offices",
            "executive coaching and wellness", "improving workplace morale",
            "stress management seminars", "occupational stress support",
            "mental health training for managers", "institutional mental health support",
            "b2b mental health services", "wellbeing sessions for startups"
        ],
        "responses": ["We partner with organizations to provide tailored Employee Assistance Programs (EAP), mental wellness workshops, and leadership training. Our goal is to foster a healthier, more productive workplace by supporting the emotional well-being of every team member."],
        "link": "/corporate"
    },
    "reschedule_cancel": {
        "examples": [
            "cancel session", "reschedule", "refund", "change my time",
            "can't make it", "moving my appointment", "money back",
            "I missed my session", "cancel booking", "postpone",
            "policy for cancellation", "can I get my money back",
            "something came up", "I have an emergency", "can we meet later",
            "I want to change the date", "rescheduling policy",
            "I accidentally booked the wrong time", "cancel my appointment",
            "refund status", "how to get a refund", "missed appointment fee",
            "technical issues can I reschedule", "I'm running late",
            "can I move my session to tomorrow", "need to push back my slot",
            "cancel because of work", "no-show policy", "edit my booking"
        ],
        "responses": ["We understand that life happens! You can reschedule or cancel your session through the 'Check Status' page. To ensure our therapists can manage their schedules effectively, cancellations or rescheduling requests made at least 24 hours in advance are eligible for a full refund or credit."],
        "link": "/check-status"
    },
    # ─── USER EXPERIENCE & SMALL TALK ───
    "bot_identity": {
        "examples": [
            "who are you", "what do you do", "are you a human", 
            "are you a robot", "talk to a real person", "what is your name",
            "are you an AI", "chat with a human", "speak to a representative",
            "is this an automated response", "what can you help me with",
            "how does this bot work", "are you a therapist", "who am I talking to",
            "can you give me medical advice", "customer support", "live agent",
            "I want to talk to a real person", "are you MindSettler",
            "who created you", "assistant name", "human assistance please",
            "can you prescribe medicine", "what are your features"
        ],
        "responses": ["I'm the MindSettler Assistant! I can help you find information about therapy, explain our services, and guide you through booking a session. While I'm an AI designed to help you quickly, I am not a therapist and cannot give clinical advice. If you'd like to speak to a human coordinator, just ask!"],
        "link": "/contact"
    },
    "hesitation_support": {
        "examples": [
            "I am hesitant to book a session", "I'm nervous about starting therapy",
            "I don't know if therapy is for me", "I'm scared to talk to a stranger",
            "is therapy worth it", "what if I have nothing to say",
            "I'm feeling unsure about booking", "do I really need help",
            "I've been thinking about therapy but I'm afraid",
            "should I wait before booking", "I'm not sure if my problems are big enough",
            "what if therapy doesn't work for me", "I feel awkward talking about myself",
            "I'm worried I'll be judged", "is it weird to see a psychologist",
            "I've had a bad experience with therapy before", "why is it so hard to start",
            "I keep putting off booking a session", "I'm afraid of what I might find out",
            "does talking actually help", "is my problem too small for therapy",
            "I don't want to cry in front of someone", "can I trust a therapist",
            "I feel like I should be able to handle this alone", "stigma of therapy"
        ],
        "responses": ["It’s completely normal to feel hesitant or nervous about starting therapy—it’s a big step toward self-care. Many of our clients felt the same way before their first session. Think of it as a low-pressure conversation where you’re in control; you only share what you're comfortable with, at your own pace. You don't need a 'big' problem to deserve support."],
        "link": "/how-it-works"
    },
    "gratitude": {
        "examples": [
            "thanks", "thank you", "that helped", "cool", "okay thanks",
            "appreciate it", "you're the best", "thanks a lot", "super helpful",
            "thanks for the info", "got it, thanks", "thx", "ty", "cheers",
            "awesome, thanks", "really grateful", "this was exactly what I needed",
            "much appreciated", "thanks MindSettler", "perfect, thank you",
            "this cleared things up", "thanks for the help", "helpful, thanks",
            "you've been very kind", "thanks for being there", "many thanks",
            "great, thanks", "thanks for the support", "thanks for the guidance"
        ],
        "responses": ["You're very welcome! I'm glad I could help. Is there anything else you need, or any other part of your journey I can assist with?"],
        "link": None
    },
    "how_it_works": {
        "examples": [
            "how does this work", "what is the process", "what to expect", 
            "how do I start", "new to therapy", "walk me through the steps",
            "how to register", "getting started guide", "how do I use MindSettler",
            "process for booking a session", "what happens after registration",
            "is there an onboarding process", "how to choose a therapist",
            "how do I meet my doctor", "what is the workflow", "step by step instructions",
            "how to navigate the website", "first time user help", "where do I begin",
            "how do I get a therapist", "is there a setup process"
        ],
        "responses": ["Starting your wellness journey is simple and structured: 1. **Choose a service** that fits your needs. 2. **Book a slot** with your preferred psychologist. We provide guidance and support through every step of the way."],
        "link": "/how-it-works"
    },
    "about_mindsettler": {
        "examples": [
            "what is mindsettler", "tell me about mindsettler", "what is this website",
            "what does mindsettler do", "about this platform", "who are you guys",
            "what is the purpose of mindsettler", "is this a mental health clinic",
            "tell me more about the organization", "mindsettler mission",
            "who founded mindsettler", "is mindsettler legit", "is this a startup",
            "what makes mindsettler different", "why should I choose mindsettler",
            "tell me your story", "what is your vision", "what do you stand for",
            "are you an online clinic", "mindsettler company profile",
            "is this a safe place for therapy", "how does mindsettler help people",
            "tell me about the services offered", "what is the goal of this site"
        ],
        "responses": ["MindSettler is a comprehensive mental health platform dedicated to making professional therapy and emotional support accessible to everyone. We provide a bridge between licensed psychologists and individuals seeking help for issues like anxiety, depression, and relationship concerns through both online and offline consultations."],
        "link": "/about"
    },
    "greetings": {
        "examples": [
            "hi", "hello", "hey", "good morning", "good evening", 
            "is anyone there", "hi there", "hello assistant", "hey MindSettler",
            "good afternoon", "namaste", "hiiii", "hey there", "hola",
            "anyone online", "can someone help me", "howdy", "morning",
            "yo", "greetings", "hi mindsettler", "hello there",
            "is this active", "wake up", "start chat", "help me out",
            "how are you", "what's up", "how is it going", "hiya",
            "quick question", "hello team", "hi support"
        ],
        "responses": ["Hello! I'm here to support you. Whether you're looking for guidance, want to book a session, or just need someone to listen, I'm ready to help. How are you feeling today?"],
        "link": None
    },
    
    # ─── SAFETY (CRITICAL) ───
    "crisis": {
        "examples": [
            "suicide", "I want to die", "harm myself", "emergency", 
            "abuse", "can't go on", "end it all", "kill myself",
            "I'm in danger", "domestic violence", "overdose",
            "immediate help needed", "I have a plan to hurt myself",
            "I don't want to live anymore", "suicidal thoughts", "help me now",
            "goodbye everyone", "nobody would miss me", "I'm going to jump",
            "taking all my pills", "I have a weapon", "my partner is hitting me",
            "sexual assault", "I was raped", "feeling unsafe at home",
            "I want to fall asleep and never wake up", "life isn't worth living",
            "I'm at my breaking point", "urgent mental health crisis",
            "I'm cutting myself", "self harm", "stop the pain forever",
            "I need a suicide hotline", "emergency psychiatric help",
            "I'm scared of what I might do to myself", "panic attack I can't breathe"
        ],
        "responses": ["I am very concerned about what you're sharing. Please reach out for professional help immediately. You are not alone, and there are people who want to support you through this right now. If you are in immediate danger, please contact your local emergency services or a crisis hotline."],
        "link": "/emergency-resources"
    },
}


# ─────────────────────────
# INTENT EMBEDDINGS CACHE
# ─────────────────────────
def get_intent_embeddings():
    """
    Computes and caches embeddings for all intent examples.
    """
    global _intent_embeddings

    if _intent_embeddings is None:
        with _lock:
            if _intent_embeddings is None:
                model = get_model()
                _intent_embeddings = {
                    intent: model.encode(
                        data["examples"],
                        convert_to_tensor=True,
                    )
                    for intent, data in INTENTS.items()
                }

    return _intent_embeddings


# ─────────────────────────
# INTENT MATCHING LOGIC
# ─────────────────────────
def get_best_intent(user_query: str) -> str:
    """
    Returns best intent based on cosine similarity.
    """
    model = get_model()
    intent_embeddings = get_intent_embeddings()

    query_embedding = model.encode(
        user_query,
        convert_to_tensor=True,
    )

    best_intent = "unknown"
    highest_score = 0.35  # tuned threshold

    for intent, embeddings in intent_embeddings.items():
        cos_scores = util.cos_sim(query_embedding, embeddings)[0]
        score = torch.max(cos_scores).item()

        if score > highest_score:
            highest_score = score
            best_intent = intent

    return best_intent


# ─────────────────────────
# RESPONSE FETCHER (SAFE)
# ─────────────────────────
def get_response(intent: str):
    """
    Returns a safe chatbot response.
    """
    if intent not in INTENTS:
        return {
            "reply": "I'm not sure I understood that. Could you please rephrase?",
            "link": None,
        }

    data = INTENTS[intent]

    return {
        "reply": data["responses"][0],
        "link": data["link"],
    }