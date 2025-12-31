from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.exceptions import ValidationError

from apps.bookings.models import Booking
from apps.bookings.services import get_active_booking, submit_booking


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

        # 🔒 Check for other active booking (exclude self)
        active = get_active_booking(booking.user)
        if active and active.id != booking.id:
            booking.status = "REJECTED"
            booking.rejection_reason = "Another active booking exists"
            booking.save(update_fields=["status", "rejection_reason"])

            return Response(
                {
                    "message": "Another active booking exists. This request was rejected."
                },
                status=200,
            )

        # ✅ Verify email (idempotent)
        if not booking.email_verified:
            booking.verify_email()

        # ✅ Submit booking using lifecycle service
        if booking.status == "DRAFT":
            submit_booking(booking)

        if not booking.acknowledgement_id:
            booking.generate_acknowledgement_id()
            booking.save(update_fields=["acknowledgement_id"])

        return Response(
            {
                "message": "Email verified successfully",
                "acknowledgement_id": booking.acknowledgement_id,
                "status": booking.status,
            },
            status=200,
        )