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
    verification_url = (
        f"{settings.FRONTEND_URL}/verify-email"
        f"?token={booking.email_verification_token}"
    )

    message = Mail(
        from_email=settings.DEFAULT_FROM_EMAIL,
        to_emails=booking.user.email,
        subject="Complete your MindSettler booking",
        plain_text_content="""
Hello,

You recently started a booking on MindSettler.

Please verify your email to continue: {verification_url}

If you did not request this, you can safely ignore this email.

MindSettler
support@mindsettler.in
""",
        html_content=f"""
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Imbue:wght@700&family=Playfair+Display:wght@400;600&display=swap" rel="stylesheet">
</head>
<body style="margin:0; padding:0; background-color:#F2ECF2; font-family:'Playfair Display', serif;">
  
  <!-- Main Container -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#F2ECF2; padding:40px 20px;">
    <tr>
      <td align="center">
        
        <!-- Email Card -->
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff; border-radius:16px; box-shadow:0 4px 20px rgba(69, 56, 89, 0.1); overflow:hidden;">
          
          <!-- Header with Brand Color -->
          <tr>
            <td style="background:linear-gradient(135deg, #E37383 0%, #B19EEF 100%); padding:40px 40px 60px; text-align:center;">
              <h1 style="margin:0; font-family:'Imbue', serif; font-size:48px; color:#ffffff; letter-spacing:1px;">
                Mind<span style="color:#F9D1D5;">Settler</span>
              </h1>
              <p style="margin:16px 0 0; font-size:14px; color:#ffffff; letter-spacing:3px; text-transform:uppercase; opacity:0.9;">
                Your Journey Begins Here
              </p>
            </td>
          </tr>
          
          <!-- Body Content -->
          <tr>
            <td style="padding:50px 40px;">
              
              <p style="margin:0 0 24px; font-size:18px; color:#453859; line-height:1.6;">
                Hello,
              </p>
              
              <p style="margin:0 0 28px; font-size:16px; color:#453859; line-height:1.7;">
                Thank you for choosing <strong style="color:#E37383;">MindSettler</strong>. 
                We're excited to support you on your mental wellness journey.
              </p>
              
              <p style="margin:0 0 36px; font-size:16px; color:#453859; line-height:1.7;">
                To continue with your booking, please verify your email address by clicking the button below:
              </p>
              
              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" style="padding:0 0 40px;">
                    <a href="{verification_url}" 
                       style="display:inline-block; 
                              padding:16px 48px; 
                              background:linear-gradient(135deg, #E37383 0%, #FF9FFC 100%);
                              color:#ffffff; 
                              text-decoration:none; 
                              border-radius:50px; 
                              font-size:16px; 
                              font-weight:600;
                              letter-spacing:0.5px;
                              box-shadow:0 8px 20px rgba(227, 115, 131, 0.3);">
                      Verify Email & Continue
                    </a>
                  </td>
                </tr>
              </table>
              
              <!-- Alternative Link -->
              <p style="margin:0 0 32px; font-size:14px; color:#666; line-height:1.6; text-align:center;">
                Or copy and paste this link in your browser:<br/>
                <a href="{verification_url}" style="color:#E37383; word-break:break-all;">{verification_url}</a>
              </p>
              
              <!-- Divider -->
              <div style="border-top:1px solid #F2ECF2; margin:32px 0;"></div>
              
              <!-- Footer Note -->
              <p style="margin:0; font-size:13px; color:#999; line-height:1.6;">
                If you didn't request this booking, please ignore this email. 
                This verification link will expire in 24 hours.
              </p>
              
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color:#F9D1D5; padding:32px 40px; text-align:center;">
              <p style="margin:0 0 8px; font-size:14px; color:#453859; font-weight:600;">
                MindSettler
              </p>
              <p style="margin:0 0 12px; font-size:12px; color:#666;">
                Your Sanctuary for Emotional Well-being
              </p>
              <p style="margin:0; font-size:12px; color:#666;">
                Need help? <a href="mailto:support@mindsettler.in" style="color:#E37383; text-decoration:none;">support@mindsettler.in</a>
              </p>
            </td>
          </tr>
          
        </table>
        
      </td>
    </tr>
  </table>
  
</body>
</html>
""",
    )

    _send_email(message)

    booking.last_verification_email_sent_at = timezone.now()
    booking.save(update_fields=["last_verification_email_sent_at"])

def send_cancellation_verification_email(booking):
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
        subject="Confirm cancellation of your MindSettler booking",
        plain_text_content="""
Hello,

We received a request to cancel a booking on MindSettler.

Please open this email and use the button to confirm the cancellation.

If you did not request this, you can ignore this message.

MindSettler
support@mindsettler.in
""",
        html_content=f"""
<div style="max-width:520px;
            margin:0 auto;
            font-family:Arial, Helvetica, sans-serif;
            color:#333;
            line-height:1.6;">

  <p>Hello,</p>

  <p>
    We received a request to cancel a booking on
    <strong>MindSettler</strong>.
  </p>

  <p>
    Please confirm your request using the button below.
  </p>

  <div style="margin:28px 0; text-align:center;">
    <a href="{cancel_url}"
       style="display:inline-block;
              padding:12px 24px;
              background:#e55d80;
              color:#ffffff;
              text-decoration:none;
              border-radius:4px;
              font-size:15px;">
      Confirm cancellation
    </a>
  </div>

  <p style="font-size:13px;color:#666;">
    If you did not request this cancellation, you may safely ignore this email.
  </p>

  <hr style="border:none;border-top:1px solid #e6e6e6;margin:24px 0;" />

  <p style="font-size:12px;color:#777;">
    MindSettler – Mental Wellness Platform<br />
    Support: support@mindsettler.in
  </p>

</div>
""",
    )

    _send_email(message)

def send_booking_approved_email(booking):
    """
    Sends approval notification email (idempotent).
    """
    if booking.approval_email_sent:
        return

    message = Mail(
        from_email=settings.DEFAULT_FROM_EMAIL,
        to_emails=booking.user.email,
        subject="Your MindSettler session has been approved",
        html_content=f"""
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;">
            <h2 style="color:#453859;">Session Approved ✅</h2>

            <p>Hello,</p>

            <p>Your session request has been approved with the following details:</p>

            <table style="border-collapse:collapse;">
                <tr><td><strong>Booking ID</strong></td><td>{booking.acknowledgement_id}</td></tr>
                <tr><td><strong>Date</strong></td><td>{booking.approved_slot_start.date()}</td></tr>
                <tr>
                    <td><strong>Time</strong></td>
                    <td>
                        {booking.approved_slot_start.strftime("%H:%M")}
                        –
                        {booking.approved_slot_end.strftime("%H:%M")}
                    </td>
                </tr>
                <tr><td><strong>Amount</strong></td><td>₹{booking.amount}</td></tr>
            </table>

            <p>Please proceed with payment to confirm your appointment.</p>

            <br />
            <p>— MindSettler Team<br/>
            <small>support@mindsettler.in</small></p>
        </div>
        """,
    )

    _send_email(message)

    booking.approval_email_sent = True
    booking.save(update_fields=["approval_email_sent"])


def send_booking_rejected_email(booking):
    """
    Sends rejection notification email (idempotent).
    """
    if booking.rejection_email_sent:
        return

    message = Mail(
        from_email=settings.DEFAULT_FROM_EMAIL,
        to_emails=booking.user.email,
        subject="Update on your MindSettler booking",
        html_content=f"""
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;">
            <h2 style="color:#c0392b;">Booking Update</h2>

            <p>Hello,</p>

            <p>Unfortunately, your booking request could not be approved.</p>

            <p><strong>Reason:</strong></p>
            <div style="background:#faf9fb;padding:12px;border-left:4px solid #c0392b;">
                {booking.rejection_reason}
            </div>

            {"<p><strong>Suggested alternate slots:</strong></p><p>" + booking.alternate_slots + "</p>" if booking.alternate_slots else ""}

            <p>You are welcome to submit a new request anytime.</p>

            <br />
            <p>— MindSettler Team<br/>
            <small>support@mindsettler.in</small></p>
        </div>
        """,
    )

    _send_email(message)

    booking.rejection_email_sent = True
    booking.save(update_fields=["rejection_email_sent"])