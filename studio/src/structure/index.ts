import {CogIcon, DocumentsIcon, EnvelopeIcon, HomeIcon, ProjectsIcon} from '@sanity/icons'
import type {ComponentType} from 'react'
import type {StructureBuilder, StructureResolver} from 'sanity/structure'
import pluralize from 'pluralize-esm'

/**
 * Structure builder is useful whenever you want to control how documents are grouped and
 * listed in the studio or for adding additional in-studio previews or content to documents.
 * Learn more: https://www.sanity.io/docs/structure-builder-introduction
 */

type Singleton = {type: string; id: string; title: string; icon: ComponentType}

// Fixed pages with exactly one document each, shown under "Pages"
const PAGE_SINGLETONS: Singleton[] = [
  {type: 'home', id: 'home', title: 'Home', icon: HomeIcon},
  {type: 'projectsPage', id: 'projectsPage', title: 'Projects', icon: ProjectsIcon},
  {type: 'blogsPage', id: 'blogsPage', title: 'Blogs', icon: DocumentsIcon},
  {type: 'contactPage', id: 'contactPage', title: 'Contact', icon: EnvelopeIcon},
]

const SETTINGS: Singleton = {
  type: 'settings',
  id: 'siteSettings',
  title: 'Site Settings',
  icon: CogIcon,
}

// Types placed explicitly below, hidden from the automatic document type list
const HIDDEN_TYPES = [
  ...PAGE_SINGLETONS.map((singleton) => singleton.type),
  SETTINGS.type,
  'page',
  'assist.instruction.context',
]

// Opens the one document directly instead of a list. Learn more about Singletons: https://www.sanity.io/docs/create-a-link-to-a-single-edit-page-in-your-main-document-type-list
function singletonItem(S: StructureBuilder, {type, id, title, icon}: Singleton) {
  return S.listItem().title(title).icon(icon).child(S.document().schemaType(type).documentId(id))
}

export const structure: StructureResolver = (S: StructureBuilder) =>
  S.list()
    .title('Website Content')
    .items([
      // Fixed pages and the free-form page builder pages, grouped together
      S.listItem()
        .title('Pages')
        .icon(DocumentsIcon)
        .child(
          S.list()
            .title('Pages')
            .items([
              ...PAGE_SINGLETONS.map((singleton) => singletonItem(S, singleton)),
              S.divider(),
              S.documentTypeListItem('page').title('Other pages'),
            ]),
        ),
      ...S.documentTypeListItems()
        .filter((listItem) => !HIDDEN_TYPES.includes(listItem.getId() ?? ''))
        .map((listItem) => {
          // Posts are shown on /blogs, so label them that way
          if (listItem.getId() === 'post') return listItem.title('Blogs')
          return listItem.title(pluralize(listItem.getTitle() as string))
        }),
      singletonItem(S, SETTINGS),
    ])
