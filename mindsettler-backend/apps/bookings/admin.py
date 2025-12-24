from django.contrib import admin, messages
from django.core.exceptions import ValidationError

from .models import Booking
from apps.bookings.services import approve_booking


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):

    # ───────── LIST VIEW ─────────
    list_display = (
        "acknowledgement_id",
        "user",
        "status",
        "preferred_period",
        "mode",
        "created_at",
    )

    list_filter = ("status", "mode", "preferred_period")
    search_fields = ("user__email", "acknowledgement_id")

    # ───────── READ ONLY ─────────
    readonly_fields = (
        "user",
        "status",
        "acknowledgement_id",
        "email_verified",
        "created_at",
        "updated_at",
    )
    # ───────── FORM ─────────
    fieldsets = (
        ("User", {
            "fields": ("user", "email_verified", "email_verified_at")
        }),
        ("User Preferences", {
            "fields": (
                "preferred_date",
                "preferred_period",
                "preferred_time_start",
                "preferred_time_end",
                "mode",
                "payment_mode",
                "user_message",
            )
        }),
        ("Admin Decision", {
            "fields": (
                "admin_decision",       
                "approved_slot_start",
                "approved_slot_end",
                "psychologist",
                "corporate",
                "rejection_reason",
                "alternate_slots",
            )
        }),    
    ("System", {
            "fields": (
                "status",
                "acknowledgement_id",
                "created_at",
                "updated_at",
            )
        }),
    )

    # ───────── ACTIONS ─────────
    actions = ("approve_selected",)

    @admin.action(description="Approve selected bookings")
    def approve_selected(self, request, queryset):
        approved = 0

        for booking in queryset:
            if booking.status != "PENDING":
                messages.warning(
                    request,
                    f"{booking.acknowledgement_id}: Not pending, skipped."
                )
                continue

            if not booking.approved_slot_start or not booking.approved_slot_end:
                messages.error(
                    request,
                    f"{booking.acknowledgement_id}: Approved slot missing."
                )
                continue

            try:
                approve_booking(
                    booking,
                    approved_start=booking.approved_slot_start,
                    approved_end=booking.approved_slot_end,
                    psychologist=booking.psychologist,
                    corporate=booking.corporate,
                )
                approved += 1

            except Exception as e:
                messages.error(
                    request,
                    f"{booking.acknowledgement_id}: {str(e)}"
                )

        if approved:
            self.message_user(
                request,
                f"{approved} booking(s) approved successfully.",
                level=messages.SUCCESS,
            )

    # ───────── SAFETY ─────────
def save_model(self, request, obj, form, change):
    if change:
        old = Booking.objects.get(pk=obj.pk)

        if old.status in {"COMPLETED", "CANCELLED"}:
            raise ValidationError("Finalized booking cannot be modified")

        if obj.admin_decision != old.admin_decision:
            apply_admin_decision(obj)

    super().save_model(request, obj, form, change)