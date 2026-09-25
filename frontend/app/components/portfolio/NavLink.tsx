'use client'

import Link from 'next/link'
import {usePathname} from 'next/navigation'

// `external` items (e.g. the resume PDF) open in a new tab instead of routing within the site.
export type NavItem = {href: string; label: string; external?: boolean}

export default function NavLink({item}: {item: NavItem}) {
  const pathname = usePathname()
  const isCurrent = pathname === item.href || pathname.startsWith(`${item.href}/`)

  if (item.external) {
    return (
      <a
        href={item.href}
        className="nav-link"
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${item.label} (opens in a new tab)`}
      >
        {item.label}
      </a>
    )
  }

  return (
    <Link href={item.href} className="nav-link" aria-current={isCurrent ? 'page' : undefined}>
      {item.label}
    </Link>
  )
}
