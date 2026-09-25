import {ProjectsIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

/**
 * Project schema. Listed on /projects, newest first.
 */

export const project = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  icon: ProjectsIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Date',
      description: 'Used to sort projects, newest first.',
      type: 'date',
      initialValue: () => new Date().toISOString().split('T')[0],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      description: 'Short highlight under the title, e.g. "Hackathon winner" or "In progress".',
      type: 'string',
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      description: 'One sentence describing the project.',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'details',
      title: 'Details',
      description: 'Bullet points.',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      description: 'Technologies or topics.',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      options: {layout: 'tags'},
    }),
    defineField({
      name: 'links',
      title: 'Links',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'projectLink',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {select: {title: 'label', subtitle: 'url'}},
        }),
      ],
    }),
  ],
  orderings: [{title: 'Date, newest', name: 'dateDesc', by: [{field: 'date', direction: 'desc'}]}],
  preview: {
    select: {title: 'title', subtitle: 'status'},
  },
})
