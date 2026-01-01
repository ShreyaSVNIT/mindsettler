import uuid
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.exceptions import ValidationError

from apps.bookings.models import Booking
from apps.bookings.services import cancel_booking
from apps.bookings.email import send_cancellation_verification_email


class RequestCancellationView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        ack_id = request.data.get("acknowledgement_id")

        if not ack_id:
            raise ValidationError("Acknowledgement ID required")

        try:
            booking = Booking.objects.get(
                acknowledgement_id=ack_id,
                status="CONFIRMED",
            )
        except Booking.DoesNotExist:
            raise ValidationError("Booking not found or not cancellable")

        # ❌ REMOVE booking.can_cancel()
        # ✅ Service layer will enforce window later

        send_cancellation_verification_email(booking)

        return Response({
            "message": "Cancellation verification email sent"
        })

from apps.bookings.services.cancellation import cancel_by_user


class VerifyCancellationView(APIView):
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