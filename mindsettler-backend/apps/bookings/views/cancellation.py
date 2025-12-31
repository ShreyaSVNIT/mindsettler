import uuid
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.exceptions import ValidationError

from apps.bookings.models import Booking
from apps.bookings.services import cancel_booking
from apps.bookings.email import send_cancellation_verification_email


class CancelBookingView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        token = request.data.get("token")

        if not token:
            raise ValidationError("Verification token is required")

        try:
            booking = Booking.objects.get(email_verification_token=token)
        except Booking.DoesNotExist:
            raise ValidationError("Invalid or expired token")

        if not booking.email_verified:
            raise ValidationError("Email verification required")

        cancel_booking(booking)

        return Response({
            "message": "Booking cancelled successfully",
            "status": booking.status,
        })


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
                status="CONFIRMED"
            )
        except Booking.DoesNotExist:
            raise ValidationError("Booking not found or not cancellable")

        if not booking.can_cancel():
            raise ValidationError("Cancellation window expired")

        booking.cancellation_token = uuid.uuid4()
        booking.cancellation_requested_at = timezone.now()
        booking.save(update_fields=["cancellation_token", "cancellation_requested_at"])

        send_cancellation_verification_email(booking)

        return Response({"message": "Cancellation verification email sent"})


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
                status="CONFIRMED"
            )
        except Booking.DoesNotExist:
            raise ValidationError("Invalid or expired link")

        if not booking.can_cancel():
            raise ValidationError("Cancellation window expired")

        cancel_booking(booking)

        booking.cancellation_token = None
        booking.save(update_fields=["cancellation_token"])

        return Response({
            "message": "Booking cancelled successfully",
            "status": booking.status,
        })