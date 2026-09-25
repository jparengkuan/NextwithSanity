import {CogIcon, DocumentsIcon, EnvelopeIcon, HomeIcon, ProjectsIcon} from '@sanity/icons'
import type {StructureBuilder, StructureResolver} from 'sanity/structure'
import pluralize from 'pluralize-esm'

/**
 * Structure builder is useful whenever you want to control how documents are grouped and
 * listed in the studio or for adding additional in-studio previews or content to documents.
 * Learn more: https://www.sanity.io/docs/structure-builder-introduction
 */

// Listed under "Pages" (or as Site Settings) instead of as their own document types
const DISABLED_TYPES = [
  'home',
  'projectsPage',
  'blogsPage',
  'contactPage',
  'page',
  'settings',
  'assist.instruction.context',
]

export const structure: StructureResolver = (S: StructureBuilder) =>
  S.list()
    .title('Website Content')
    .items([
      // Fixed pages (singletons) and the free-form page builder pages, grouped together
      S.listItem()
        .title('Pages')
        .icon(DocumentsIcon)
        .child(
          S.list()
            .title('Pages')
            .items([
              S.listItem()
                .title('Home')
                .child(S.document().schemaType('home').documentId('home'))
                .icon(HomeIcon),
              S.listItem()
                .title('Projects')
                .child(S.document().schemaType('projectsPage').documentId('projectsPage'))
                .icon(ProjectsIcon),
              S.listItem()
                .title('Blogs')
                .child(S.document().schemaType('blogsPage').documentId('blogsPage'))
                .icon(DocumentsIcon),
              S.listItem()
                .title('Contact')
                .child(S.document().schemaType('contactPage').documentId('contactPage'))
                .icon(EnvelopeIcon),
              S.divider(),
              S.documentTypeListItem('page').title('Other pages'),
            ]),
        ),
      ...S.documentTypeListItems()
        // Remove types listed above and "assist.instruction.context" from the list of content types
        .filter((listItem: any) => !DISABLED_TYPES.includes(listItem.getId()))
        // Pluralize the title of each document type.  This is not required but just an option to consider.
        .map((listItem) => {
          // Posts are shown on /blogs, so label them that way
          if (listItem.getId() === 'post') return listItem.title('Blogs')
          return listItem.title(pluralize(listItem.getTitle() as string))
        }),
      // Settings Singleton in order to view/edit the one particular document for Settings.  Learn more about Singletons: https://www.sanity.io/docs/create-a-link-to-a-single-edit-page-in-your-main-document-type-list
      S.listItem()
        .title('Site Settings')
        .child(S.document().schemaType('settings').documentId('siteSettings'))
        .icon(CogIcon),
    ])
