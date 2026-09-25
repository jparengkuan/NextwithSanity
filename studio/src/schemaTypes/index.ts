import {person} from './documents/person'
import {page} from './documents/page'
import {post} from './documents/post'
import {project} from './documents/project'
import {callToAction} from './objects/callToAction'
import {infoSection} from './objects/infoSection'
import {settings} from './singletons/settings'
import {home} from './singletons/home'
import {projectsPage} from './singletons/projectsPage'
import {blogsPage} from './singletons/blogsPage'
import {contactPage} from './singletons/contactPage'
import {link} from './objects/link'
import {blockContent} from './objects/blockContent'
import button from './objects/button'
import {blockContentTextOnly} from './objects/blockContentTextOnly'

// Export an array of all the schema types.  This is used in the Sanity Studio configuration. https://www.sanity.io/docs/studio/schema-types

export const schemaTypes = [
  // Singletons
  home,
  projectsPage,
  blogsPage,
  contactPage,
  settings,
  // Documents
  page,
  post,
  project,
  person,
  // Objects
  button,
  blockContent,
  blockContentTextOnly,
  infoSection,
  callToAction,
  link,
]
