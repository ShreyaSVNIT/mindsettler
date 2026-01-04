# apps/bookings/views/cancellation.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.exceptions import ValidationError

from apps.bookings.models import Booking
from apps.bookings.services.cancellation import cancel_by_user
from apps.bookings.email import send_cancellation_verification_email


class RequestCancellationView(APIView):
    """
    Handles user-initiated cancellation requests.

    Rules:
    - APPROVED  → cancel immediately (no email)
    - CONFIRMED → email verification required
    """

    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        ack_id = request.data.get("acknowledgement_id")

        if not ack_id:
            raise ValidationError("Acknowledgement ID required")

        try:
            booking = Booking.objects.get(
                acknowledgement_id=ack_id,
                status__in=["APPROVED", "CONFIRMED"],
            )
        except Booking.DoesNotExist:
            raise ValidationError("Booking not found or not cancellable")

        # ─────────────────────────
        # APPROVED → instant cancel
        # ─────────────────────────
        if booking.status == "APPROVED":
            cancel_by_user(booking)
            return Response({
                "message": "Booking cancelled successfully",
                "status": booking.status,
            })

        # ─────────────────────────
        # CONFIRMED → email verify
        # ─────────────────────────
        send_cancellation_verification_email(booking)

        return Response({
            "message": "Cancellation verification email sent"
        })
    
# apps/bookings/views/cancellation.py (continued)

class VerifyCancellationView(APIView):
    """
    Confirms cancellation via email link.
    Applies ONLY to CONFIRMED bookings.
    """

    permission_classes = [AllowAny]
    authentication_classes = []

    def get(self, request):
        token = request.query_params.get("token")

        if not token:
            raise ValidationError("Token required")

        try:
            booking = Booking.objects.get(
                cancellation_token=token,
                status="CONFIRMED",
            )
        except Booking.DoesNotExist:
            raise ValidationError("Invalid or expired cancellation link")

        cancel_by_user(booking)

        return Response({
            "message": "Booking cancelled successfully",
            "status": booking.status,
        })