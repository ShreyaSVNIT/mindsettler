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
        "link": "/services"
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
        "link": "/services"
    },
    "pricing_info": {
        "examples": [
            "fees", "price", "cost", "how much does it cost", "is it expensive",
            "therapy rates", "consultation charges", "do you have discounts",
            "pricing for students", "how much per hour", "billing", "how to pay",
            "is the first session free", "subscription plans", "cost of online session",
            "hidden charges", "payment methods", "GPay or PhonePe"
        ],
        "responses": ["We believe in transparent pricing. Online sessions start at ₹999, while offline rates vary by location. We also offer student discounts and bulk session packages."],
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
        "link": "/services#relationships"
    },
    "grief_loss": {
        "examples": [
            "I lost someone", "dealing with death", "grief counseling", 
            "I can't get over my loss", "mourning"
        ],
        "responses": ["I am so sorry for your loss. Grief has no timeline, and you don't have to carry it alone. Our counselors provide a safe space to process your feelings."],
        "link": "/services#grief"
    },
    "sleep_issues": {
        "examples": [
            "can't sleep", "insomnia", "sleeping too much", "nightmares",
            "tired all the time", "no energy", "brain fog", "restless sleep",
            "waking up at night", "exhausted", "fatigue"
        ],
        "responses": ["Sleep and mental health are deeply linked. Issues with sleep are often a sign of underlying stress or mood concerns. We can help you identify the root cause and improve your sleep hygiene."],
        "link": "/services#sleep"
    },

    # ─── LOGISTICS & SERVICES ───
    "therapist_credentials": {
        "examples": [
            "are you doctors", "who are the experts", "are they qualified",
            "M.Phil or PhD", "years of experience", "licensed psychologists",
            "is the therapist experienced", "who will I talk to", "expert team"
        ],
        "responses": ["Your well-being is in safe hands. All MindSettler therapists are licensed psychologists (RCI registered where applicable) with a minimum of a Master's degree and extensive clinical experience."],
        "link": "/team"
    },
    "online_vs_offline": {
        "examples": [
            "is it online", "do you have a clinic", "can I meet in person", 
            "video call sessions", "where are you located", "physical office"
        ],
        "responses": ["We offer both: comfortable offline sessions at our center and convenient online video consultations from the privacy of your home."],
        "link": "/locations"
    },
    "insurance_payment": {
        "examples": [
            "do you take insurance", "payment methods", "can I pay with UPI", 
            "covered by health insurance", "reimbursement"
        ],
        "responses": ["We accept UPI, cards, and net banking. Regarding insurance, we provide invoices that you can submit for reimbursement if your policy covers mental health."],
        "link": "/billing-faq"
    },
    "corporate_wellness": {
        "examples": [
            "help for employees", "corporate packages", "wellness for companies", 
            "office mental health", "workplace stress"
        ],
        "responses": ["We partner with organizations to provide employee assistance programs (EAP) and mental wellness workshops."],
        "link": "/corporate"
    },
    "reschedule_cancel": {
        "examples": [
            "cancel session", "reschedule", "refund", "change my time",
            "can't make it", "moving my appointment", "money back",
            "I missed my session", "cancel booking", "postpone",
            "policy for cancellation", "can I get my money back"
        ],
        "responses": ["We understand that life happens! You can reschedule or cancel your session through your dashboard. Cancellations made 24 hours in advance are eligible for a full refund."],
        "link": "/contact"
    },

    # ─── USER EXPERIENCE & SMALL TALK ───
    "bot_identity": {
        "examples": [
            "who are you", "what do you do", "are you a human", 
            "are you a robot", "talk to a real person"
        ],
        "responses": ["I'm the MindSettler Assistant! I can help you find information about therapy and book sessions. If you'd like to speak to a human coordinator, just ask!"],
        "link": "/contact"
    },
    "gratitude": {
        "examples": [
            "thanks", "thank you", "that helped", "cool", "okay thanks"
        ],
        "responses": ["You're very welcome! I'm glad I could help. Is there anything else you need?"],
        "link": None
    },
    "how_it_works": {
        "examples": [
            "how does this work", "what is the process", "what to expect", 
            "how do I start", "new to therapy"
        ],
        "responses": ["Starting is simple: 1. Choose a service, 2. Book a slot, 3. Complete your first assessment. We guide you through every step."],
        "link": "/how-it-works"
    },
    
    # ─── SAFETY (CRITICAL) ───
    "crisis": {
        "examples": [
            "suicide", "I want to die", "harm myself", "emergency", 
            "abuse", "can't go on", "end it all", "kill myself",
            "I'm in danger", "domestic violence", "overdose",
            "immediate help needed", "I have a plan to hurt myself",
            "I don't want to live anymore", "suicidal thoughts", "help me now"
        ],
        "responses": ["I am very concerned about what you're sharing. Please reach out to a professional immediately. You can call AASRA (9820466726) or the Vandrevala Foundation (9999666555) 24/7. You are important, and help is available."],
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