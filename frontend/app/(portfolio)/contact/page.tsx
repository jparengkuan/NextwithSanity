import type {Metadata} from 'next'

import {contactPageQuery} from '@/sanity/lib/queries'
import {sanityFetch} from '@/sanity/lib/live'
import ContactForm from './ContactForm'

// Shown until the Contact Page document is published in the Studio.
const fallback = {
  eyebrow: 'Contact',
  heading: 'Get in touch',
  intro: 'Have a question, an idea, or just want to say hi? Send me a message.',
  successMessage: 'Thanks! Your message is on its way. I’ll get back to you soon.',
}

export async function generateMetadata(): Promise<Metadata> {
  const {data: page} = await sanityFetch({query: contactPageQuery, stega: false})
  return {title: page?.heading || fallback.heading}
}

export default async function ContactPage() {
  const [{data: page}, {data: plain}] = await Promise.all([
    sanityFetch({query: contactPageQuery}),
    // The success message is passed to a Client Component as a prop, so fetch it without stega
    sanityFetch({query: contactPageQuery, stega: false}),
  ])

  return (
    <main id="main-content" className="shell main-content">
      <header className="page-intro motion-enter">
        <p className="eyebrow">{page?.eyebrow || fallback.eyebrow}</p>
        <h1>{page?.heading || fallback.heading}</h1>
        <p>{page?.intro || fallback.intro}</p>
      </header>
      <section className="contact motion-enter" aria-label="Contact form">
        <ContactForm successMessage={plain?.successMessage || fallback.successMessage} />
      </section>
    </main>
  )
}
