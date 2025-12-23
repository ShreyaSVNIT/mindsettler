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
                "acknowledgement_id": booking.acknowledgement_id,
                "status": booking.status,
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

        return Response({
            "message": "Email verified successfully"
        })