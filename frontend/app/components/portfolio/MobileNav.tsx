'use client'

import Link from 'next/link'
import {usePathname} from 'next/navigation'
import {useEffect, useRef} from 'react'

import type {NavItem} from './NavLink'

// Slide-in drawer built on the native popover API; shown below 48rem instead of the inline nav.
export default function MobileNav({items}: {items: NavItem[]}) {
  const pathname = usePathname()
  const drawerRef = useRef<HTMLElement>(null)

  // Client-side navigation doesn't reload the page, so close the drawer ourselves.
  useEffect(() => {
    const drawer = drawerRef.current
    if (drawer?.matches(':popover-open')) drawer.hidePopover()
  }, [pathname])

  return (
    <>
      <button
        className="mobile-nav__trigger"
        type="button"
        popoverTarget="mobile-navigation"
        aria-label="Open navigation"
      >
        <span className="mobile-nav__icon" aria-hidden="true">
          <span />
        </span>
      </button>
      <nav
        ref={drawerRef}
        id="mobile-navigation"
        className="mobile-nav__drawer"
        popover="auto"
        aria-label="Mobile navigation"
      >
        <div className="mobile-nav__header">
          <p className="eyebrow">Menu</p>
          <button
            className="mobile-nav__close"
            type="button"
            popoverTarget="mobile-navigation"
            popoverTargetAction="hide"
            aria-label="Close navigation"
          >
            <span aria-hidden="true" />
          </button>
        </div>
        <ul className="mobile-nav__links">
          {items.map((item, i) => {
            const isCurrent = pathname === item.href || pathname.startsWith(`${item.href}/`)
            const content = (
              <>
                <span aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <span className="mobile-nav__label">{item.label}</span>
              </>
            )
            return (
              <li key={item.href} style={{'--nav-index': i} as React.CSSProperties}>
                {item.external ? (
                  <a
                    href={item.href}
                    className="mobile-nav__link"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${item.label} (opens in a new tab)`}
                    onClick={() => drawerRef.current?.hidePopover()}
                  >
                    {content}
                  </a>
                ) : (
                  <Link
                    href={item.href}
                    className="mobile-nav__link"
                    aria-current={isCurrent ? 'page' : undefined}
                  >
                    {content}
                  </Link>
                )}
              </li>
            )
          })}
        </ul>
      </nav>
    </>
  )
}
