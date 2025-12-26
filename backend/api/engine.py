from sentence_transformers import SentenceTransformer, util
import torch

# Load model once on startup for high performance
model = SentenceTransformer('all-MiniLM-L6-v2')

# MindSettler Knowledge Base & Intent Clusters
INTENTS = {
    "greeting": {
        "examples": ["Hi", "Hello", "Hey", "Good morning", "Anyone there?"],
        "response": "Hello! I'm your MindSettler guide. I'm here to help you understand our services and start your journey towards well-being.",
        "link": None
    },
    "booking": {
        "examples": ["I want to book a session", "How to schedule?", "offline session", "first consultation", "book now"],
        "response": "You can begin with an introductory 60-minute session. We offer both online and offline sessions at our Studio.",
        "link": "/booking" # Goal: Booking/Consultation [cite: 12]
    },
    "counseling_caution": {
        "examples": ["I feel depressed", "I have anxiety", "Can you give me advice?", "help me with my mental health"],
        "response": "I hear you. While I cannot provide clinical advice or suggestions, I can help you schedule a confidential session with our experts.",
        "link": "/booking" # Goal: No advice, redirect to professional [cite: 61, 62]
    },
    "services": {
        "examples": ["What is MindSettler?", "what do you do?", "psycho-education awareness", "how can you help?"],
        "response": "MindSettler is a platform for psycho-education and mental well-being, focusing on awareness and personalized support.",
        "link": "/about" # Goal: Awareness [cite: 9, 16]
    },
    "payment": {
        "examples": ["payment mode", "how to pay?", "UPI", "cash payment", "pricing"],
        "response": "Payments are handled manually via UPI ID or cash. We will confirm your appointment once the payment is verified.",
        "link": "/contact" # Goal: Manual confirmation [cite: 34]
    }
}

# Pre-calculate embeddings for speed
intent_keys = list(INTENTS.keys())
intent_embeddings = {k: model.encode(INTENTS[k]["examples"], convert_to_tensor=True) for k in intent_keys}

def get_best_intent(user_query):
    query_embedding = model.encode(user_query, convert_to_tensor=True)
    best_intent = "unknown"
    highest_score = 0.20  # Threshold to prevent "hallucinating" matches
    
    for intent, embeddings in intent_embeddings.items():
        cos_scores = util.cos_sim(query_embedding, embeddings)[0]
        max_score = torch.max(cos_scores).item()
        
        if max_score > highest_score:
            highest_score = max_score
            best_intent = intent
            
    return best_intent