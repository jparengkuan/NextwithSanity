import {ProjectsIcon} from '@sanity/icons'
import {defineType} from 'sanity'

import {pageIntroFields} from '../fields'

/**
 * Projects Page schema Singleton. Holds the intro shown at the top of /projects.
 */

export const projectsPage = defineType({
  name: 'projectsPage',
  title: 'Projects Page',
  type: 'document',
  icon: ProjectsIcon,
  fields: [
    ...pageIntroFields({
      eyebrow: 'Work',
      heading: 'Projects',
      intro: 'Things I’ve built, shipped, and tinkered with.',
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Projects Page'}
    },
  },
})
