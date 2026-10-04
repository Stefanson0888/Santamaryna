'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useLang, t } from '@/lib/lang'
import { urlFor } from '@/lib/sanity'

const CAT_EN: Record<string, string> = {
  'ai-images': 'AI Images',
  'ai-video': 'AI Video',
  ads: 'Ads',
  fashion: 'Fashion',
}

const CAT_UA: Record<string, string> = {
  'ai-images': 'AI Зображення',
  'ai-video': 'AI Відео',
  ads: 'Реклама',
  fashion: 'Мода',
}

export default function PortfolioDetail({ item }: { item: any }) {
  const { lang } = useLang()

  const labels = lang === 'en' ? CAT_EN : CAT_UA
  const description =
    t(item, 'description', lang) || t(item, 'shortDesc', lang)

  return (
    <main className="bg-[#FDFCFA] pt-[72px]">
      <section className="px-5 pb-8 pt-10 sm:px-8 sm:pb-12 sm:pt-16 lg:px-12 lg:pb-16 lg:pt-24">
        <Link
          href="/portfolio"
          className="mb-8 inline-block text-[0.65rem] tracking-[0.15em] uppercase text-[#6B6560] no-underline"
        >
          ← {lang === 'en' ? 'Portfolio' : 'Портфоліо'}
        </Link>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_0.6fr] lg:gap-16">
          <div>
            <div className="section-label">
              {labels[item.category] || item.category}
            </div>

            <h1
              className="mb-6 text-[3rem] font-light leading-[0.98] text-[#1A1814] sm:text-[4rem] lg:text-[5rem]"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              {t(item, 'title', lang)}
            </h1>

            {description && (
              <p className="max-w-2xl whitespace-pre-line text-[0.92rem] leading-[1.9] text-[#6B6560]">
                {description}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-6 border-t border-black/[0.08] pt-6 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
            {item.year && (
              <div>
                <div className="mb-2 text-[0.62rem] tracking-[0.16em] uppercase text-[#B8976A]">
                  {lang === 'en' ? 'Year' : 'Рік'}
                </div>
                <div className="text-[0.85rem] text-[#1A1814]">
                  {item.year}
                </div>
              </div>
            )}

            {item.tools?.length > 0 && (
              <div>
                <div className="mb-2 text-[0.62rem] tracking-[0.16em] uppercase text-[#B8976A]">
                  {lang === 'en' ? 'Tools' : 'Інструменти'}
                </div>

                <div className="flex flex-wrap gap-2">
                  {item.tools.map((tool: string) => (
                    <span
                      key={tool}
                      className="border border-black/10 px-3 py-1.5 text-[0.68rem] tracking-[0.08em] text-[#6B6560]"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {item.image && (
        <section className="relative mx-5 h-[420px] overflow-hidden bg-[#F1ECE5] sm:mx-8 sm:h-[600px] lg:mx-12 lg:h-[78vh]">
          <Image
            src={urlFor(item.image).width(1800).url()}
            alt={item.image.alt || t(item, 'title', lang)}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </section>
      )}

      {item.gallery?.length > 0 && (
        <section className="grid grid-cols-1 gap-1 px-5 py-12 sm:grid-cols-2 sm:px-8 lg:px-12 lg:py-16">
          {item.gallery.map((image: any, index: number) => (
            <div
              key={index}
              className={`relative h-[380px] overflow-hidden bg-[#F1ECE5] sm:h-[500px] ${
                index % 3 === 0 ? 'sm:col-span-2 lg:h-[720px]' : ''
              }`}
            >
              <Image
                src={urlFor(image).width(1600).url()}
                alt={image.alt || ''}
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          ))}
        </section>
      )}
    </main>
  )
}
