import ArrowIcon from './ArrowIcon'

type ExternalLinkProps = {
  href: string
  children: React.ReactNode
  className?: string
  // Accessible name; defaults to the visible text when that's a plain string
  label?: string
  // rel="me" marks links to your own profiles
  me?: boolean
}

/** Link that opens in a new tab, with the coral ↗ arrow. */
export default function ExternalLink({href, children, className, label, me}: ExternalLinkProps) {
  const name = label ?? (typeof children === 'string' ? children : undefined)
  return (
    <a
      className={className}
      href={href}
      target="_blank"
      rel={me ? 'me noopener noreferrer' : 'noopener noreferrer'}
      aria-label={name ? `${name} (opens in a new tab)` : undefined}
    >
      {children}
      <ArrowIcon />
    </a>
  )
}
