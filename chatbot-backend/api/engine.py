from sentence_transformers import SentenceTransformer, util
import torch
import threading

# ─────────────────────────
# THREAD-SAFE SINGLETONS
# ─────────────────────────
_model = None
_intent_embeddings = None
_lock = threading.Lock()

MODEL_NAME = "all-MiniLM-L6-v2"


# ─────────────────────────
# MODEL LOADER (singleton)
# ─────────────────────────
def get_model():
    """
    Loads SentenceTransformer only once per process.
    Safe for Gunicorn --preload and threaded workers.
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
# INTENT EMBEDDINGS CACHE
# ─────────────────────────
def get_intent_embeddings():
    """
    Precomputes and caches intent embeddings once.
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
# MINDSETTLER INTENTS
# ─────────────────────────
INTENTS = {
    "greeting": {
        "examples": [
            "Hi", "Hello", "Hey", "Good morning", "Anyone there?"
        ],
        "response": (
            "Hello! I'm your MindSettler guide. "
            "I'm here to help you understand our services and start your journey "
            "towards well-being."
        ),
        "link": None,
    },
    # FAQ 1: First Session Expectations
    "first_session": {
        "examples": ["what happens in first session", "initial assessment", "what to expect", "first meeting", "goal setting", "how do we start"],
        "responses": ["Your first session includes an initial assessment, goal setting, and building rapport with your psychologist. We'll discuss your concerns and create a personalized plan for your mental wellness journey."],
        "link": "/about",
    },
    # FAQ 2: Duration
    "session_duration": {
        "examples": ["how long is a session", "duration", "how many minutes", "session length", "time limit"],
        "responses": ["Each session lasts approximately 60 minutes, providing ample time for meaningful discussion and structured guidance."],
        "link": None,
    },
    # FAQ 3: Pricing
    "pricing_info": {
        "examples": ["how much does it cost", "price", "fees", "session rate", "online vs offline cost", "cost of therapy"],
        "responses": ["Session pricing varies based on the type and location. Online sessions start at $50, while offline sessions range from $75–$100. Feel free to contact us for detailed pricing."],
        "link": "/booking",
    },
    # FAQ 4: Cancellation/Rescheduling
    "reschedule_cancel": {
        "examples": ["cancel my session", "reschedule", "change appointment time", "refund policy", "missed session"],
        "responses": ["Yes, you can cancel or reschedule up to 24 hours before your session without penalty. Please contact us as soon as possible if you need to make changes."],
        "link": "/contact",
    },
    # FAQ 5: Confidentiality
    "confidentiality_safety": {
        "examples": ["is it private", "confidentiality", "data safety", "is my info safe", "anonymous", "privacy policy"],
        "responses": ["Absolutely. All sessions are conducted under strict confidentiality agreements. Your personal information and session details are protected and never shared without your explicit consent."],
        "link": "/privacy",
    },  
    # FAQ 6: Online vs Offline
    "session_modes": {
        "examples": ["online or offline", "video call", "in person", "face to face", "do you have a clinic", "visit the studio"],
        "responses": ["Yes, we provide both online video sessions for convenience and in-person sessions at our designated locations for those who prefer face-to-face interaction."],
        "link": "/booking",
    },
    # FAQ 7: Qualifications
    "expert_qualifications": {
        "examples": ["who are the psychologists", "qualifications", "are they licensed", "experience", "expert credentials", "degrees"],
        "responses": ["Our psychologists are licensed professionals with extensive experience in mental health support and psycho-education. They undergo regular training and follow strict ethical guidelines."],
        "link": "/about",
    },
    "booking": {
        "examples": [
            "I want to book a session",
            "How to schedule?",
            "offline session",
            "first consultation",
            "book now",
        ],
        "response": (
            "You can begin with an introductory 60-minute session. "
            "We offer both online and offline sessions at our Studio."
        ),
        "link": "/booking",
    },
    "counseling_caution": {
        "examples": [
            "I feel depressed",
            "I have anxiety",
            "Can you give me advice?",
            "help me with my mental health",
        ],
        "response": (
            "I hear you. While I cannot provide clinical advice, "
            "I can help you schedule a confidential session with our experts."
        ),
        "link": "/booking",
    },
    "services": {
        "examples": [
            "What is MindSettler?",
            "what do you do?",
            "psycho-education awareness",
            "how can you help?",
        ],
        "response": (
            "MindSettler is a platform for psycho-education and mental well-being, "
            "focusing on awareness and personalized support."
        ),
        "link": "/about",
    },
    "payment": {
        "examples": [
            "payment mode",
            "how to pay?",
            "UPI",
            "cash payment",
            "pricing",
        ],
        "response": (
            "Payments are handled manually via UPI ID or cash. "
            "We will confirm your appointment once the payment is verified."
        ),
        "link": "/contact",
    },
    "crisis": {
        "examples": ["I want to die", "panic attack", "emergency", "suicidal", "hurt myself", "help me now"],
        "responses": ["I hear you, and I want you to know you're not alone. While I am an AI and cannot provide emergency clinical help, please reach out to a professional immediately. Your safety is the most important thing right now."],
        "link": "/emergency-resources",
    }
}


# ─────────────────────────
# INTENT MATCHING
# ─────────────────────────
def get_best_intent(user_query: str) -> str:
    """
    Returns best matching intent using cosine similarity.
    """
    model = get_model()
    intent_embeddings = get_intent_embeddings()

    query_embedding = model.encode(
        user_query,
        convert_to_tensor=True,
    )

    best_intent = "unknown"
    highest_score = 0.40  # Safety threshold

    for intent, embeddings in intent_embeddings.items():
        cos_scores = util.cos_sim(query_embedding, embeddings)[0]
        max_score = torch.max(cos_scores).item()

        if max_score > highest_score:
            highest_score = max_score
            best_intent = intent

    return best_intent