from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.exceptions import ValidationError

from apps.bookings.models import Booking
from apps.bookings.serializers.public import BookingPublicSerializer


class BookingStatusCheckView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def get(self, request):
        acknowledgement_id = request.query_params.get("acknowledgement_id")

        if not acknowledgement_id:
            raise ValidationError("Acknowledgement ID is required")

        try:
            booking = Booking.objects.get(
                acknowledgement_id=acknowledgement_id
            )
        except Booking.DoesNotExist:
            raise ValidationError("Booking not found")

        # Build timeline
        timeline = []
        if booking.created_at:
            timeline.append("DRAFT")
        if booking.submitted_at:
            timeline.append("PENDING")
        if booking.approved_at:
            timeline.append("APPROVED")
        if booking.payment_requested_at:
            timeline.append("PAYMENT_PENDING")
        if booking.confirmed_at:
            timeline.append("CONFIRMED")
        if booking.cancelled_at:
            timeline.append("CANCELLED")
        if booking.rejected_at:
            timeline.append("REJECTED")

        serializer = BookingPublicSerializer(booking)
        data = serializer.data
        data["timeline"] = timeline
        data["amount"] = str(booking.amount) if booking.amount else None

        return Response(data)
