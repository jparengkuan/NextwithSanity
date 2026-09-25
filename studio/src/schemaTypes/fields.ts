import {defineArrayMember, defineField} from 'sanity'

type PageIntroDefaults = {eyebrow: string; heading: string; intro: string}

/** Eyebrow, heading and intro shown at the top of the Projects, Blogs and Contact pages. */
export function pageIntroFields(defaults: PageIntroDefaults) {
  return [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      description: 'Small coral label above the heading.',
      type: 'string',
      initialValue: defaults.eyebrow,
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      initialValue: defaults.heading,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'intro',
      title: 'Intro',
      description: 'Short line under the heading.',
      type: 'text',
      rows: 2,
      initialValue: defaults.intro,
    }),
  ]
}

/**
 * A label + URL item for link lists (socials, project links). `name` is stored as each
 * item's _type, so keep existing names to stay compatible with saved content.
 */
export function labeledLinkMember(name: string) {
  return defineArrayMember({
    type: 'object',
    name,
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
  })
}
