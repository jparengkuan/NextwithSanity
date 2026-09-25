import Link from 'next/link'

import ExternalLink from '@/app/components/portfolio/ExternalLink'
import {formatDate} from '@/app/components/portfolio/formatDate'
import type {BlogListQueryResult} from '@/sanity.types'
import {dataAttr} from '@/sanity/lib/utils'

type Post = BlogListQueryResult[number]

// Own posts credit the author; external articles credit their author and site
function bylineFor(post: Post) {
  const parts = post.externalUrl
    ? [post.externalAuthor, post.externalSite]
    : [[post.author?.firstName, post.author?.lastName].filter(Boolean).join(' ')]
  return parts.filter(Boolean).join(' · ')
}

export default function BlogRow({post}: {post: Post}) {
  const byline = bylineFor(post)
  const tags = post.tags ?? []

  return (
    <article
      className="blog-row motion-enter"
      data-sanity={dataAttr({id: post._id, type: 'post', path: 'title'}).toString()}
    >
      <time dateTime={post.date}>{formatDate(post.date)}</time>
      <div className="blog-row__body">
        <h2>
          {post.externalUrl ? (
            <ExternalLink href={post.externalUrl} className="heading-link">
              {post.title}
            </ExternalLink>
          ) : (
            <Link className="heading-link" href={`/blogs/${post.slug}`}>
              {post.title}
            </Link>
          )}
        </h2>
        {post.excerpt && <p>{post.excerpt}</p>}
        {(byline || tags.length > 0) && (
          <div className="blog-row__meta">
            {byline && <span className="blog-row__byline">By {byline}</span>}
            {tags.length > 0 && (
              <ul className="blog-tags" aria-label="Article tags">
                {tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </article>
  )
}
