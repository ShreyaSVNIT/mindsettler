from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError

from apps.bookings.serializers import SessionRequestSerializer
from apps.bookings.services import has_active_request


class ChatbotIntentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        intent = request.data.get("intent")
        requested_slot = request.data.get("requested_slot")

        if intent != "book_session":
            raise ValidationError("Unsupported intent")

        if not requested_slot:
            raise ValidationError("requested_slot is required")

        if has_active_request(request.user):
            return Response({
                "message": "You already have an active session request."
            }, status=400)

        serializer = SessionRequestSerializer(data={
            "requested_slot": requested_slot
        })
        serializer.is_valid(raise_exception=True)
        serializer.save(user=request.user)

        return Response({
            "message": "Session booked successfully via chatbot",
            "data": serializer.data
        }, status=201)