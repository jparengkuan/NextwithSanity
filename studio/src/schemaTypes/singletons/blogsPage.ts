import {DocumentsIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

/**
 * Blogs Page schema Singleton. Holds the intro shown at the top of /blogs.
 */

export const blogsPage = defineType({
  name: 'blogsPage',
  title: 'Blogs Page',
  type: 'document',
  icon: DocumentsIcon,
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      description: 'Small coral label above the heading.',
      type: 'string',
      initialValue: 'Notes',
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      initialValue: 'Blogs',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'intro',
      title: 'Intro',
      description: 'Short line under the heading.',
      type: 'text',
      rows: 2,
      initialValue: 'Things I write and pieces I think are worth reading.',
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Blogs Page'}
    },
  },
})
