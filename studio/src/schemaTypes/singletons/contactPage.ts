import {EnvelopeIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

import {pageIntroFields} from '../fields'

/**
 * Contact Page schema Singleton. Holds the copy on /contact.
 * Where messages are delivered is set in Site Settings ("Contact form: deliver to").
 */

export const contactPage = defineType({
  name: 'contactPage',
  title: 'Contact Page',
  type: 'document',
  icon: EnvelopeIcon,
  fields: [
    ...pageIntroFields({
      eyebrow: 'Contact',
      heading: 'Get in touch',
      intro: 'Have a question, an idea, or just want to say hi? Send me a message.',
    }),
    defineField({
      name: 'successMessage',
      title: 'Success message',
      description: 'Shown after a message is sent.',
      type: 'string',
      initialValue: 'Thanks! Your message is on its way. I’ll get back to you soon.',
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Contact Page'}
    },
  },
})
