from django.contrib import admin, messages
from django.core.exceptions import ValidationError

from .models import Booking
from apps.bookings.services import approve_booking, reject_booking


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):

    # ─────────────────────────
    # QUERYSET (CRITICAL FIX)
    # ─────────────────────────
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        # Hide unverified drafts from admin
        return qs.exclude(status="DRAFT")

    # ─────────────────────────
    # LIST VIEW
    # ─────────────────────────
    list_display = (
        "acknowledgement_id",
        "user",
        "status",
        "preferred_date",
        "preferred_period",
        "mode",
        "created_at",
    )

    list_filter = (
        "status",
        "mode",
        "preferred_period",
    )

    search_fields = (
        "user__email",
        "acknowledgement_id",
    )

    ordering = ("-created_at",)

    actions = ["approve_bookings", "reject_bookings"]

    # ─────────────────────────
    # READ-ONLY FIELDS
    # ─────────────────────────
    readonly_fields = (
        "user",
        "status",
        "acknowledgement_id",
        "email_verified",
        "email_verified_at",
        "consent_given",
        "consent_given_at",
        "created_at",
        "updated_at",
    )

    # ─────────────────────────
    # FORM LAYOUT
    # ─────────────────────────
    fieldsets = (
        ("User", {
            "fields": (
                "user",
                "email_verified",
                "email_verified_at",
            )
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
                "approved_slot_start",
                "approved_slot_end",
                "amount",
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

    # ─────────────────────────
    # SAVE VALIDATION & WARNINGS
    # ─────────────────────────
    def save_model(self, request, obj, form, change):

        # Block edits to finalized bookings
        if change:
            old = Booking.objects.get(pk=obj.pk)
            if old.status in {"COMPLETED", "CANCELLED"}:
                self.message_user(
                    request,
                    "This booking is finalized and cannot be modified.",
                    level=messages.ERROR,
                )
                return

        # Approved slot validation
        if obj.approved_slot_start and obj.approved_slot_end:
            if obj.approved_slot_end <= obj.approved_slot_start:
                self.message_user(
                    request,
                    "Approved end time must be after start time.",
                    level=messages.ERROR,
                )
                return

            overlapping = Booking.objects.filter(
                status__in=["APPROVED", "CONFIRMED"],
                psychologist=obj.psychologist,
                approved_slot_start__lt=obj.approved_slot_end,
                approved_slot_end__gt=obj.approved_slot_start,
            ).exclude(pk=obj.pk)

            if overlapping.exists():
                messages.warning(
                    request,
                    "⚠️ This slot overlaps with another approved/confirmed booking."
                )

        super().save_model(request, obj, form, change)

    # ─────────────────────────
    # ADMIN ACTIONS
    # ─────────────────────────
    @admin.action(description="Approve selected bookings")
    def approve_bookings(self, request, queryset):
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
                    f"{booking.acknowledgement_id}: Slot start & end required."
                )
                continue

            if booking.amount is None:
                messages.error(
                    request,
                    f"{booking.acknowledgement_id}: Amount required."
                )
                continue

            try:
                approve_booking(
                    booking=booking,
                    approved_start=booking.approved_slot_start,
                    approved_end=booking.approved_slot_end,
                    amount=booking.amount,
                    psychologist=booking.psychologist,
                    corporate=booking.corporate,
                )
                messages.success(
                    request,
                    f"{booking.acknowledgement_id}: Approved successfully."
                )

            except Exception as e:
                messages.error(
                    request,
                    f"{booking.acknowledgement_id}: {str(e)}"
                )

    @admin.action(description="Reject selected bookings")
    def reject_bookings(self, request, queryset):
        for booking in queryset:

            if booking.status != "PENDING":
                messages.warning(
                    request,
                    f"{booking.acknowledgement_id}: Not pending, skipped."
                )
                continue

            if not booking.rejection_reason:
                messages.error(
                    request,
                    f"{booking.acknowledgement_id}: Rejection reason required."
                )
                continue

            try:
                reject_booking(
                    booking=booking,
                    reason=booking.rejection_reason,
                    alternate_slots=booking.alternate_slots,
                )
                messages.success(
                    request,
                    f"{booking.acknowledgement_id}: Rejected successfully."
                )

            except Exception as e:
                messages.error(
                    request,
                    f"{booking.acknowledgement_id}: {str(e)}"
                )