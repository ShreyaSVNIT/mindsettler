from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import AllowAny

from apps.users.models import AppUser
from .models import Booking
from .serializers import BookingSerializer
from .services import has_active_booking
from apps.bookings.email import send_booking_verification_email
from django.utils import timezone


class BookingCreateView(APIView):
    """
    Create a new booking (no login required)
    """
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        email = request.data.get("email", "").strip().lower()
        consent = request.data.get("consent_given")

        if not email:
            raise ValidationError("Email is required")

        if consent is not True:
            raise ValidationError(
                "You must accept the privacy policy to proceed with booking."
            )

        user, _ = AppUser.objects.get_or_create(
            email=email,
            defaults={
                "full_name": request.data.get("name", "").strip(),
                "phone": request.data.get("phone", "").strip(),
            },
        )

        if has_active_booking(user):
            raise ValidationError(
                "You already have an active booking."
            )

        serializer = BookingSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        booking = serializer.save(
            user=user,
            consent_given=True,
            consent_given_at=timezone.now(),
        )
        send_booking_verification_email(booking)
        return Response(
    {
        "message": "Verification email sent. Please verify to confirm booking."
    },
    status=status.HTTP_201_CREATED,
)



class MyBookingsView(APIView):
    """
    Fetch bookings using email (no login required)
    """
    permission_classes = [AllowAny]
    authentication_classes = []

    def get(self, request):
        email = request.query_params.get("email", "").strip().lower()

        if not email:
            raise ValidationError("Email is required")

        try:
            user = AppUser.objects.get(email=email)
        except AppUser.DoesNotExist:
            return Response([], status=status.HTTP_200_OK)

        bookings = Booking.objects.filter(user=user).order_by("-created_at")
        serializer = BookingSerializer(bookings, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class VerifyBookingEmailView(APIView):
    authentication_classes = []   # public
    permission_classes = [AllowAny]

    def get(self, request):
        token = request.query_params.get("token")

        if not token:
            raise ValidationError("Verification token is required")

        try:
            booking = Booking.objects.get(
                email_verification_token=token
            )
        except Booking.DoesNotExist:
            raise ValidationError("Invalid or expired verification link")

        if booking.email_verified:
            return Response({
                "message": "Booking already verified"
            })

        booking.verify_email()

        if not booking.acknowledgement_id:
            booking.generate_acknowledgement_id()

        return Response({
         "message": "Email verified successfully",
        "acknowledgement_id": booking.acknowledgement_id
        })    

from django.utils import timezone
from datetime import timedelta

class ResendVerificationEmailView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        email = request.data.get("email", "").strip().lower()

        if not email:
            raise ValidationError("Email is required")

        try:
            booking = Booking.objects.get(
                user__email=email,
                email_verified=False
            )
        except Booking.DoesNotExist:
            raise ValidationError(
                "No unverified booking found for this email"
            )

        if booking.last_verification_email_sent_at:
            diff = timezone.now() - booking.last_verification_email_sent_at
            if diff < timedelta(seconds=60):
                remaining = 60 - int(diff.total_seconds())
                raise ValidationError(
                    f"Please wait {remaining} seconds before resending verification email."
                )

        send_booking_verification_email(booking)

        return Response(
            {
                "message": "Verification email resent successfully"
            },
            status=status.HTTP_200_OK
        )
class BookingTrackView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def get(self, request):
        ack_id = request.query_params.get("acknowledgement_id", "").strip()

        if not ack_id:
            raise ValidationError("Acknowledgement ID is required")

        try:
            booking = Booking.objects.get(
                acknowledgement_id=ack_id,
                email_verified=True,
            )
        except Booking.DoesNotExist:
            raise ValidationError(
                "Invalid acknowledgement ID or booking not verified"
            )

        return Response(
            {
                "acknowledgement_id": booking.acknowledgement_id,
                "status": booking.status,
                "session_type": booking.session_type,
                "preferred_date": booking.preferred_date,
                "preferred_time": booking.preferred_time,
                "created_at": booking.created_at,
            },
            status=status.HTTP_200_OK,
        )
class GetAcknowledgementIdView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        email = request.data.get("email", "").strip().lower()

        if not email:
            raise ValidationError("Email is required")

        try:
            booking = Booking.objects.get(
                user__email=email,
                email_verified=True,
                status="PENDING",
                acknowledgement_id__isnull=False,
            )
        except Booking.DoesNotExist:
            raise ValidationError(
                "No pending verified booking found for this email"
            )

        return Response(
            {
                "acknowledgement_id": booking.acknowledgement_id,
                "status": booking.status,
            },
            status=status.HTTP_200_OK,
        )