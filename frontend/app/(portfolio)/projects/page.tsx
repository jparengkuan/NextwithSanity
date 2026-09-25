import type {Metadata} from 'next'

import ArrowIcon from '@/app/components/portfolio/ArrowIcon'
import {homeQuery, projectsPageQuery, projectsQuery} from '@/sanity/lib/queries'
import {sanityFetch} from '@/sanity/lib/live'
import {dataAttr} from '@/sanity/lib/utils'

// Shown until the Projects Page document is published in the Studio.
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
  const socials = home?.socials ?? []

  return (
    <>
      <main id="main-content" className="shell main-content">
        <header className="page-intro motion-enter">
          <p className="eyebrow">{page?.eyebrow || fallback.eyebrow}</p>
          <h1>{page?.heading || fallback.heading}</h1>
          <p>{page?.intro || fallback.intro}</p>
        </header>

        {projects.length === 0 ? (
          <p className="empty-state">No projects yet. Add one under Projects in the Studio.</p>
        ) : (
          <div className="portfolio-list" aria-label={`${projects.length} projects`}>
            {projects.map((project, i) => (
              <article
                key={project._id}
                className="portfolio-row motion-enter"
                data-sanity={dataAttr({id: project._id, type: 'project', path: 'title'}).toString()}
              >
                <div className="portfolio-row__meta">
                  <p className="item-index" aria-hidden="true">
                    {String(projects.length - i).padStart(2, '0')}
                  </p>
                  <h2>{project.title}</h2>
                  {project.status && <p className="item-status">{project.status}</p>}
                </div>
                <div className="portfolio-row__content">
                  {project.summary && <p className="item-summary">{project.summary}</p>}
                  {project.details && project.details.length > 0 && (
                    <ul className="detail-list">
                      {project.details.map((detail, j) => (
                        <li key={j}>{detail}</li>
                      ))}
                    </ul>
                  )}
                  {Boolean(project.tags?.length || project.links?.length) && (
                    <div className="item-footer">
                      <p className="tag-list" aria-label="Technologies">
                        {project.tags?.join(' · ')}
                      </p>
                      {project.links && project.links.length > 0 && (
                        <ul className="item-links" aria-label={`${project.title} links`}>
                          {project.links.map((link) => (
                            <li key={link._key}>
                              <a
                                className="text-link text-link--external"
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`${project.title} ${link.label} (opens in a new tab)`}
                              >
                                {link.label}
                                <ArrowIcon />
                              </a>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {socials.length > 0 && (
        <footer className="site-footer">
          <div className="shell site-footer__inner">
            <p className="eyebrow">Socials</p>
            <ul className="social-links" aria-label="Social profiles">
              {socials.map((social) => (
                <li key={social._key}>
                  <a
                    className="text-link text-link--external"
                    href={social.url}
                    target="_blank"
                    rel="me noopener noreferrer"
                    aria-label={`${social.label} (opens in a new tab)`}
                  >
                    {social.label}
                    <ArrowIcon />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </footer>
      )}
    </>
  )
}
