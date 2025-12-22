from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import ValidationError

from apps.users.models import AppUser
from .models import Booking
from .serializers import BookingSerializer
from .services import has_active_booking


class BookingCreateView(APIView):
    """
    Create a new booking (no login required)
    """

    def post(self, request):
        email = request.data.get("email", "").strip().lower()
        consent = request.data.get("consent")

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