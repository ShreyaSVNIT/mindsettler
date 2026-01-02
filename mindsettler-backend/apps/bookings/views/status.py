from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.exceptions import ValidationError
from django.utils import timezone
from datetime import timedelta

from apps.users.models import AppUser
from apps.bookings.services import get_active_booking
from apps.bookings.email import send_booking_verification_email


class BookingStatusCheckView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        email = request.data.get("email", "").strip().lower()

        if not email:
            raise ValidationError("Email is required")

        user, _ = AppUser.objects.get_or_create(email=email)
        booking = get_active_booking(user)

        if not booking:
            return Response(
                {
                    "has_booking": False,
                    "message": "No active booking found."
                },
                status=200,
            )

        # Throttle email
        if (
            booking.last_verification_email_sent_at
            and timezone.now() - booking.last_verification_email_sent_at
            < timedelta(seconds=60)
        ):
            return Response(
                {
                    "message": "Please wait before requesting another verification email."
                },
                status=429,
            )

        send_booking_verification_email(booking)

        booking.last_verification_email_sent_at = timezone.now()
        booking.save(update_fields=["last_verification_email_sent_at"])

        return Response(
            {
                "message": "Verification email sent. Verify to view your booking details."
            },
            status=200,
        )