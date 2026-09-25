'use client'

import Script from 'next/script'
import {useImperativeHandle, useRef, type Ref} from 'react'

import {RECAPTCHA_ACTION} from './constants'

type Grecaptcha = {
  ready: (callback: () => void) => void
  render: (container: HTMLElement, params: Record<string, unknown>) => number
  getResponse: (widgetId: number) => string
  reset: (widgetId: number) => void
}

declare global {
  interface Window {
    grecaptcha?: {enterprise: Grecaptcha}
  }
}

export type RecaptchaHandle = {
  getToken: () => string
  reset: () => void
}

/**
 * Visible "I'm not a robot" checkbox (reCAPTCHA Enterprise, checkbox-type key).
 * The token is read at submit time; tokens are single-use, so reset after each submit.
 */
export default function RecaptchaCheckbox({
  siteKey,
  ref,
}: {
  siteKey: string
  ref: Ref<RecaptchaHandle>
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetId = useRef<number | null>(null)

  useImperativeHandle(ref, () => ({
    getToken: () =>
      widgetId.current === null
        ? ''
        : (window.grecaptcha?.enterprise.getResponse(widgetId.current) ?? ''),
    reset: () => {
      if (widgetId.current !== null) window.grecaptcha?.enterprise.reset(widgetId.current)
    },
  }))

  // onReady also fires when returning to the page after the script was already loaded
  function renderWidget() {
    const grecaptcha = window.grecaptcha?.enterprise
    grecaptcha?.ready(() => {
      const container = containerRef.current
      if (!container || container.childElementCount > 0) return
      widgetId.current = grecaptcha.render(container, {
        sitekey: siteKey,
        action: RECAPTCHA_ACTION,
        theme: 'dark',
      })
    })
  }

  return (
    <>
      <Script
        src="https://www.google.com/recaptcha/enterprise.js?render=explicit"
        strategy="afterInteractive"
        onReady={renderWidget}
      />
      <div ref={containerRef} className="contact-form__captcha" />
    </>
  )
}
