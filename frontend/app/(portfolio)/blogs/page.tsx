import type {Metadata} from 'next'

import PageIntro from '@/app/components/portfolio/PageIntro'
import {blogListQuery, blogsPageQuery} from '@/sanity/lib/queries'
import {sanityFetch} from '@/sanity/lib/live'
import BlogRow from './BlogRow'

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
      <PageIntro content={page} fallback={fallback} />

      {posts.length === 0 ? (
        <p className="empty-state">No posts yet. Add one under Blogs in the Studio.</p>
      ) : (
        <div className="blog-list">
          {posts.map((post) => (
            <BlogRow key={post._id} post={post} />
          ))}
        </div>
      )}
    </main>
  )
}
