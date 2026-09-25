import {defineQuery} from 'next-sanity'

// Resolves page/post references in a link to their slugs (see linkResolver)
const linkReference = /* groq */ `
  _type == "link" => {
    "page": page->slug.current,
    "post": post->slug.current
  }
`

const linkFields = /* groq */ `
  link {
      ...,
      ${linkReference}
      }
`

// Portable Text blocks with their link annotations resolved
const blocksWithLinks = /* groq */ `
  ...,
  markDefs[]{
    ...,
    ${linkReference}
  }
`

// Eyebrow, heading and intro shared by the Projects, Blogs and Contact page singletons
const pageIntroFields = /* groq */ `_id, eyebrow, heading, intro`

export const settingsQuery = defineQuery(`*[_type == "settings"][0]`)

export const contactEmailQuery = defineQuery(`
  *[_type == "settings"][0].contactEmail
`)

export const resumeQuery = defineQuery(`
  *[_type == "settings"][0].resume.asset->url
`)

export const homeQuery = defineQuery(`
  *[_type == "home" && _id == "home"][0]{
    ...,
    bio[]{
      ${blocksWithLinks}
    }
  }
`)

export const projectsPageQuery = defineQuery(`
  *[_type == "projectsPage" && _id == "projectsPage"][0]{${pageIntroFields}}
`)

export const contactPageQuery = defineQuery(`
  *[_type == "contactPage" && _id == "contactPage"][0]{${pageIntroFields}, successMessage}
`)

export const blogsPageQuery = defineQuery(`
  *[_type == "blogsPage" && _id == "blogsPage"][0]{${pageIntroFields}}
`)

export const blogListQuery = defineQuery(`
  *[_type == "post" && (defined(slug.current) || defined(externalUrl))] | order(date desc, _updatedAt desc) {
    _id,
    "title": coalesce(title, "Untitled"),
    "slug": slug.current,
    externalUrl,
    externalAuthor,
    externalSite,
    excerpt,
    tags,
    "date": coalesce(date, _updatedAt),
    "author": author->{firstName, lastName}
  }
`)

export const blogPostQuery = defineQuery(`
  *[_type == "post" && slug.current == $slug && !defined(externalUrl)][0]{
    _id,
    "title": coalesce(title, "Untitled"),
    excerpt,
    coverImage,
    "date": coalesce(date, _updatedAt),
    "author": author->{firstName, lastName},
    content[]{
      ${blocksWithLinks}
    }
  }
`)

export const blogSlugsQuery = defineQuery(`
  *[_type == "post" && defined(slug.current) && !defined(externalUrl)]{"slug": slug.current}
`)

export const projectsQuery = defineQuery(`
  *[_type == "project" && defined(title)] | order(date desc, _createdAt desc) {
    _id,
    title,
    status,
    summary,
    details,
    tags,
    links
  }
`)

export const getPageQuery = defineQuery(`
  *[_type == 'page' && slug.current == $slug][0]{
    _id,
    _type,
    name,
    slug,
    heading,
    subheading,
    "pageBuilder": pageBuilder[]{
      ...,
      _type == "callToAction" => {
        ...,
        button {
          ...,
          ${linkFields}
        }
      },
      _type == "infoSection" => {
        content[]{
          ${blocksWithLinks}
        }
      },
    },
  }
`)

export const sitemapData = defineQuery(`
  *[_type == "page" || _type == "post" && defined(slug.current)] | order(_type asc) {
    "slug": slug.current,
    _type,
    _updatedAt,
  }
`)

export const pagesSlugs = defineQuery(`
  *[_type == "page" && defined(slug.current)]
  {"slug": slug.current}
`)
