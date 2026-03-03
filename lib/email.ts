import { Resend } from "resend";

const DEFAULT_FROM = "Sellernote Education <onboarding@resend.dev>";

function getResendClient() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

async function sendWithFrom(from: string, to: string, subject: string, html: string) {
  const resend = getResendClient();
  if (!resend) {
    throw new Error("RESEND_API_KEY is missing");
  }
  const { error } = await resend.emails.send({ from, to, subject, html });
  return error;
}

export async function sendEmail(to: string, subject: string, html: string) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is missing");
  }

  const configuredFrom = process.env.RESEND_FROM ?? DEFAULT_FROM;
  let error = await sendWithFrom(configuredFrom, to, subject, html);

  // Retry once with the Resend onboarding sender to reduce failures in unverified domains.
  if (error && configuredFrom !== DEFAULT_FROM) {
    error = await sendWithFrom(DEFAULT_FROM, to, subject, html);
  }

  if (error) {
    console.error("[email] send error:", error);
    throw new Error(typeof error.message === "string" ? error.message : "Email send failed");
  }
}

export async function sendWelcomeEmail(to: string, name: string) {
  await sendEmail(
    to,
    "Welcome to Sellernote Education",
    `<p>Hello <strong>${name}</strong>,</p>
     <p>Welcome to Sellernote Education.</p>
     <p>Start learning right away.</p>`
  );
}

export async function sendVerificationEmail(to: string, token: string) {
  const url = `${process.env.NEXTAUTH_URL ?? "http://localhost:3000"}/verify-email?token=${token}`;
  await sendEmail(
    to,
    "Verify your email",
    `<p>Please click the link below to verify your email.</p>
     <p><a href="${url}" style="color:#2563eb;">Verify email</a></p>
     <p>This link is valid for 1 hour.</p>`
  );
}

export async function sendPasswordResetEmail(to: string, token: string) {
  const url = `${process.env.NEXTAUTH_URL ?? "http://localhost:3000"}/reset-password?token=${token}`;
  await sendEmail(
    to,
    "Password reset link",
    `<p>You requested a password reset.</p>
     <p><a href="${url}" style="color:#2563eb;">Reset password</a></p>
     <p>This link is valid for 1 hour. Ignore this email if you did not request it.</p>`
  );
}

export async function sendPaymentConfirmEmail(
  to: string,
  courseTitle: string,
  price: string
) {
  await sendEmail(
    to,
    `Payment completed: ${courseTitle}`,
    `<p>Your payment is complete.</p>
     <p><strong>Course:</strong> ${courseTitle}</p>
     <p><strong>Amount:</strong> ${price}</p>`
  );
}

export async function sendRefundConfirmEmail(to: string, courseTitle: string) {
  await sendEmail(
    to,
    `Refund completed: ${courseTitle}`,
    `<p>Your refund has been processed.</p>
     <p><strong>Course:</strong> ${courseTitle}</p>`
  );
}

export async function sendInquiryReplyEmail(
  to: string,
  inquiryTitle: string,
  replyContent: string
) {
  await sendEmail(
    to,
    `Reply to your inquiry: ${inquiryTitle}`,
    `<p>We posted a reply to your inquiry.</p>
     <p><strong>Title:</strong> ${inquiryTitle}</p>
     <hr/>
     <p>${replyContent.replace(/\n/g, "<br/>")}</p>`
  );
}
