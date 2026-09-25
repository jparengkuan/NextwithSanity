import type {Metadata} from 'next'

import PageIntro from '@/app/components/portfolio/PageIntro'
import {contactPageQuery} from '@/sanity/lib/queries'
import {sanityFetch} from '@/sanity/lib/live'
import ContactForm from './ContactForm'

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
      <PageIntro content={page} fallback={fallback} />
      <section className="contact motion-enter" aria-label="Contact form">
        <ContactForm successMessage={plain?.successMessage || fallback.successMessage} />
      </section>
    </main>
  )
}
