from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.exceptions import ValidationError
from django.utils import timezone

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

        # If user already has an active booking, return it
        active = get_active_booking(user)
        if active:
            needs_verification = (
                not active.last_access_verified_at or
                timezone.now() - active.last_access_verified_at > timedelta(minutes=10)
            )

            if needs_verification:
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
       
        validate_payment_mode(
            request.data.get("mode"),
            request.data.get("payment_mode"),
        )
        preferred_date = request.data.get("preferred_date")

        if not preferred_date:
            raise ValidationError("Preferred date is required")

        serializer = BookingSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        booking = serializer.save(
            user=user,
            status="DRAFT",
            consent_given=True,
            consent_given_at=timezone.now(),
        )

        # 🔒 Email resend throttling (60s)
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
from django.utils import timezone

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

        #  Prevent multiple active bookings (except self)
        active = has_active_booking(booking.user, exclude=booking)
        if active:
            booking.status = "REJECTED"
            booking.rejection_reason = "Another active booking exists"
            booking.save(update_fields=["status", "rejection_reason"])

            return Response({
                "message": "Another active booking exists. This request was rejected."
            })

        # Mark email ownership verified (once)
        if not booking.email_verified:
            booking.verify_email()

        # Mark THIS access as verified
        booking.last_access_verified_at = timezone.now()

        # Submit booking if draft
        if booking.status == "DRAFT":
            booking.status = "PENDING"

        if not booking.acknowledgement_id:
            booking.generate_acknowledgement_id()

        booking.save(
            update_fields=[
                "email_verified",
                "email_verified_at",
                "last_access_verified_at",
                "status",
                "acknowledgement_id",
            ]
        )

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
        )

        # send approval mail here

        return Response({"message": "Booking approved"})
    
class AdminRejectBookingView(APIView):
    permission_classes = [IsAdminUser]
    def post(self, request, booking_id):
        booking = Booking.objects.get(id=booking_id)

        reject_booking(
            booking,
            reason=request.data["reason"],
            alternate_slots=request.data.get("alternates", ""),
        )

        # send rejection mail here

        return Response({"message": "Booking rejected"})
    
class ConfirmBookingView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        token = request.data.get("token")

        booking = Booking.objects.get(email_verification_token=token)

        confirm_booking(booking)

        return Response({
            "acknowledgement_id": booking.acknowledgement_id
        })
    
class CancelBookingView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        token = request.data.get("token")

        booking = Booking.objects.get(email_verification_token=token)

        cancel_booking(booking)

        return Response({"message": "Booking cancelled"})