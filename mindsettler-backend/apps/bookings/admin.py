from django.contrib import admin
from .models import Booking


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = (
        "acknowledgement_id",
        "user",
        "session_type",
        "preferred_date",
        "preferred_time",
        "status",
        "created_at",
    )
    list_filter = ("status", "session_type")
    search_fields = ("acknowledgement_id", "user__email")