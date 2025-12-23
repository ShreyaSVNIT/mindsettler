const functions = require("firebase-functions");
const nodemailer = require("nodemailer");

// 🔐 EMAIL CONFIG (TEMP: Gmail SMTP)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "mindsettler.dev@gmail.com",
    pass: "debz iwwp sihz axbw",
  },
});

exports.sendBookingVerificationEmail = functions.https.onRequest(
  async (req, res) => {
    try {
      const { email, token } = req.body;

      if (!email || !token) {
        return res.status(400).json({
          error: "email and token are required",
        });
      }

      const verificationLink =
        `http://localhost:3000/verify-booking?token=${token}`;

      await transporter.sendMail({
        from: `"MindSettler" <mindsettler.dev@gmail.com>`,
        to: email,
        subject: "Verify your booking – MindSettler",
        html: `
          <p>Hello,</p>
          <p>Please verify your booking by clicking the link below:</p>
          <p>
            <a href="${verificationLink}">
              Verify Booking
            </a>
          </p>
          <p>If you did not request this booking, you can ignore this email.</p>
          <br />
          <p>– MindSettler Team</p>
        `,
      });

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("Email error:", error);
      return res.status(500).json({
        error: "Failed to send verification email",
      });
    }
  }
);