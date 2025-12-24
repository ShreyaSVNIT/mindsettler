from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.exceptions import ValidationError
from django.utils import timezone
import uuid

from apps.users.models import AppUser
from .models import Booking
from .serializers import BookingSerializer
from .services import (
    get_active_booking,
    validate_payment_mode,
    confirm_booking,
    cancel_booking,
    approve_booking,
    reject_booking,
    has_active_booking,
    
    
    
)
from apps.bookings.email import send_booking_verification_email
from datetime import timedelta


from datetime import timedelta
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.exceptions import ValidationError

from apps.users.models import AppUser
from .models import Booking
from .serializers import BookingSerializer
from .services import get_active_booking, validate_payment_mode
from apps.bookings.email import send_booking_verification_email


class BookingDraftCreateView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        email = request.data.get("email", "").strip().lower()
        consent = request.data.get("consent_given")

        if not email:
            raise ValidationError("Email is required")

        if consent is not True:
            raise ValidationError("Privacy policy consent required")

        user, _ = AppUser.objects.get_or_create(email=email)

        # ─────────────────────────
        # Existing active booking
        # ─────────────────────────
        active = get_active_booking(user)
        if active:
            if not active.email_verified:
                send_booking_verification_email(active)
                return Response(
                    {
                        "message": "Verification required to access your booking. Email sent."
                    },
                    status=200,
                )

            return Response(
                {
                    "message": "Active booking found",
                    "status": active.status,
                    "acknowledgement_id": active.acknowledgement_id,
                },
                status=200,
            )

        # ─────────────────────────
        # Validate request
        # ─────────────────────────
        validate_payment_mode(
            request.data.get("mode"),
            request.data.get("payment_mode"),
        )

        if not request.data.get("preferred_date"):
            raise ValidationError("Preferred date is required")

        serializer = BookingSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        booking = serializer.save(
            user=user,
            status="DRAFT",
            consent_given=True,
            consent_given_at=timezone.now(),
        )

        # ─────────────────────────
        # Email resend throttle (60s)
        # ─────────────────────────
        if (
            booking.last_verification_email_sent_at and
            timezone.now() - booking.last_verification_email_sent_at < timedelta(seconds=60)
        ):
            return Response(
                {"message": "Please wait before requesting another verification email."},
                status=429,
            )

        send_booking_verification_email(booking)

        booking.last_verification_email_sent_at = timezone.now()
        booking.save(update_fields=["last_verification_email_sent_at"])

        return Response(
            {"message": "Verification email sent. Please verify to submit booking."},
            status=201,
        )


class VerifyEmailView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def get(self, request):
        token = request.query_params.get("token")

        if not token:
            raise ValidationError("Verification token is required")

        try:
            booking = Booking.objects.select_related("user").get(
                email_verification_token=token
            )
        except Booking.DoesNotExist:
            raise ValidationError("Invalid or expired verification link")

        # ─────────────────────────
        # Prevent multiple active bookings
        # ─────────────────────────
        active = has_active_booking(booking.user)
        if active and active.id != booking.id:
            booking.status = "REJECTED"
            booking.rejection_reason = "Another active booking exists"
            booking.save(update_fields=["status", "rejection_reason"])

            return Response({
                "message": "Another active booking exists. This request was rejected."
            })

        # ─────────────────────────
        # Verify email (idempotent)
        # ─────────────────────────
        if not booking.email_verified:
            booking.verify_email()

        # ─────────────────────────
        # Submit booking
        # ─────────────────────────
        if booking.status == "DRAFT":
            booking.status = "PENDING"

        if not booking.acknowledgement_id:
            booking.generate_acknowledgement_id()

        booking.save(update_fields=["status", "acknowledgement_id"])

        return Response({
            "message": "Email verified successfully",
            "acknowledgement_id": booking.acknowledgement_id,
            "status": booking.status,
        })

class AdminApproveBookingView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request, booking_id):
        booking = Booking.objects.get(id=booking_id)

        approve_booking(
            booking,
            approved_start=request.data["start"],
            approved_end=request.data["end"],
            psychologist=request.data.get("psychologist"),
            corporate=request.data.get("corporate"),
        )

        return Response({"message": "Booking approved. Awaiting user confirmation."})    
class AdminRejectBookingView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request, booking_id):
        booking = Booking.objects.get(id=booking_id)

        reject_booking(
            booking,
            reason=request.data.get("reason"),
            alternate_slots=request.data.get("alternate_slots", ""),
        )

        return Response({"message": "Booking rejected and user notified"})    
class ConfirmBookingView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        token = request.data.get("token")

        if not token:
            raise ValidationError("Confirmation token required")

        try:
            booking = Booking.objects.get(confirmation_token=token)
        except Booking.DoesNotExist:
            raise ValidationError("Invalid or expired token")

        if not booking.email_verified:
            raise ValidationError("Email verification required")

        confirm_booking(booking)

        return Response({
            "message": "Booking confirmed",
            "acknowledgement_id": booking.acknowledgement_id,
        })        

class CancelBookingView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        token = request.data.get("token")

        if not token:
            raise ValidationError("Verification token is required")

        try:
            booking = Booking.objects.get(
                email_verification_token=token
            )
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
            raise ValidationError(
                "Cancellations are only allowed 24 hours before the session"
            )

        booking.cancellation_token = uuid.uuid4()
        booking.cancellation_requested_at = timezone.now()
        booking.save(
            update_fields=["cancellation_token", "cancellation_requested_at"]
        )

        send_cancellation_verification_email(booking)

        return Response({
            "message": "Cancellation verification email sent"
        })    

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
            raise ValidationError("Invalid or expired cancellation link")

        if not booking.can_cancel():
            raise ValidationError("Cancellation window has expired")

        cancel_booking(booking)

        booking.cancellation_token = None
        booking.save(update_fields=["cancellation_token"])

        return Response({
            "message": "Booking cancelled successfully",
            "status": booking.status,
        })