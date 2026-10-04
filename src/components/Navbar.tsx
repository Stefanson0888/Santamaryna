'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useLang } from '@/lib/lang'

export default function Navbar() {
  const { lang, setLang } = useLang()
  const [menuOpen, setMenuOpen] = useState(false)

  const links = [
    { href: '/portfolio', en: 'Portfolio', ua: 'Портфоліо' },
    { href: '/services', en: 'Services', ua: 'Послуги' },
    { href: '/video-greetings', en: 'Video Greetings', ua: 'Відео-привітання' },
    { href: '/contact', en: 'Contact', ua: 'Контакт' },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-black/[0.06] bg-[#FDFCFA]/95 backdrop-blur-xl">
      <div className="flex h-[72px] items-center justify-between px-5 md:px-12">
        <Link
          href="/"
          onClick={() => setMenuOpen(false)}
          className="font-cormorant text-[1.35rem] tracking-[0.08em] text-[#1A1814] no-underline"
        >
          Santa<span className="text-[#B8976A]">Maryna</span>
        </Link>

        <ul className="hidden md:flex items-center gap-10 list-none m-0 p-0">
          {links.map(link => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-[0.72rem] tracking-[0.15em] uppercase text-[#6B6560] no-underline hover:text-[#1A1814] transition-colors"
              >
                {lang === 'en' ? link.en : link.ua}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex border border-black/10 overflow-hidden">
          {(['en', 'ua'] as const).map(l => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`px-3 py-1.5 font-jost text-[0.7rem] tracking-[0.1em] border-0 cursor-pointer ${
                lang === l
                  ? 'bg-[#1A1814] text-[#FDFCFA]'
                  : 'bg-transparent text-[#6B6560]'
              }`}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(prev => !prev)}
          className="md:hidden flex w-10 h-10 flex-col items-center justify-center gap-[5px] border-0 bg-transparent cursor-pointer"
        >
          <span
            className={`block w-6 h-px bg-[#1A1814] transition-transform ${
              menuOpen ? 'translate-y-[6px] rotate-45' : ''
            }`}
          />
          <span
            className={`block w-6 h-px bg-[#1A1814] transition-opacity ${
              menuOpen ? 'opacity-0' : ''
            }`}
          />
          <span
            className={`block w-6 h-px bg-[#1A1814] transition-transform ${
              menuOpen ? '-translate-y-[6px] -rotate-45' : ''
            }`}
          />
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-black/[0.06] bg-[#FDFCFA] px-5 py-7">
          <div className="flex flex-col">
            {links.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="border-b border-black/[0.06] py-4 text-[0.78rem] tracking-[0.16em] uppercase text-[#1A1814] no-underline"
              >
                {lang === 'en' ? link.en : link.ua}
              </Link>
            ))}
          </div>

          <div className="mt-6 flex w-fit border border-black/10 overflow-hidden">
            {(['en', 'ua'] as const).map(l => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-4 py-2 font-jost text-[0.7rem] tracking-[0.1em] border-0 cursor-pointer ${
                  lang === l
                    ? 'bg-[#1A1814] text-[#FDFCFA]'
                    : 'bg-transparent text-[#6B6560]'
                }`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
