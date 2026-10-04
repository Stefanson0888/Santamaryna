'use client'

import { useLang, t } from '@/lib/lang'

export default function ServicesSection({ services }: { services: any[] }) {
  const { lang } = useLang()

  const fallback = [
    {
      _id: '1',
      order: 1,
      titleEn: 'AI Images',
      titleUa: 'AI Зображення',
      descEn:
        'Product photography, fashion visuals, brand imagery and art direction — generated with precision, refined to perfection.',
      descUa:
        'Продуктова фотографія, модні візуали, брендові зображення та арт-дирекція.',
      priceEn: 'From $150 / project',
      priceUa: 'Від $150 / проєкт',
    },
    {
      _id: '2',
      order: 2,
      titleEn: 'AI Video',
      titleUa: 'AI Відео',
      descEn:
        'Short-form content, ad videos, brand films and social reels. Cinematic quality without the cinematic budget.',
      descUa:
        'Короткий контент, рекламні відео, брендові фільми та соціальні ролики.',
      priceEn: 'From $300 / project',
      priceUa: 'Від $300 / проєкт',
    },
    {
      _id: '3',
      order: 3,
      titleEn: 'Ads & Campaigns',
      titleUa: 'Реклама та кампанії',
      descEn:
        'Full creative package for digital advertising — concepts, visuals, copy direction and multiple format delivery.',
      descUa:
        'Повний творчий пакет для цифрової реклами — концепції, візуали та доставка у різних форматах.',
      priceEn: 'From $500 / package',
      priceUa: 'Від $500 / пакет',
    },
  ]

  const list = services?.length > 0 ? services : fallback

  return (
    <section className="bg-charcoal px-5 pb-16 pt-28 sm:px-8 sm:pb-20 lg:px-12 lg:pb-24 lg:pt-32">
      <div className="section-label" style={{ color: 'var(--accent)' }}>
        {lang === 'en' ? 'What I offer' : 'Що я пропоную'}
      </div>

      <h1 className="font-cormorant text-[2.8rem] font-light leading-[1.05] text-cream sm:text-[3.2rem] lg:text-[3.6rem]">
        {lang === 'en' ? (
          <>
            Services for <em className="text-accent not-italic">bold</em> brands
          </>
        ) : (
          <>
            Послуги для <em className="text-accent not-italic">сміливих</em> брендів
          </>
        )}
      </h1>

      <div className="mt-10 grid grid-cols-1 gap-px border border-white/[0.06] sm:grid-cols-2 lg:mt-14 lg:grid-cols-3">
        {list.map((s, i) => (
          <div
            key={s._id}
            className="border border-white/[0.06] p-6 transition-colors hover:bg-white/[0.03] sm:p-8 lg:p-10"
          >
            <div className="font-cormorant mb-5 text-[2.6rem] font-light leading-none text-white/[0.08] lg:mb-6 lg:text-[3rem]">
              {String(i + 1).padStart(2, '0')}
            </div>

            <div className="font-cormorant mb-3 text-[1.45rem] text-cream">
              {t(s, 'title', lang)}
            </div>

            <div className="text-[0.82rem] leading-[1.8] text-white/60">
              {t(s, 'desc', lang)}
            </div>

            <div className="mt-6 text-[0.7rem] tracking-[0.15em] uppercase text-accent">
              {t(s, 'price', lang)}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
