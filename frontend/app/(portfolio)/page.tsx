import Link from 'next/link'
import {PortableText, type PortableTextComponents} from 'next-sanity'

import {homeQuery} from '@/sanity/lib/queries'
import {sanityFetch} from '@/sanity/lib/live'
import {dataAttr, linkResolver} from '@/sanity/lib/utils'
import {DereferencedLink} from '@/sanity/lib/types'
import ArrowIcon from '@/app/components/portfolio/ArrowIcon'
import NameSwap from '@/app/components/portfolio/NameSwap'

// Shown until the fields are filled in under Home in the Studio.
const fallback = {
  name: 'Your name',
  tagline: 'Software Engineer',
}

const bioComponents: PortableTextComponents = {
  marks: {
    link: ({children, value}) => {
      const href = linkResolver(value as DereferencedLink)
      if (!href) return <>{children}</>
      const external = /^https?:\/\//.test(href)
      return (
        <Link
          className="inline-link"
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

export default async function Page() {
  const {data: home} = await sanityFetch({query: homeQuery})

  const name = home?.name || fallback.name
  const handle = home?.handle
  const tagline = home?.tagline || fallback.tagline
  const socials = home?.socials ?? []
  const attr = (path: string) =>
    home?._id ? dataAttr({id: home._id, type: 'home', path}).toString() : undefined

  return (
    <main id="main-content" className="shell main-content main-content--minimal">
      <section className="compact-home motion-enter" aria-labelledby="home-title">
        <header className="compact-home__header">
          <h1 id="home-title" className="name-swap-trigger" aria-label={name}>
            <NameSwap name={name} handle={handle} />
          </h1>
          <p>{tagline}</p>
        </header>
        <div className="compact-home__copy" data-sanity={attr('bio')}>
          {home?.bio?.length ? (
            <PortableText value={home.bio} components={bioComponents} />
          ) : (
            <p>Add your bio under Home → Bio in the Studio.</p>
          )}
        </div>
        {socials.length > 0 && (
          <div className="compact-home__social-block">
            <p className="eyebrow">Socials</p>
            <ul
              className="compact-home__socials"
              aria-label="Social profiles"
              data-sanity={attr('socials')}
            >
              {socials.map((social) => (
                <li key={social._key}>
                  <a
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
        )}
      </section>
    </main>
  )
}
