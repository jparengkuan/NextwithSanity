export type ContactValues = {name: string; email: string; message: string}

export type FieldErrors = Partial<Record<keyof ContactValues, string>>

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function readContactValues(formData: FormData): ContactValues {
  const read = (field: keyof ContactValues) => String(formData.get(field) ?? '').trim()
  return {name: read('name'), email: read('email'), message: read('message')}
}

export function validateContact({name, email, message}: ContactValues): FieldErrors {
  const errors: FieldErrors = {}

  if (!name) errors.name = 'Please enter your name.'
  else if (name.length > 200) errors.name = 'That name is too long.'

  if (!EMAIL_PATTERN.test(email)) errors.email = 'Please enter a valid email address.'

  if (message.length < 10) errors.message = 'Please write at least a few words.'
  else if (message.length > 5000) errors.message = 'Please keep it under 5000 characters.'

  return errors
}
