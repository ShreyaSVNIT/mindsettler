from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.exceptions import ValidationError
from django.utils import timezone
from datetime import timedelta

from apps.users.models import AppUser
from apps.bookings.models import Booking
from apps.bookings.serializers import BookingDraftSerializer
from apps.bookings.services import get_active_booking, validate_payment_mode
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

        # Existing active booking
        active = get_active_booking(user)
        if active:
            if not active.email_verified:
                send_booking_verification_email(active)
                return Response(
                    {"message": "Verification required. Email sent."},
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

        serializer = BookingDraftSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        booking = serializer.save(
            user=user,
            status="DRAFT",
            consent_given=True,
            consent_given_at=timezone.now(),
        )

        # Throttle email resend
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