# apps/bookings/services/payments.py
from rest_framework.exceptions import ValidationError


def validate_payment_mode(mode, payment_mode):
    if mode == "ONLINE" and payment_mode != "ONLINE":
        raise ValidationError(
            "Online sessions require online payment"
        )