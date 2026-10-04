'use client'

import { useLang } from '@/lib/lang'

export default function Footer() {
  const { lang } = useLang()
  const year = new Date().getFullYear()

  const links = [
    { en: 'FAQ', ua: 'FAQ' },
    { en: 'Terms', ua: 'Умови' },
    { en: 'Privacy', ua: 'Приватність' },
    { en: 'Payment Policy', ua: 'Оплата' },
  ]

  return (
    <footer className="border-t border-white/[0.06] bg-[#1A1814] px-5 py-8 md:px-12 md:py-6">
      <div className="flex flex-col items-center gap-6 text-center md:flex-row md:justify-between md:text-left">
        <span
          className="text-[1.05rem] tracking-[0.1em] text-[#F8F5F0]"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Santa<span className="text-[#B8976A]">Maryna</span>
        </span>

        <div className="flex flex-wrap justify-center gap-x-5 gap-y-3">
          {links.map(link => (
            <a
              key={link.en}
              href="#"
              className="text-[0.65rem] tracking-[0.12em] uppercase text-[#C8C2B8]/50 no-underline transition-colors hover:text-[#F8F5F0]"
            >
              {lang === 'en' ? link.en : link.ua}
            </a>
          ))}
        </div>

        <span className="text-[0.65rem] tracking-[0.05em] text-[#C8C2B8]/40">
          © {year} SantaMaryna
        </span>
      </div>
    </footer>
  )
}
