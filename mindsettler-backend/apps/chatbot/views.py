from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from .engine import get_best_intent, INTENTS


class MindSettlerChat(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        user_text = request.data.get("message", "").strip()

        if not user_text:
            return Response({
                "reply": "I'm listening. How can I assist you?",
                "actions": [],
                "intent": "empty"
            })

        intent_key = get_best_intent(user_text)

        if intent_key != "unknown":
            data = INTENTS[intent_key]
            return Response({
                "reply": data["response"],
                "actions": (
                    [{
                        "label": "Continue",
                        "type": "redirect",
                        "url": data["link"]
                    }] if data.get("link") else []
                ),
                "intent": intent_key
            })

        # Fallback — guide user to safe navigation
        return Response({
            "reply": (
                "I'm not quite sure about that. "
                "Would you like to explore MindSettler or book your first session?"
            ),
            "actions": [
                {"label": "Book Session", "type": "redirect", "url": "/booking"},
                {"label": "About Us", "type": "redirect", "url": "/about"},
                {"label": "How It Works", "type": "redirect", "url": "/how-it-works"},
            ],
            "intent": "fallback"
        })