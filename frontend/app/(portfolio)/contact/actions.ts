'use server'

import {client} from '@/sanity/lib/client'
import {contactEmailQuery} from '@/sanity/lib/queries'
import {isMailerConfigured, sendMail} from './mailer'
import {verifyRecaptcha} from './recaptcha'
import {
  readContactValues,
  validateContact,
  type ContactValues,
  type FieldErrors,
} from './validation'

export type ContactState = {
  status: 'idle' | 'success' | 'error'
  message?: string
  fieldErrors?: FieldErrors
  // Echoed back so the form keeps its values after a failed submit
  values?: ContactValues
}

const failure = (message: string, values: ContactValues): ContactState => ({
  status: 'error',
  message,
  values,
})

// "Deliver to" from Site Settings; falls back to the SMTP account itself
async function getRecipient(fallback: string) {
  const deliverTo = await client
    .withConfig({useCdn: false, stega: false})
    .fetch(contactEmailQuery)
    .catch(() => null)
  return deliverTo || fallback
}

/**
 * Validates the form, checks the reCAPTCHA tick, and emails the message. Mail is sent from the
 * SMTP account (Gmail only sends as the logged-in address). SMTP is set up in ./mailer.ts.
 */
export async function sendContactMessage(
  _prevState: ContactState,
  formData: FormData,
): Promise<ContactState> {
  // Honeypot: real visitors never see or fill this field, so pretend it worked
  if (formData.get('company')) return {status: 'success'}

  const values = readContactValues(formData)
  const fieldErrors = validateContact(values)
  if (Object.keys(fieldErrors).length > 0) {
    return {status: 'error', fieldErrors, values}
  }

  const token = formData.get('recaptchaToken')
  if (!(await verifyRecaptcha(typeof token === 'string' ? token : null))) {
    return failure(
      'We couldn’t verify you’re not a robot. Please tick the box and try again.',
      values,
    )
  }

  if (!isMailerConfigured()) {
    console.error('Contact form: set SMTP_HOST, SMTP_USER and SMTP_PASS')
    return failure('The contact form isn’t set up yet. Please try again later.', values)
  }

  const from = process.env.SMTP_USER!
  try {
    await sendMail({
      from,
      to: await getRecipient(from),
      replyTo: {name: values.name, email: values.email},
      subject: `New message from ${values.name}`,
      text: `${values.message}\n\n— ${values.name} <${values.email}>`,
    })
  } catch (error) {
    console.error('Contact form: failed to send', error)
    return failure('Something went wrong sending your message. Please try again.', values)
  }

  return {status: 'success'}
}
