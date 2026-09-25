import NameSwap from '@/app/components/portfolio/NameSwap'
import RichText from '@/app/components/portfolio/RichText'
import SocialLinks from '@/app/components/portfolio/SocialLinks'
import {homeQuery} from '@/sanity/lib/queries'
import {sanityFetch} from '@/sanity/lib/live'
import {dataAttr} from '@/sanity/lib/utils'

// Shown until the fields are filled in under Home in the Studio.
const fallback = {
  name: 'Your name',
  tagline: 'Software Engineer',
}

export default async function Page() {
  const {data: home} = await sanityFetch({query: homeQuery})

  const name = home?.name || fallback.name
  const socials = home?.socials ?? []
  const attr = (path: string) =>
    home?._id ? dataAttr({id: home._id, type: 'home', path}).toString() : undefined

  return (
    <main id="main-content" className="shell main-content main-content--minimal">
      <section className="compact-home motion-enter" aria-labelledby="home-title">
        <header className="compact-home__header">
          <h1 id="home-title" className="name-swap-trigger" aria-label={name}>
            <NameSwap name={name} handle={home?.handle} />
          </h1>
          <p>{home?.tagline || fallback.tagline}</p>
        </header>
        <div className="compact-home__copy" data-sanity={attr('bio')}>
          {home?.bio?.length ? (
            <RichText value={home.bio} linkClassName="inline-link" />
          ) : (
            <p>Add your bio under Home → Bio in the Studio.</p>
          )}
        </div>
        {socials.length > 0 && (
          <div className="compact-home__social-block">
            <p className="eyebrow">Socials</p>
            <SocialLinks
              socials={socials}
              listClassName="compact-home__socials"
              data-sanity={attr('socials')}
            />
          </div>
        )}
      </section>
    </main>
  )
}
