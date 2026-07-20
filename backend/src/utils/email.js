import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

/**
 * Test email connection
 */
export async function verifyEmailConfig() {
  try {
    await transporter.verify();
    console.log("✓ Email service verified");
    return true;
  } catch (err) {
    console.error("✗ Email service error:", err.message);
    return false;
  }
}

/**
 * Send password reset email
 * @param {string} email - recipient email
 * @param {string} resetToken - reset token to include in link
 * @param {string} userName - user's first name (optional)
 */
export async function sendPasswordResetEmail(email, resetToken, userName = "User") {
  const resetLink = `${process.env.FRONTEND_URL || "http://localhost:8080"}/reset-password?token=${resetToken}`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f7f7f7; padding: 30px; }
          .button { display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { background: #333; color: #fff; padding: 20px; text-align: center; font-size: 12px; border-radius: 0 0 8px 8px; }
          .warning { color: #d32f2f; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>A-LINKS Password Reset</h1>
          </div>
          <div class="content">
            <p>Hi ${userName},</p>
            <p>We received a request to reset your A-LINKS password. Click the button below to create a new password:</p>
            <a href="${resetLink}" class="button">Reset Password</a>
            <p>Or copy this link: <a href="${resetLink}">${resetLink}</a></p>
            <p class="warning">This link will expire in 1 hour. If you didn't request a password reset, ignore this email.</p>
          </div>
          <div class="footer">
            <p>&copy; 2026 A-LINKS. All rights reserved.</p>
            <p>Zambian Cyber Security Initiative Foundation (ZCSIF)</p>
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: email,
      subject: "Reset Your A-LINKS Password",
      html: htmlContent,
      text: `Hi ${userName},\n\nWe received a request to reset your password. Click here to reset it:\n${resetLink}\n\nThis link expires in 1 hour.\n\nIf you didn't request this, please ignore this email.`,
    });

    console.log("✓ Password reset email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error("✗ Failed to send password reset email:", err);
    throw new Error("Failed to send password reset email");
  }
}

/**
 * Send welcome email
 * @param {string} email - recipient email
 * @param {string} userName - user's first name
 */
export async function sendWelcomeEmail(email, userName = "User") {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f7f7f7; padding: 30px; }
          .button { display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { background: #333; color: #fff; padding: 20px; text-align: center; font-size: 12px; border-radius: 0 0 8px 8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to A-LINKS!</h1>
          </div>
          <div class="content">
            <p>Hi ${userName},</p>
            <p>Welcome to A-LINKS — where adolescents learn, grow, and connect!</p>
            <p>Your account has been successfully created. Get started now:</p>
            <a href="${process.env.FRONTEND_URL || "http://localhost:8080"}" class="button">Go to A-LINKS</a>
            <p>Need help? Contact us at <a href="mailto:support@alinks.org">support@alinks.org</a></p>
          </div>
          <div class="footer">
            <p>&copy; 2026 A-LINKS. All rights reserved.</p>
            <p>Zambian Cyber Security Initiative Foundation (ZCSIF)</p>
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: email,
      subject: "Welcome to A-LINKS!",
      html: htmlContent,
      text: `Welcome to A-LINKS, ${userName}! Your account has been created successfully.`,
    });

    console.log("✓ Welcome email sent to:", email);
    return { success: true };
  } catch (err) {
    console.error("✗ Failed to send welcome email:", err);
    // Don't throw - welcome email is non-critical
    return { success: false };
  }
}

/**
 * Send email (generic)
 * @param {Object} options - { to, subject, html, text }
 */
export async function sendEmail(options) {
  if (!options.to || !options.subject) {
    throw new Error("Email requires 'to' and 'subject' fields");
  }

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      ...options,
    });

    console.log("✓ Email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error("✗ Failed to send email:", err);
    throw new Error("Failed to send email");
  }
}

