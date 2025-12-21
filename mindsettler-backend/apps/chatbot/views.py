from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import ValidationError

from apps.users.models import AppUser
from apps.bookings.models import Booking
from apps.bookings.serializers import BookingSerializer
from apps.bookings.services import has_active_booking


class ChatbotIntentView(APIView):
    """
    Handle chatbot intents like booking a session
    """

    def post(self, request):
        intent = request.data.get("intent")

        if intent != "book_session":
            raise ValidationError("Unsupported intent")

        email = request.data.get("email")
        name = request.data.get("name", "")
        phone = request.data.get("phone", "")

        if not email:
            raise ValidationError("Email is required for booking")

        # create or fetch user
        user, _ = AppUser.objects.get_or_create(
            email=email,
            defaults={
                "full_name": name,
                "phone": phone,
            }
        )

        # prevent multiple active bookings
        if has_active_booking(user):
            return Response(
                {"message": "You already have an active booking."},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = BookingSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        booking = serializer.save(user=user)

        return Response(
            {
                "message": "Session booked successfully via chatbot",
                "acknowledgement_id": booking.acknowledgement_id,
                "status": booking.status,
            },
            status=status.HTTP_201_CREATED
        )