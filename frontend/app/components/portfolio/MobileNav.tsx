'use client'

import {usePathname} from 'next/navigation'
import {useEffect, useRef} from 'react'

import {formatIndex} from './links'
import NavLink, {type NavItem} from './NavLink'

// Slide-in drawer built on the native popover API; shown below 48rem instead of the inline nav.
export default function MobileNav({items}: {items: NavItem[]}) {
  const pathname = usePathname()
  const drawerRef = useRef<HTMLElement>(null)
  const closeDrawer = () => {
    const drawer = drawerRef.current
    if (drawer?.matches(':popover-open')) drawer.hidePopover()
  }

  // Client-side navigation doesn't reload the page, so close the drawer ourselves.
  useEffect(closeDrawer, [pathname])

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
          {items.map((item, i) => (
            <li key={item.href} style={{'--nav-index': i} as React.CSSProperties}>
              {/* External items open a new tab without navigating here, so close explicitly */}
              <NavLink
                item={item}
                className="mobile-nav__link"
                onClick={item.external ? closeDrawer : undefined}
              >
                <span aria-hidden="true">{formatIndex(i + 1)}</span>
                <span className="mobile-nav__label">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </>
  )
}
