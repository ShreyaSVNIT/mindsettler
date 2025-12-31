from datetime import timedelta

from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.exceptions import ValidationError

from apps.users.models import AppUser
from apps.bookings.serializers.draft import BookingDraftSerializer
from apps.bookings.services import (
    get_active_booking,
    validate_payment_mode,
)
from apps.bookings.email import send_booking_verification_email


class BookingDraftCreateView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        email = request.data.get("email", "").strip().lower()
        consent = request.data.get("consent_given")

        # ─────────────────────────
        # Basic validation
        # ─────────────────────────
        if not email:
            raise ValidationError("Email is required")

        if consent is not True:
            raise ValidationError("Privacy policy consent required")

        user, _ = AppUser.objects.get_or_create(email=email)

        # ─────────────────────────
        # Active booking exists → ALWAYS verify email first
        # ─────────────────────────
        active = get_active_booking(user)
        if active:
            # Throttle verification email
            if (
                active.last_verification_email_sent_at
                and timezone.now() - active.last_verification_email_sent_at
                < timedelta(seconds=60)
            ):
                return Response(
                    {
                        "message": "Please wait before requesting another verification email."
                    },
                    status=429,
                )

            send_booking_verification_email(active)

            active.last_verification_email_sent_at = timezone.now()
            active.save(update_fields=["last_verification_email_sent_at"])

            # 🚫 Do NOT reveal status or acknowledgement ID here
            return Response(
                {
                    "message": "Verification required to continue. Email sent."
                },
                status=200,
            )

        # ─────────────────────────
        # New booking → validate payment input
        # ─────────────────────────
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

        # ─────────────────────────
        # Send verification email (throttled)
        # ─────────────────────────
        send_booking_verification_email(booking)

        booking.last_verification_email_sent_at = timezone.now()
        booking.save(update_fields=["last_verification_email_sent_at"])

        return Response(
            {
                "message": "Verification email sent. Please verify to submit booking."
            },
            status=201,
        )