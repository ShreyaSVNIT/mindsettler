import uuid
from django.conf import settings
from django.utils import timezone
from rest_framework.exceptions import ValidationError

from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from python_http_client.exceptions import ForbiddenError, UnauthorizedError


def _send_email(message):
    """
    Strict email sender.
    - Email MUST be delivered
    - Any SendGrid failure raises ValidationError
    """

    api_key = getattr(settings, "SENDGRID_API_KEY", None)

    if not api_key:
        raise ValidationError(
            "Email service misconfigured: SENDGRID_API_KEY missing"
        )

    try:
        sg = SendGridAPIClient(api_key)
        sg.send(message)

    except (ForbiddenError, UnauthorizedError):
        raise ValidationError(
            "Email service rejected request (invalid API key or sender identity)"
        )

    except Exception as e:
        raise ValidationError(
            f"Failed to send email. Please try again later. ({str(e)})"
        )


def send_booking_verification_email(booking):
    """
    Sends booking verification email.
    Email delivery is mandatory.
    """

    verification_url = (
        f"{settings.FRONTEND_URL}/verify-booking"
        f"?token={booking.email_verification_token}"
    )

    message = Mail(
        from_email=settings.DEFAULT_FROM_EMAIL,
        to_emails=booking.user.email,
        subject="Verify your booking – MindSettler",
        html_content=f"""
        <p>Hello,</p>

        <p>Please verify your booking by clicking the link below:</p>

        <p>
            <a href="{verification_url}">
                Verify Booking
            </a>
        </p>

        <br />
        <p>– MindSettler Team</p>
        """,
    )

    _send_email(message)

    booking.last_verification_email_sent_at = timezone.now()
    booking.save(update_fields=["last_verification_email_sent_at"])


def send_cancellation_verification_email(booking):
    """
    Sends cancellation confirmation email.
    Email delivery is mandatory.
    """

    booking.cancellation_token = uuid.uuid4()
    booking.cancellation_requested_at = timezone.now()
    booking.save(update_fields=[
        "cancellation_token",
        "cancellation_requested_at",
    ])

    cancel_url = (
        f"{settings.FRONTEND_URL}/verify-cancellation"
        f"?token={booking.cancellation_token}"
    )

    message = Mail(
    from_email=settings.DEFAULT_FROM_EMAIL,
    to_emails=booking.user.email,
    subject="⚠️ Confirm Cancellation – MindSettler",
    html_content=f"""
    <h2 style="color:#c0392b;">Cancellation Confirmation Required</h2>

    <p>Hello,</p>

    <p>
        You have requested to <strong>cancel your session</strong>.
        This action is irreversible.
    </p>

    <p><strong>Session ID:</strong> {booking.acknowledgement_id}</p>

    <p>
        Please confirm cancellation by clicking the button below:
    </p>

    <p>
        <a href="{cancel_url}"
           style="padding:10px 16px;
                  background:#c0392b;
                  color:white;
                  text-decoration:none;
                  border-radius:4px;">
            Confirm Cancellation
        </a>
    </p>

    <p style="font-size:12px;color:#666;">
        Requested at: {timezone.now().strftime("%Y-%m-%d %H:%M:%S UTC")}
    </p>

    <br />
    <p>– MindSettler Team</p>
    """,
)

    _send_email(message)