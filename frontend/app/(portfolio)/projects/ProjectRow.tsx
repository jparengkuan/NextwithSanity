import ExternalLink from '@/app/components/portfolio/ExternalLink'
import {formatIndex} from '@/app/components/portfolio/links'
import type {ProjectsQueryResult} from '@/sanity.types'
import {dataAttr} from '@/sanity/lib/utils'

type Project = ProjectsQueryResult[number]

export default function ProjectRow({project, index}: {project: Project; index: number}) {
  const {title, status, summary, details, tags, links} = project
  const hasFooter = Boolean(tags?.length || links?.length)

  return (
    <article
      className="portfolio-row motion-enter"
      data-sanity={dataAttr({id: project._id, type: 'project', path: 'title'}).toString()}
    >
      <div className="portfolio-row__meta">
        <p className="item-index" aria-hidden="true">
          {formatIndex(index)}
        </p>
        <h2>{title}</h2>
        {status && <p className="item-status">{status}</p>}
      </div>
      <div className="portfolio-row__content">
        {summary && <p className="item-summary">{summary}</p>}
        {details && details.length > 0 && (
          <ul className="detail-list">
            {details.map((detail, i) => (
              <li key={i}>{detail}</li>
            ))}
          </ul>
        )}
        {hasFooter && (
          <div className="item-footer">
            <p className="tag-list" aria-label="Technologies">
              {tags?.join(' · ')}
            </p>
            {links && links.length > 0 && (
              <ul className="item-links" aria-label={`${title} links`}>
                {links.map((link) => (
                  <li key={link._key}>
                    <ExternalLink
                      href={link.url}
                      className="text-link text-link--external"
                      label={`${title} ${link.label}`}
                    >
                      {link.label}
                    </ExternalLink>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </article>
  )
}
