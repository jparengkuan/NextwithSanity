'use server'

import {client} from '@/sanity/lib/client'
import {contactEmailQuery} from '@/sanity/lib/queries'
import {isMailerConfigured, sendMail} from './mailer'
import {verifyRecaptcha} from './recaptcha'

export type ContactState = {
  status: 'idle' | 'success' | 'error'
  message?: string
  fieldErrors?: Partial<Record<'name' | 'email' | 'message', string>>
  // Echoed back so the form keeps its values after a failed submit
  values?: {name: string; email: string; message: string}
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Emails the message to the "deliver to" address in Site Settings. It's sent from the SMTP
 * account itself (Gmail only sends as the logged-in address), which is also the fallback
 * recipient. SMTP is set up in ./mailer.ts.
 */
export async function sendContactMessage(
  _prevState: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const values = {
    name: String(formData.get('name') ?? '').trim(),
    email: String(formData.get('email') ?? '').trim(),
    message: String(formData.get('message') ?? '').trim(),
  }

  // Honeypot: real visitors never see or fill this field
  if (formData.get('company')) {
    return {status: 'success'}
  }

  const fieldErrors: ContactState['fieldErrors'] = {}
  if (!values.name) fieldErrors.name = 'Please enter your name.'
  else if (values.name.length > 200) fieldErrors.name = 'That name is too long.'
  if (!EMAIL_PATTERN.test(values.email)) fieldErrors.email = 'Please enter a valid email address.'
  if (values.message.length < 10) fieldErrors.message = 'Please write at least a few words.'
  else if (values.message.length > 5000)
    fieldErrors.message = 'Please keep it under 5000 characters.'

  if (Object.keys(fieldErrors).length > 0) {
    return {status: 'error', fieldErrors, values}
  }

  const recaptchaToken = formData.get('recaptchaToken')
  if (!(await verifyRecaptcha(typeof recaptchaToken === 'string' ? recaptchaToken : null))) {
    return {
      status: 'error',
      message: 'We couldn’t verify you’re not a robot. Please tick the box and try again.',
      values,
    }
  }

  if (!isMailerConfigured()) {
    console.error('Contact form: set SMTP_HOST, SMTP_USER and SMTP_PASS')
    return {
      status: 'error',
      message: 'The contact form isn’t set up yet. Please try again later.',
      values,
    }
  }

  const from = process.env.SMTP_USER!
  const deliverTo = await client
    .withConfig({useCdn: false, stega: false})
    .fetch(contactEmailQuery)
    .catch(() => null)

  try {
    await sendMail({
      from,
      to: deliverTo || from,
      replyTo: {name: values.name, email: values.email},
      subject: `New message from ${values.name}`,
      text: `${values.message}\n\n— ${values.name} <${values.email}>`,
    })
  } catch (error) {
    console.error('Contact form: failed to send', error)
    return {
      status: 'error',
      message: 'Something went wrong sending your message. Please try again.',
      values,
    }
  }

  return {status: 'success'}
}
