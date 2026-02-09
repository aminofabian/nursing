import { Resend } from "resend"

import { APP_NAME, APP_URL } from "@/lib/constants"

const RESEND_API_KEY = process.env.RESEND_API_KEY
const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL

if (!RESEND_API_KEY) {
  console.warn("[Email] RESEND_API_KEY is not set. Emails will not be sent.")
}

if (!RESEND_FROM_EMAIL) {
  console.warn("[Email] RESEND_FROM_EMAIL is not set. Emails will not be sent.")
}

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null

export async function sendWelcomeEmail(params: { name: string | null; email: string }) {
  if (!resend || !RESEND_FROM_EMAIL) return

  const firstName = params.name?.split(" ")[0] ?? "there"

  const appUrl = APP_URL.replace(/\/$/, "")

  await resend.emails.send({
    from: `${APP_NAME} <${RESEND_FROM_EMAIL}>`,
    to: params.email,
    subject: `Welcome to ${APP_NAME}!`,
    text: [
      `Hi ${firstName},`,
      "",
      `Welcome to ${APP_NAME}! 🎉`,
      "",
      "Your account has been created successfully. You can now log in and start using all of the nursing study resources we’ve prepared for you.",
      "",
      `Visit your dashboard: ${appUrl}/dashboard`,
      "",
      "If you didn’t sign up for this account, you can ignore this email.",
      "",
      `— The ${APP_NAME} team`,
    ].join("\n"),
    html: `
      <div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif; line-height: 1.6; color: #111827;">
        <h1 style="font-size: 24px; margin-bottom: 8px;">Welcome to ${APP_NAME}, ${firstName} 👋</h1>
        <p>Thanks for signing up! Your account has been created successfully.</p>
        <p>You now have access to curated nursing study resources designed to help you pass exams and feel confident in clinical.</p>
        <p>
          <a href="${appUrl}/dashboard" style="display:inline-block;padding:10px 16px;border-radius:9999px;background:#0f766e;color:#ecfeff;text-decoration:none;font-weight:600;">
            Go to your dashboard
          </a>
        </p>
        <p style="font-size: 14px; color: #6b7280; margin-top: 24px;">
          If you did not create this account, you can safely ignore this email.
        </p>
        <p style="margin-top: 16px;">— The ${APP_NAME} team</p>
      </div>
    `,
  })
}

export async function sendSubscriptionConfirmationEmail(params: {
  name: string | null
  email: string
  plan: "monthly" | "yearly"
}) {
  if (!resend || !RESEND_FROM_EMAIL) return

  const firstName = params.name?.split(" ")[0] ?? "there"
  const appUrl = APP_URL.replace(/\/$/, "")
  const planLabel = params.plan === "yearly" ? "Yearly" : "Monthly"

  await resend.emails.send({
    from: `${APP_NAME} <${RESEND_FROM_EMAIL}>`,
    to: params.email,
    subject: `${planLabel} subscription confirmed`,
    text: [
      `Hi ${firstName},`,
      "",
      `Your ${planLabel.toLowerCase()} subscription to ${APP_NAME} is now active ✅`,
      "",
      "You can now access all premium nursing study resources, practice exams, care plans, and more.",
      "",
      `Visit your dashboard: ${appUrl}/dashboard`,
      "",
      `— The ${APP_NAME} team`,
    ].join("\n"),
    html: `
      <div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif; line-height: 1.6; color: #111827;">
        <h1 style="font-size: 24px; margin-bottom: 8px;">Your ${planLabel} subscription is active ✅</h1>
        <p>Hi ${firstName},</p>
        <p>Your ${planLabel.toLowerCase()} subscription to <strong>${APP_NAME}</strong> is now active.</p>
        <p>You now have unlimited access to all premium nursing study resources.</p>
        <p>
          <a href="${appUrl}/dashboard" style="display:inline-block;padding:10px 16px;border-radius:9999px;background:#0f766e;color:#ecfeff;text-decoration:none;font-weight:600;">
            Start studying
          </a>
        </p>
        <p style="margin-top: 16px;">Thank you for supporting ${APP_NAME} 💚</p>
      </div>
    `,
  })
}

export async function sendPurchaseReceiptEmail(params: {
  name: string | null
  email: string
  resourceTitle: string
  amountCents: number
}) {
  if (!resend || !RESEND_FROM_EMAIL) return

  const firstName = params.name?.split(" ")[0] ?? "there"
  const appUrl = APP_URL.replace(/\/$/, "")
  const amount = (params.amountCents / 100).toFixed(2)

  await resend.emails.send({
    from: `${APP_NAME} <${RESEND_FROM_EMAIL}>`,
    to: params.email,
    subject: `Your ${APP_NAME} download: ${params.resourceTitle}`,
    text: [
      `Hi ${firstName},`,
      "",
      `Thanks for purchasing "${params.resourceTitle}" on ${APP_NAME}.`,
      "",
      `Amount: $${amount}`,
      "",
      `You can access this resource anytime from your library: ${appUrl}/library`,
      "",
      `— The ${APP_NAME} team`,
    ].join("\n"),
    html: `
      <div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif; line-height: 1.6; color: #111827;">
        <h1 style="font-size: 24px; margin-bottom: 8px;">Your download is ready 🎉</h1>
        <p>Hi ${firstName},</p>
        <p>Thanks for purchasing <strong>${params.resourceTitle}</strong> on <strong>${APP_NAME}</strong>.</p>
        <p>Amount charged: <strong>$${amount}</strong></p>
        <p>You can access this resource anytime from your library.</p>
        <p>
          <a href="${appUrl}/library" style="display:inline-block;padding:10px 16px;border-radius:9999px;background:#0f766e;color:#ecfeff;text-decoration:none;font-weight:600;">
            View my library
          </a>
        </p>
        <p style="margin-top: 16px;">Happy studying! 💚</p>
      </div>
    `,
  })
}

export async function sendPasswordResetEmail(params: {
  name: string | null
  email: string
  token: string
}) {
  if (!resend || !RESEND_FROM_EMAIL) return

  const firstName = params.name?.split(" ")[0] ?? "there"
  const appUrl = APP_URL.replace(/\/$/, "")
  const resetUrl = `${appUrl}/reset-password?token=${encodeURIComponent(params.token)}`

  await resend.emails.send({
    from: `${APP_NAME} <${RESEND_FROM_EMAIL}>`,
    to: params.email,
    subject: `Reset your ${APP_NAME} password`,
    text: [
      `Hi ${firstName},`,
      "",
      `We received a request to reset your ${APP_NAME} password.`,
      "",
      `You can set a new password using this link:`,
      resetUrl,
      "",
      "If you did not request a password reset, you can safely ignore this email.",
      "",
      "For security reasons, this link will expire in 1 hour.",
      "",
      `— The ${APP_NAME} team`,
    ].join("\n"),
    html: `
      <div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif; line-height: 1.6; color: #111827;">
        <h1 style="font-size: 24px; margin-bottom: 8px;">Reset your password</h1>
        <p>Hi ${firstName},</p>
        <p>We received a request to reset your <strong>${APP_NAME}</strong> password.</p>
        <p>
          <a href="${resetUrl}" style="display:inline-block;padding:10px 16px;border-radius:9999px;background:#0f766e;color:#ecfeff;text-decoration:none;font-weight:600;">
            Set a new password
          </a>
        </p>
        <p style="margin-top: 8px;">If you did not request this, you can safely ignore this email.</p>
        <p style="font-size: 14px; color: #6b7280; margin-top: 16px;">
          For security reasons, this link will expire in 1 hour.
        </p>
      </div>
    `,
  })
}


