'use client'

import {startTransition, useActionState, useRef, useState, type FormEvent} from 'react'

import {sendContactMessage, type ContactState} from './actions'
import RecaptchaCheckbox, {type RecaptchaHandle} from './RecaptchaCheckbox'

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY

const initialState: ContactState = {status: 'idle'}

export default function ContactForm({successMessage}: {successMessage: string}) {
  const [state, formAction, pending] = useActionState(sendContactMessage, initialState)
  const recaptchaRef = useRef<RecaptchaHandle>(null)
  const [captchaError, setCaptchaError] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    if (RECAPTCHA_SITE_KEY) {
      const token = recaptchaRef.current?.getToken() ?? ''
      if (!token) {
        setCaptchaError('Please tick “I’m not a robot”.')
        return
      }
      formData.set('recaptchaToken', token)
      // Tokens are single-use; if the server returns an error, the visitor ticks again
      recaptchaRef.current?.reset()
    }

    setCaptchaError('')
    startTransition(() => formAction(formData))
  }

  if (state.status === 'success') {
    return (
      <p className="contact-form__success" role="status">
        {successMessage}
      </p>
    )
  }

  const errors = state.fieldErrors ?? {}

  return (
    <form onSubmit={handleSubmit} className="contact-form" noValidate>
      <div className="contact-form__row">
        <div className="contact-form__field">
          <label htmlFor="contact-name">Name</label>
          <input
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            defaultValue={state.values?.name}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? 'contact-name-error' : undefined}
          />
          {errors.name && (
            <p id="contact-name-error" className="contact-form__error">
              {errors.name}
            </p>
          )}
        </div>
        <div className="contact-form__field">
          <label htmlFor="contact-email">Email</label>
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            defaultValue={state.values?.email}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? 'contact-email-error' : undefined}
          />
          {errors.email && (
            <p id="contact-email-error" className="contact-form__error">
              {errors.email}
            </p>
          )}
        </div>
      </div>
      <div className="contact-form__field">
        <label htmlFor="contact-message">Message</label>
        <textarea
          id="contact-message"
          name="message"
          rows={6}
          required
          defaultValue={state.values?.message}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? 'contact-message-error' : undefined}
        />
        {errors.message && (
          <p id="contact-message-error" className="contact-form__error">
            {errors.message}
          </p>
        )}
      </div>

      {/* Honeypot for bots; hidden from people and assistive tech */}
      <div className="contact-form__hp" aria-hidden="true">
        <label htmlFor="contact-company">Company</label>
        <input id="contact-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {RECAPTCHA_SITE_KEY && (
        <div className="contact-form__field">
          <RecaptchaCheckbox siteKey={RECAPTCHA_SITE_KEY} ref={recaptchaRef} />
          {captchaError && <p className="contact-form__error">{captchaError}</p>}
        </div>
      )}

      <div className="contact-form__footer">
        <button type="submit" className="contact-form__submit" disabled={pending}>
          {pending ? 'Sending…' : 'Send message'}
        </button>
        <p className="contact-form__status" aria-live="polite">
          {state.message}
        </p>
      </div>
    </form>
  )
}
