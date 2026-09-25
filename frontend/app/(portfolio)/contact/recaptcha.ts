import 'server-only'

import {headers} from 'next/headers'

import {RECAPTCHA_ACTION} from './constants'

// 0 = almost certainly a bot, 1 = almost certainly a person
const MIN_SCORE = 0.3

type Assessment = {
  tokenProperties?: {valid?: boolean; invalidReason?: string; action?: string}
  riskAnalysis?: {score?: number; reasons?: string[]}
}

/**
 * Checks the token from the "I'm not a robot" checkbox by creating a reCAPTCHA Enterprise assessment.
 * Needs NEXT_PUBLIC_RECAPTCHA_SITE_KEY, RECAPTCHA_PROJECT_ID and RECAPTCHA_API_KEY; when any
 * is missing the check is skipped so local development works without Google credentials.
 */
export async function verifyRecaptcha(token: string | null): Promise<boolean> {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY
  const projectId = process.env.RECAPTCHA_PROJECT_ID
  const apiKey = process.env.RECAPTCHA_API_KEY

  if (!siteKey || !projectId || !apiKey) {
    console.warn('Contact form: reCAPTCHA not configured, skipping check')
    return true
  }
  if (!token) return false

  const requestHeaders = await headers()
  const res = await fetch(
    `https://recaptchaenterprise.googleapis.com/v1/projects/${projectId}/assessments?key=${apiKey}`,
    {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        event: {
          token,
          siteKey,
          expectedAction: RECAPTCHA_ACTION,
          userAgent: requestHeaders.get('user-agent') ?? undefined,
          userIpAddress: requestHeaders.get('x-forwarded-for')?.split(',')[0].trim() || undefined,
        },
      }),
      cache: 'no-store',
    },
  )

  if (!res.ok) {
    console.error('Contact form: reCAPTCHA assessment failed', res.status, await res.text())
    return false
  }

  const assessment = (await res.json()) as Assessment
  const {tokenProperties, riskAnalysis} = assessment
  // The ticked checkbox is the main signal; also drop very low risk scores when Google gives one
  const passed =
    tokenProperties?.valid === true &&
    tokenProperties.action === RECAPTCHA_ACTION &&
    (riskAnalysis?.score === undefined || riskAnalysis.score >= MIN_SCORE)

  if (!passed) {
    console.warn('Contact form: reCAPTCHA rejected', {
      invalidReason: tokenProperties?.invalidReason,
      action: tokenProperties?.action,
      score: riskAnalysis?.score,
      reasons: riskAnalysis?.reasons,
    })
  }
  return passed
}
