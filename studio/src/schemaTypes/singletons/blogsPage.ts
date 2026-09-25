import {DocumentsIcon} from '@sanity/icons'
import {defineType} from 'sanity'

import {pageIntroFields} from '../fields'

/**
 * Blogs Page schema Singleton. Holds the intro shown at the top of /blogs.
 */

export const blogsPage = defineType({
  name: 'blogsPage',
  title: 'Blogs Page',
  type: 'document',
  icon: DocumentsIcon,
  fields: [
    ...pageIntroFields({
      eyebrow: 'Notes',
      heading: 'Blogs',
      intro: 'Things I write and pieces I think are worth reading.',
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Blogs Page'}
    },
  },
})
