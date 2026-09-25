import {DocumentTextIcon} from '@sanity/icons'
import {format, parseISO} from 'date-fns'
import {defineField, defineType} from 'sanity'
import type {Post} from '../../../sanity.types'

/**
 * Post schema.  Define and edit the fields for the 'post' content type.
 * Learn more: https://www.sanity.io/docs/schema-types
 */

export const post = defineType({
  name: 'post',
  title: 'Blog Post',
  icon: DocumentTextIcon,
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'Used in the URL: /blogs/<slug>. Not needed for external articles.',
      options: {
        source: 'title',
        maxLength: 96,
        isUnique: (value, context) => context.defaultIsUnique(value, context),
      },
      validation: (rule) =>
        rule.custom((value, context) => {
          const document = context.document as {externalUrl?: string} | undefined
          return value?.current || document?.externalUrl
            ? true
            : 'Required unless External URL is set'
        }),
    }),
    defineField({
      name: 'externalUrl',
      title: 'External URL',
      description:
        'Set this to list an article hosted elsewhere. The blog list links straight to it instead of a page on this site.',
      type: 'url',
    }),
    defineField({
      name: 'externalAuthor',
      title: 'External author',
      description: 'Shown as "By <author>" for external articles.',
      type: 'string',
      hidden: ({document}) => !document?.externalUrl,
    }),
    defineField({
      name: 'externalSite',
      title: 'External site',
      description: 'Shown after the author, e.g. "example.com".',
      type: 'string',
      hidden: ({document}) => !document?.externalUrl,
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      description: 'Shown in coral under the summary, e.g. "Mine", "Recommended".',
      type: 'array',
      of: [{type: 'string'}],
      options: {layout: 'tags'},
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'blockContent',
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      description: 'Short summary shown in the blog list and under the article title.',
      type: 'text',
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: {
        hotspot: true,
        aiAssist: {
          imageDescriptionField: 'alt',
        },
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          description: 'Important for SEO and accessibility.',
          validation: (rule) => {
            // Custom validation to ensure alt text is provided if the image is present. https://www.sanity.io/docs/validation
            return rule.custom((alt, context) => {
              const document = context.document as Post
              if (document?.coverImage?.asset?._ref && !alt) {
                return 'Required'
              }
              return true
            })
          },
        },
      ],
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{type: 'person'}],
    }),
  ],
  // List preview configuration. https://www.sanity.io/docs/previews-list-views
  preview: {
    select: {
      title: 'title',
      authorFirstName: 'author.firstName',
      authorLastName: 'author.lastName',
      date: 'date',
      media: 'coverImage',
    },
    prepare({title, media, authorFirstName, authorLastName, date}) {
      const subtitles = [
        authorFirstName && authorLastName && `by ${authorFirstName} ${authorLastName}`,
        date && `on ${format(parseISO(date), 'LLL d, yyyy')}`,
      ].filter(Boolean)

      return {title, media, subtitle: subtitles.join(' ')}
    },
  },
})
