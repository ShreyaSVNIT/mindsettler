from django.contrib import admin
from .models import Booking


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = (
        "acknowledgement_id",
        "user",
        "status",
        "email_verified",
        "created_at",
    )

    list_filter = ("status", "email_verified")
    search_fields = ("acknowledgement_id", "user__email")

    readonly_fields = (
        "email_verified",
        "email_verified_at",
        "acknowledgement_id",
        "consent_given",
        "consent_given_at",
    )

    def get_queryset(self, request):
        qs = super().get_queryset(request)

        # Superuser sees everything (audit + debugging)
        if request.user.is_superuser:
            return qs

        # Staff see only valid bookings
        return qs.filter(
            email_verified=True,
            acknowledgement_id__isnull=False,
        )
