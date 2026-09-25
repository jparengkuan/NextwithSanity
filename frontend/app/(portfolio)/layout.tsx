import Link from 'next/link'

import NameSwap from '@/app/components/portfolio/NameSwap'
import MobileNav from '@/app/components/portfolio/MobileNav'
import NavLink, {type NavItem} from '@/app/components/portfolio/NavLink'
import {homeQuery, resumeQuery} from '@/sanity/lib/queries'
import {sanityFetch} from '@/sanity/lib/live'
import './portfolio.css'

// Fallback until Name is filled in under Home in the Studio.
const fallbackName = 'Your name'

const pageNavItems: NavItem[] = [
  {href: '/projects', label: 'Projects'},
  {href: '/blogs', label: 'Blogs'},
  {href: '/contact', label: 'Contact'},
]

export default async function PortfolioLayout({children}: {children: React.ReactNode}) {
  const [{data: home}, {data: resumeUrl}] = await Promise.all([
    sanityFetch({query: homeQuery}),
    sanityFetch({query: resumeQuery, stega: false}),
  ])
  const name = home?.name || fallbackName
  // Resume link only shows once a PDF is uploaded under Site Settings
  const navItems: NavItem[] = resumeUrl
    ? [...pageNavItems, {href: resumeUrl, label: 'Resume', external: true}]
    : pageNavItems

  return (
    <div className="portfolio">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <header className="site-header">
        <div className="shell site-header__inner">
          <Link className="site-brand name-swap-trigger" href="/" aria-label={`${name}, home`}>
            <NameSwap name={name} handle={home?.handle} />
          </Link>
          <nav className="primary-nav primary-nav--desktop" aria-label="Primary navigation">
            <ul>
              {navItems.map((item) => (
                <li key={item.href}>
                  <NavLink item={item} />
                </li>
              ))}
            </ul>
          </nav>
          <MobileNav items={navItems} />
        </div>
      </header>
      {children}
    </div>
  )
}
