import ExternalLink from './ExternalLink'

export type Social = {_key: string; label: string; url: string}

type SocialLinksProps = {
  'socials': Social[]
  'listClassName': string
  'linkClassName'?: string
  'data-sanity'?: string
}

export default function SocialLinks({
  socials,
  listClassName,
  linkClassName,
  'data-sanity': dataSanity,
}: SocialLinksProps) {
  return (
    <ul className={listClassName} aria-label="Social profiles" data-sanity={dataSanity}>
      {socials.map((social) => (
        <li key={social._key}>
          <ExternalLink href={social.url} className={linkClassName} me>
            {social.label}
          </ExternalLink>
        </li>
      ))}
    </ul>
  )
}
