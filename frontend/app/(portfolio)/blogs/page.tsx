import type {Metadata} from 'next'
import Link from 'next/link'

import ArrowIcon from '@/app/components/portfolio/ArrowIcon'
import {formatDate} from '@/app/components/portfolio/formatDate'
import {blogListQuery, blogsPageQuery} from '@/sanity/lib/queries'
import {sanityFetch} from '@/sanity/lib/live'
import {dataAttr} from '@/sanity/lib/utils'

// Shown until the Blogs Page document is published in the Studio.
const fallback = {
  eyebrow: 'Notes',
  heading: 'Blogs',
  intro: 'Things I write and pieces I think are worth reading.',
}

export async function generateMetadata(): Promise<Metadata> {
  const {data: page} = await sanityFetch({query: blogsPageQuery, stega: false})
  return {title: page?.heading || fallback.heading}
}

export default async function BlogsPage() {
  const [{data: page}, {data: posts}] = await Promise.all([
    sanityFetch({query: blogsPageQuery}),
    sanityFetch({query: blogListQuery}),
  ])

  return (
    <main id="main-content" className="shell main-content">
      <header className="page-intro motion-enter">
        <p className="eyebrow">{page?.eyebrow || fallback.eyebrow}</p>
        <h1>{page?.heading || fallback.heading}</h1>
        <p>{page?.intro || fallback.intro}</p>
      </header>

      {posts.length === 0 ? (
        <p className="empty-state">No posts yet. Add one under Blogs in the Studio.</p>
      ) : (
        <div className="blog-list">
          {posts.map((post) => {
            const authorName = [post.author?.firstName, post.author?.lastName]
              .filter(Boolean)
              .join(' ')
            const byline = post.externalUrl
              ? [post.externalAuthor, post.externalSite].filter(Boolean).join(' · ')
              : authorName

            return (
              <article
                key={post._id}
                className="blog-row motion-enter"
                data-sanity={dataAttr({id: post._id, type: 'post', path: 'title'}).toString()}
              >
                <time dateTime={post.date}>{formatDate(post.date)}</time>
                <div className="blog-row__body">
                  <h2>
                    {post.externalUrl ? (
                      <a
                        className="heading-link"
                        href={post.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${post.title} (opens in a new tab)`}
                      >
                        {post.title}
                        <ArrowIcon />
                      </a>
                    ) : (
                      <Link className="heading-link" href={`/blogs/${post.slug}`}>
                        {post.title}
                      </Link>
                    )}
                  </h2>
                  {post.excerpt && <p>{post.excerpt}</p>}
                  {(byline || post.tags?.length) && (
                    <div className="blog-row__meta">
                      {byline && <span className="blog-row__byline">By {byline}</span>}
                      {post.tags && post.tags.length > 0 && (
                        <ul className="blog-tags" aria-label="Article tags">
                          {post.tags.map((tag) => (
                            <li key={tag}>{tag}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      )}
    </main>
  )
}
