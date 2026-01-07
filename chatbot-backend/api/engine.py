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
                print("🔹 Precomputing intent embeddings...")

                _intent_embeddings = {
                    intent: model.encode(
                        data["examples"],
                        convert_to_tensor=True,
                    )
                    for intent, data in INTENTS.items()
                }

                print("✅ Intent embeddings ready")

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
    highest_score = 0.20  # Safety threshold

    for intent, embeddings in intent_embeddings.items():
        cos_scores = util.cos_sim(query_embedding, embeddings)[0]
        max_score = torch.max(cos_scores).item()

        if max_score > highest_score:
            highest_score = max_score
            best_intent = intent

    return best_intent