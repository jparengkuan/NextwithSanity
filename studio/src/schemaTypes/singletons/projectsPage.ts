import {ProjectsIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

/**
 * Projects Page schema Singleton. Holds the intro shown at the top of /projects.
 */

export const projectsPage = defineType({
  name: 'projectsPage',
  title: 'Projects Page',
  type: 'document',
  icon: ProjectsIcon,
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      description: 'Small coral label above the heading.',
      type: 'string',
      initialValue: 'Work',
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      initialValue: 'Projects',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'intro',
      title: 'Intro',
      description: 'Short line under the heading.',
      type: 'text',
      rows: 2,
      initialValue: 'Things I’ve built, shipped, and tinkered with.',
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Projects Page'}
    },
  },
})
