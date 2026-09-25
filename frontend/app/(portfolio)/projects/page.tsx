import type {Metadata} from 'next'

import PageIntro from '@/app/components/portfolio/PageIntro'
import SiteFooter from '@/app/components/portfolio/SiteFooter'
import {homeQuery, projectsPageQuery, projectsQuery} from '@/sanity/lib/queries'
import {sanityFetch} from '@/sanity/lib/live'
import ProjectRow from './ProjectRow'

const fallback = {
  eyebrow: 'Work',
  heading: 'Projects',
  intro: 'Things I’ve built, shipped, and tinkered with.',
}

export async function generateMetadata(): Promise<Metadata> {
  const {data: page} = await sanityFetch({query: projectsPageQuery, stega: false})
  return {title: page?.heading || fallback.heading}
}

export default async function ProjectsPage() {
  const [{data: page}, {data: projects}, {data: home}] = await Promise.all([
    sanityFetch({query: projectsPageQuery}),
    sanityFetch({query: projectsQuery}),
    sanityFetch({query: homeQuery}),
  ])

  return (
    <>
      <main id="main-content" className="shell main-content">
        <PageIntro content={page} fallback={fallback} />

        {projects.length === 0 ? (
          <p className="empty-state">No projects yet. Add one under Projects in the Studio.</p>
        ) : (
          <div className="portfolio-list" aria-label={`${projects.length} projects`}>
            {projects.map((project, i) => (
              // Newest first, numbered down so the newest has the highest number
              <ProjectRow key={project._id} project={project} index={projects.length - i} />
            ))}
          </div>
        )}
      </main>
      <SiteFooter socials={home?.socials ?? []} />
    </>
  )
}
