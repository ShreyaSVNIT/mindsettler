from django.db import models
from django.utils import timezone
from apps.users.models import AppUser
from apps.psychologists.models import Psychologist
from apps.corporates.models import Corporate
import uuid


class Booking(models.Model):

    STATUS_CHOICES = [
        ("DRAFT", "Draft"),
        ("PENDING", "Pending"),
        ("REJECTED", "Rejected"),
        ("APPROVED", "Approved"),
        ("CONFIRMED", "Confirmed"),
        ("COMPLETED", "Completed"),
        ("CANCELLED", "Cancelled"),
    ]

    PERIOD_CHOICES = [
        ("MORNING", "Morning"),
        ("EVENING", "Evening"),
        ("CUSTOM", "Custom Range"),
    ]

    MODE_CHOICES = [
        ("ONLINE", "Online"),
        ("OFFLINE", "Offline"),
    ]

    PAYMENT_MODE_CHOICES = [
        ("ONLINE", "Online"),
        ("OFFLINE", "Offline"),
    ]

    # ─────────────────────────
    # USER & OWNERSHIP
    # ─────────────────────────
    user = models.ForeignKey(
        AppUser,
        on_delete=models.CASCADE,
        related_name="bookings",
    )

    # ─────────────────────────
    # BOOKING STATE
    # ─────────────────────────
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="DRAFT",
    )

    # ─────────────────────────
    # SLOT PREFERENCE (USER)
    # ─────────────────────────
    preferred_period = models.CharField(
        max_length=10,
        choices=PERIOD_CHOICES,
    )

    preferred_time_start = models.TimeField(
        null=True,
        blank=True,
    )

    preferred_time_end = models.TimeField(
        null=True,
        blank=True,
    )
    preferred_date = models.DateField(
        null=True,
        blank=True,
        help_text="Preferred date requested by the user"
    )

    # ─────────────────────────
    # SESSION DETAILS
    # ─────────────────────────
    mode = models.CharField(
        max_length=10,
        choices=MODE_CHOICES,
    )

    payment_mode = models.CharField(
        max_length=10,
        choices=PAYMENT_MODE_CHOICES,
    )

    user_message = models.TextField(blank=True)

    # ─────────────────────────
    # ADMIN ASSIGNMENTS
    # ─────────────────────────
    psychologist = models.ForeignKey(
        Psychologist,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
    )

    corporate = models.ForeignKey(
        Corporate,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
    )

    approved_slot_start = models.DateTimeField(
        null=True,
        blank=True,
    )

    approved_slot_end = models.DateTimeField(
        null=True,
        blank=True,
    )

    # ─────────────────────────
    # ADMIN DECISION
    # ─────────────────────────
    rejection_reason = models.TextField(
        blank=True,
    )

    alternate_slots = models.TextField(
        blank=True,
        help_text="Admin suggested alternate slots",
    )
    ADMIN_DECISION_CHOICES = [
    ("PENDING", "Pending"),
    ("APPROVED", "Approved"),
    ("REJECTED", "Rejected"),
]

    admin_decision = models.CharField(
    max_length=20,
    choices=ADMIN_DECISION_CHOICES,
    default="PENDING",
    )

    # ─────────────────────────
    # CONSENT (PER BOOKING)
    # ─────────────────────────
    consent_given = models.BooleanField(default=False)
    consent_given_at = models.DateTimeField(null=True, blank=True)
    consent_corporate = models.ForeignKey(
        Corporate,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="consented_bookings",
    )

    # ─────────────────────────
    # EMAIL VERIFICATION
    # ─────────────────────────
    email_verified = models.BooleanField(default=False)
    email_verified_at = models.DateTimeField(null=True, blank=True)

    email_verification_token = models.UUIDField(
        default=uuid.uuid4,
        unique=True,
        editable=False,
    )
    last_verification_email_sent_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text="Last time verification email was sent"
    )
    # Booking model
    last_access_verified_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text="Last time user verified email to access this booking"
    )

    # ─────────────────────────
    # ACKNOWLEDGEMENT
    # ─────────────────────────
    acknowledgement_id = models.CharField(
        max_length=20,
        unique=True,
        null=True,
        blank=True,
    )
        # 📩 USER CONFIRMATION
    confirmation_token = models.UUIDField(
        default=uuid.uuid4,
        unique=True,
        editable=False,
    )

    confirmed_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    # ─────────────────────────
    # TIMESTAMPS
    # ─────────────────────────
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    cancelled_at = models.DateTimeField(null=True, blank=True)

    # ─────────────────────────
    # DOMAIN METHODS
    # ─────────────────────────
    def can_cancel(self):
        if self.status != "CONFIRMED":
            return False
        if not self.approved_slot_start:
            return False
        return timezone.now() <= self.approved_slot_start - timezone.timedelta(hours=24)

    def mark_cancelled(self):
        self.status = "CANCELLED"
        self.cancelled_at = timezone.now()
        self.save(update_fields=["status", "cancelled_at"])

    def verify_email(self):
        self.email_verified = True
        self.email_verified_at = timezone.now()
        self.save(update_fields=["email_verified", "email_verified_at"])

    def generate_acknowledgement_id(self):
        if not self.acknowledgement_id:
            self.acknowledgement_id = f"MS-{uuid.uuid4().hex[:8].upper()}"
            self.save(update_fields=["acknowledgement_id"])

    def __str__(self):
        return self.acknowledgement_id or f"Booking-{self.id}"