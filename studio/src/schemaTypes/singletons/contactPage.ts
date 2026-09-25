import {EnvelopeIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

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
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      description: 'Small coral label above the heading.',
      type: 'string',
      initialValue: 'Contact',
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      initialValue: 'Get in touch',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'intro',
      title: 'Intro',
      description: 'Short line under the heading.',
      type: 'text',
      rows: 2,
      initialValue: 'Have a question, an idea, or just want to say hi? Send me a message.',
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
