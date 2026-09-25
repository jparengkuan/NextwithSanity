'use client'

import Link from 'next/link'
import {usePathname} from 'next/navigation'

import {isActivePath} from './links'

// `external` items (e.g. the resume PDF) open in a new tab instead of routing within the site.
export type NavItem = {href: string; label: string; external?: boolean}

type NavLinkProps = {
  item: NavItem
  className?: string
  children?: React.ReactNode
  onClick?: () => void
}

/** A header or menu link: routes within the site, or opens external items in a new tab. */
export default function NavLink({item, className = 'nav-link', children, onClick}: NavLinkProps) {
  const pathname = usePathname()
  const content = children ?? item.label

  if (item.external) {
    return (
      <a
        href={item.href}
        className={className}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${item.label} (opens in a new tab)`}
        onClick={onClick}
      >
        {content}
      </a>
    )
  }

  return (
    <Link
      href={item.href}
      className={className}
      aria-current={isActivePath(pathname, item.href) ? 'page' : undefined}
      onClick={onClick}
    >
      {content}
    </Link>
  )
}
