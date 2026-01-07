from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .engine import get_best_intent, INTENTS

class MindSettlerChat(APIView):
    def post(self, request):
        user_text = request.data.get("message", "").strip()
        
        if not user_text:
            return Response({"reply": "I'm listening. How can I assist you?"}, status=200)

        intent_key = get_best_intent(user_text)
        
        if intent_key != "unknown":
            data = INTENTS[intent_key]
            return Response({
                "reply": data["response"],
                "link": data.get("link"),
                "intent": intent_key
            })
            
        # Fallback Mechanism: Guide user to main goals [cite: 10, 11, 12]
        return Response({
            "reply": "I'm not quite sure about that. Would you like to learn more about us or book your first session?",
            "options": [
                {"label": "Book Session", "link": "/booking"},
                {"label": "About Us", "link": "/about"},
                {"label": "How it Works", "link": "/how-it-works"}
            ],
            "intent": "fallback"
        })