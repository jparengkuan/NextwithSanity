export type IntroContent = {
  eyebrow?: string | null
  heading?: string | null
  intro?: string | null
}

/** Eyebrow, heading and intro line at the top of the Projects, Blogs and Contact pages. */
export default function PageIntro({
  content,
  fallback,
}: {
  content: IntroContent | null
  // Shown until the page's document is published in the Studio
  fallback: Required<{[K in keyof IntroContent]: string}>
}) {
  return (
    <header className="page-intro motion-enter">
      <p className="eyebrow">{content?.eyebrow || fallback.eyebrow}</p>
      <h1>{content?.heading || fallback.heading}</h1>
      <p>{content?.intro || fallback.intro}</p>
    </header>
  )
}
