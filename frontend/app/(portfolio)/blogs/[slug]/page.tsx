import type {Metadata} from 'next'
import Link from 'next/link'
import {notFound} from 'next/navigation'
import {PortableText, type PortableTextComponents} from 'next-sanity'

import ArrowIcon from '@/app/components/portfolio/ArrowIcon'
import {formatDate} from '@/app/components/portfolio/formatDate'
import Image from '@/app/components/SanityImage'
import {blogPostQuery, blogSlugsQuery} from '@/sanity/lib/queries'
import {sanityFetch} from '@/sanity/lib/live'
import {linkResolver, resolveOpenGraphImage} from '@/sanity/lib/utils'
import {DereferencedLink} from '@/sanity/lib/types'

export async function generateStaticParams() {
  const {data} = await sanityFetch({
    query: blogSlugsQuery,
    perspective: 'published',
    stega: false,
  })
  return data
}

export async function generateMetadata(props: PageProps<'/blogs/[slug]'>): Promise<Metadata> {
  const params = await props.params
  const {data: post} = await sanityFetch({query: blogPostQuery, params, stega: false})
  const ogImage = resolveOpenGraphImage(post?.coverImage)

  return {
    title: post?.title,
    description: post?.excerpt,
    openGraph: ogImage ? {images: [ogImage]} : undefined,
  }
}

const bodyComponents: PortableTextComponents = {
  marks: {
    link: ({children, value}) => {
      const href = linkResolver(value as DereferencedLink)
      if (!href) return <>{children}</>
      const external = /^https?:\/\//.test(href)
      return (
        <Link
          href={href}
          target={external ? '_blank' : undefined}
          rel={external ? 'noopener noreferrer' : undefined}
        >
          {children}
          {external && <ArrowIcon />}
        </Link>
      )
    },
  },
}

export default async function BlogPostPage(props: PageProps<'/blogs/[slug]'>) {
  const params = await props.params
  const {data: post} = await sanityFetch({query: blogPostQuery, params})

  if (!post?._id) {
    return notFound()
  }

  return (
    <main id="main-content" className="shell main-content">
      <article className="article motion-enter">
        <header className="article__header">
          <Link className="text-link" href="/blogs">
            All Blogs
          </Link>
          <p className="eyebrow">Note</p>
          <h1>{post.title}</h1>
          {post.excerpt && <p className="article__description">{post.excerpt}</p>}
          <div className="article__dates">
            <time dateTime={post.date}>Published {formatDate(post.date, 'MMMM d, yyyy')}</time>
          </div>
        </header>
        <div className="article-body">
          {post.coverImage?.asset?._ref && (
            <Image
              id={post.coverImage.asset._ref}
              alt={post.coverImage.alt || ''}
              width={1024}
              height={538}
              mode="cover"
              hotspot={post.coverImage.hotspot}
              crop={post.coverImage.crop}
            />
          )}
          {post.content?.length ? (
            <PortableText value={post.content} components={bodyComponents} />
          ) : null}
        </div>
      </article>
    </main>
  )
}
