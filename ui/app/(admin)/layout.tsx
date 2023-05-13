'use client'

import 'aos/dist/aos.css'

import Footer from '@/components/ui/footer'

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode
}) {  

  return (
    <>
      <main className="grow">

        {children}

      </main>

      <Footer />
    </>
  )
}
