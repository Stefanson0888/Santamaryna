'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useLang, t } from '@/lib/lang'
import { urlFor } from '@/lib/sanity'

const CAT_EN: Record<string, string> = {
  all: 'All',
  'ai-images': 'AI Images',
  'ai-video': 'AI Video',
  ads: 'Ads',
  fashion: 'Fashion',
}

const CAT_UA: Record<string, string> = {
  all: 'Всі',
  'ai-images': 'AI Зображення',
  'ai-video': 'AI Відео',
  ads: 'Реклама',
  fashion: 'Мода',
}

const desktopSpans = [
  'lg:col-span-8',
  'lg:col-span-4',
  'lg:col-span-4',
  'lg:col-span-4',
  'lg:col-span-4',
  'lg:col-span-6',
  'lg:col-span-6',
]

export default function PortfolioSection({ items }: { items: any[] }) {
  const { lang } = useLang()
  const [active, setActive] = useState('all')

  const labels = lang === 'en' ? CAT_EN : CAT_UA
  const filtered =
    active === 'all' ? items : items.filter(item => item.category === active)

  const categories = [
    'all',
    ...Array.from(new Set(items.map(item => item.category))),
  ] as string[]

  const display = filtered.length > 0 ? filtered : Array(5).fill(null)

  return (
    <section className="bg-[#FDFCFA] px-5 pb-16 pt-28 sm:px-8 sm:pb-20 lg:px-12 lg:pb-24 lg:pt-32">
      <div className="mb-8 flex flex-col gap-6 lg:mb-12 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="section-label">
            {lang === 'en' ? 'Selected Work' : 'Вибрані роботи'}
          </div>

          <h1
            className="text-[2.8rem] font-light leading-none text-[#1A1814] sm:text-[3.3rem]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {lang === 'en' ? 'Portfolio' : 'Портфоліо'}
          </h1>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`cursor-pointer px-3 py-2 text-[0.65rem] tracking-[0.12em] uppercase sm:px-4 ${
                active === cat
                  ? 'border border-[#1A1814] text-[#1A1814]'
                  : 'border border-black/10 text-[#6B6560]'
              } bg-transparent`}
            >
              {labels[cat] || cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-[3px] sm:grid-cols-2 lg:grid-cols-12">
        {display.map((item, i) => (
          <div
            key={item?._id || i}
            className={`relative h-[360px] overflow-hidden bg-[#F8F5F0] sm:h-[400px] lg:h-auto ${
              desktopSpans[i % desktopSpans.length]
            } ${i < 2 ? 'lg:min-h-[400px]' : 'lg:min-h-[280px]'}`}
          >
            {item?.slug?.current && (
              <Link
                href={`/portfolio/${item.slug.current}`}
                aria-label={t(item, 'title', lang)}
                className="absolute inset-0 z-20"
              />
            )}
            {item?.image ? (
              <Image
                src={urlFor(item.image).width(1200).url()}
                alt={item.image.alt || ''}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 66vw"
                className="object-cover transition-transform duration-500 hover:scale-[1.02]"
              />
            ) : (
              <div
                className="flex h-full min-h-[320px] w-full flex-col items-center justify-center gap-2 sm:min-h-[340px]"
                style={{
                  background:
                    'linear-gradient(135deg,#EDE7DF 0%,#D8CFBF 100%)',
                }}
              >
                <span className="border border-[#E8D9C0] bg-white/50 px-3 py-1 text-[0.58rem] tracking-[0.2em] uppercase text-[#B8976A]">
                  {item
                    ? CAT_EN[item.category] || item.category
                    : 'Portfolio'}
                </span>

                <span
                  className="text-[1.1rem] italic text-[#6B6560]"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  {item ? t(item, 'title', lang) : 'your work here'}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
