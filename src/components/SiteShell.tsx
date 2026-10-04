'use client'

import { ReactNode } from 'react'
import { LangProvider } from '@/lib/lang'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function SiteShell({ children }: { children: ReactNode }) {
  return (
    <LangProvider>
      <div className="flex min-h-screen flex-col">
        <Navbar />

        <div className="flex-1">
          {children}
        </div>

        <Footer />
      </div>
    </LangProvider>
  )
}
