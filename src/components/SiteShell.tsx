'use client'

import { ReactNode } from 'react'
import { LangProvider } from '@/lib/lang'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function SiteShell({ children }: { children: ReactNode }) {
  return (
    <LangProvider>
      <Navbar />
      {children}
      <Footer />
    </LangProvider>
  )
}
