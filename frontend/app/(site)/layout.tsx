import Footer from '@/app/components/Footer'
import Header from '@/app/components/Header'

export default function SiteLayout({children}: {children: React.ReactNode}) {
  return (
    <section className="min-h-screen pt-24 bg-white text-black">
      <Header />
      <main className="">{children}</main>
      <Footer />
    </section>
  )
}
