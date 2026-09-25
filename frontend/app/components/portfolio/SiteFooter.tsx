import SocialLinks, {type Social} from './SocialLinks'

export default function SiteFooter({socials}: {socials: Social[]}) {
  if (socials.length === 0) return null
  return (
    <footer className="site-footer">
      <div className="shell site-footer__inner">
        <p className="eyebrow">Socials</p>
        <SocialLinks
          socials={socials}
          listClassName="social-links"
          linkClassName="text-link text-link--external"
        />
      </div>
    </footer>
  )
}
