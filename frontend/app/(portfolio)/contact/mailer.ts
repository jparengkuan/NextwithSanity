import 'server-only'

import nodemailer from 'nodemailer'

type Mail = {
  to: string
  from: string
  replyTo: {name: string; email: string}
  subject: string
  text: string
}

/**
 * Sends mail over SMTP, configured with SMTP_HOST, SMTP_PORT, SMTP_USER and SMTP_PASS.
 * With Gmail that's smtp.gmail.com:465, your Gmail address and a Google app password.
 */
export function isMailerConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS)
}

export async function sendMail(mail: Mail) {
  const port = Number(process.env.SMTP_PORT) || 465
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: {user: process.env.SMTP_USER, pass: process.env.SMTP_PASS},
  })

  await transporter.sendMail({
    from: mail.from,
    to: mail.to,
    replyTo: {name: mail.replyTo.name, address: mail.replyTo.email},
    subject: mail.subject,
    text: mail.text,
  })
}
