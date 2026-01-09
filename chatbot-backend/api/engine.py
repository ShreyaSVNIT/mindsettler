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
    "greeting": {
        "examples": ["Hi", "Hello", "Hey", "Good morning", "Anyone there?"],
        "responses": [
            "Hello! I'm your MindSettler guide. I'm here to help you understand our services and begin your well-being journey."
        ],
        "link": None,
    },

    "first_session": {
        "examples": ["what happens in first session", "initial assessment", "first meeting"],
        "responses": [
            "Your first session includes an assessment, goal setting, and understanding your concerns to create a personalized plan."
        ],
        "link": "/about",
    },

    "session_duration": {
        "examples": ["how long is a session", "duration", "session length"],
        "responses": [
            "Each session lasts approximately 60 minutes."
        ],
        "link": None,
    },

    "pricing_info": {
        "examples": ["fees", "price", "cost", "how much does it cost"],
        "responses": [
            "Session pricing varies by mode. Online sessions start at ₹999, while offline sessions vary. Please visit booking for details."
        ],
        "link": "/booking",
    },

    "reschedule_cancel": {
        "examples": ["cancel session", "reschedule", "refund"],
        "responses": [
            "You may cancel or reschedule up to 24 hours before the session without penalty."
        ],
        "link": "/contact",
    },

    "confidentiality": {
        "examples": ["confidential", "privacy", "is it safe"],
        "responses": [
            "All sessions are strictly confidential and your data is protected."
        ],
        "link": "/privacy",
    },

    "booking": {
        "examples": ["book a session", "schedule appointment"],
        "responses": [
            "You can book a session by visiting our booking page."
        ],
        "link": "/booking",
    },

    "crisis": {
        "examples": ["suicidal", "panic attack", "emergency"],
        "responses": [
            "I'm really sorry you're feeling this way. Please reach out to a mental health professional or emergency services immediately."
        ],
        "link": "/emergency-resources",
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