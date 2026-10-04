'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useLang, t } from '@/lib/lang'
import { urlFor } from '@/lib/sanity'

export default function HeroSection({ settings }: { settings: any }) {
  const { lang } = useLang()

  const titleRaw =
    t(settings, 'heroTitle', lang) ||
    'Visuals that **speak** for your brand'

  const titleHtml = titleRaw.replace(
    /\*\*(.+?)\*\*/g,
    '<em style="color:#B8976A;font-style:normal">$1</em>'
  )

  const sub =
    t(settings, 'heroSub', lang) ||
    'AI-generated images, videos, and ad content for businesses and creative projects that demand something extraordinary.'

  const images = settings?.heroImages || []

  return (
    <section className="pt-[72px] lg:min-h-screen lg:grid lg:grid-cols-2">
      <div className="flex flex-col justify-center bg-[#FDFCFA] px-5 py-14 sm:px-8 sm:py-20 lg:px-12 lg:py-20">
        <div className="section-label animate-fade-up">
          {lang === 'en' ? 'AI Visual Artist' : 'AI Візуальний Художник'}
        </div>

        <h1
          className="animate-fade-up-1 mb-6 text-[3rem] leading-[0.98] font-light text-[#1A1814] sm:text-[3.8rem] lg:text-[4rem]"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
          dangerouslySetInnerHTML={{ __html: titleHtml }}
        />

        <p className="animate-fade-up-2 mb-8 max-w-[420px] text-[0.9rem] leading-[1.8] text-[#6B6560]">
          {sub}
        </p>

        <div className="animate-fade-up-3 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link
            href="/portfolio"
            className="inline-flex items-center justify-center gap-3 bg-[#1A1814] px-7 py-3.5 text-[0.72rem] tracking-[0.18em] uppercase text-[#FDFCFA] no-underline"
          >
            {lang === 'en' ? 'View Work →' : 'Переглянути роботи →'}
          </Link>

          <Link
            href="/contact"
            className="inline-flex items-center justify-center border border-black/10 px-7 py-3.5 text-[0.72rem] tracking-[0.18em] uppercase text-[#1A1814] no-underline"
          >
            {lang === 'en' ? 'Start a Project' : 'Почати проєкт'}
          </Link>
        </div>
      </div>

      <div className="grid h-[520px] grid-cols-2 grid-rows-2 gap-[2px] bg-[#F8F5F0] sm:h-[650px] lg:h-auto lg:min-h-[calc(100vh-72px)]">
        <div className="relative col-span-2 overflow-hidden bg-[#C8C2B8]">
          {images[0] ? (
            <Image
              src={urlFor(images[0]).width(1200).url()}
              alt={images[0].alt || ''}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <Placeholder label="hero image" />
          )}
        </div>

        {[1, 2].map(i => (
          <div
            key={i}
            className="relative overflow-hidden bg-[#C8C2B8]"
          >
            {images[i] ? (
              <Image
                src={urlFor(images[i]).width(700).url()}
                alt={images[i].alt || ''}
                fill
                sizes="(max-width: 1024px) 50vw, 25vw"
                style={{ objectFit: 'cover' }}
              />
            ) : (
              <Placeholder label={`image ${i + 1}`} />
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

function Placeholder({ label }: { label: string }) {
  return (
    <div
      className="flex h-full w-full items-center justify-center text-[#B8A898]"
      style={{
        background: 'linear-gradient(135deg,#EDE7DF 0%,#D8CFBF 100%)',
        fontFamily: "'Cormorant Garamond', serif",
        fontStyle: 'italic',
        fontSize: '1rem',
      }}
    >
      {label}
    </div>
  )
}
