import {HomeIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

/**
 * Home schema Singleton. Holds the content shown on the homepage (/).
 */

export const home = defineType({
  name: 'home',
  title: 'Home',
  type: 'document',
  icon: HomeIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      description: 'Shown in the homepage heading and header, e.g. "Jim :}".',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'handle',
      title: 'Handle',
      description: 'Shown when hovering the name, e.g. "@yourhandle".',
      type: 'string',
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      description: 'Short line under the name.',
      type: 'string',
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      description: 'Each paragraph is its own block; select text to add a link.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [],
          lists: [],
          marks: {
            decorators: [],
            annotations: [defineArrayMember({name: 'link', type: 'link'})],
          },
        }),
      ],
    }),
    defineField({
      name: 'socials',
      title: 'Socials',
      description: 'Links listed under "Socials".',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'social',
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
  preview: {
    prepare() {
      return {title: 'Home'}
    },
  },
})
