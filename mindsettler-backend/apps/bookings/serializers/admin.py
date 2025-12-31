# apps/bookings/serializers/admin.py
from .base import BookingBaseSerializer


class BookingAdminSerializer(BookingBaseSerializer):
    class Meta(BookingBaseSerializer.Meta):
        read_only_fields = (
            "user",
            "acknowledgement_id",
            "email_verified",
            "email_verified_at",
            "consent_given",
            "consent_given_at",
            "created_at",
            "updated_at",
        )