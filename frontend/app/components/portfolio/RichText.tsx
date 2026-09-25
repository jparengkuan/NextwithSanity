import Link from 'next/link'
import type {ComponentProps} from 'react'
import {PortableText, type PortableTextComponents} from 'next-sanity'

import {linkResolver} from '@/sanity/lib/utils'
import {DereferencedLink} from '@/sanity/lib/types'
import ArrowIcon from './ArrowIcon'
import {isExternalUrl} from './links'

function components(linkClassName?: string): PortableTextComponents {
  return {
    marks: {
      link: ({children, value}) => {
        const href = linkResolver(value as DereferencedLink)
        if (!href) return <>{children}</>
        const external = isExternalUrl(href)
        return (
          <Link
            className={linkClassName}
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
}

/** Portable Text with links resolved to pages, posts or URLs; external ones get the ↗ arrow. */
export default function RichText({
  value,
  linkClassName,
}: {
  value: ComponentProps<typeof PortableText>['value']
  linkClassName?: string
}) {
  return <PortableText value={value} components={components(linkClassName)} />
}
