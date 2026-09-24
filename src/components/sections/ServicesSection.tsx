'use client'
import { useLang, t } from '@/lib/lang'

export default function ServicesSection({ services }: { services: any[] }) {
  const { lang } = useLang()

  const fallback = [
    { _id: '1', order: 1, titleEn: 'AI Images', titleUa: 'AI Зображення', descEn: 'Product photography, fashion visuals, brand imagery and art direction — generated with precision, refined to perfection.', descUa: 'Продуктова фотографія, модні візуали, брендові зображення та арт-дирекція.', priceEn: 'From $150 / project', priceUa: 'Від $150 / проєкт' },
    { _id: '2', order: 2, titleEn: 'AI Video', titleUa: 'AI Відео', descEn: 'Short-form content, ad videos, brand films and social reels. Cinematic quality without the cinematic budget.', descUa: 'Короткий контент, рекламні відео, брендові фільми та соціальні ролики.', priceEn: 'From $300 / project', priceUa: 'Від $300 / проєкт' },
    { _id: '3', order: 3, titleEn: 'Ads & Campaigns', titleUa: 'Реклама та кампанії', descEn: 'Full creative package for digital advertising — concepts, visuals, copy direction and multiple format delivery.', descUa: 'Повний творчий пакет для цифрової реклами — концепції, візуали та доставка у різних форматах.', priceEn: 'From $500 / package', priceUa: 'Від $500 / пакет' },
  ]

  const list = services?.length > 0 ? services : fallback

  return (
    <section id="services" className="py-24 px-12 bg-charcoal">
      <div className="section-label" style={{ color: 'var(--accent)' }}>
        {lang === 'en' ? 'What I offer' : 'Що я пропоную'}
      </div>
      <h2 className="font-cormorant text-[2.8rem] font-light text-cream mb-0">
        {lang === 'en' ? <>Services for <em className="text-accent not-italic">bold</em> brands</> : <>Послуги для <em className="text-accent not-italic">сміливих</em> брендів</>}
      </h2>

      <div className="grid grid-cols-3 gap-px mt-14 border border-white/[0.06]">
        {list.map((s, i) => (
          <div key={s._id} className="p-10 border border-white/[0.06] hover:bg-white/[0.03] transition-colors">
            <div className="font-cormorant text-[3rem] font-light text-white/[0.08] leading-none mb-6">
              {String(i + 1).padStart(2, '0')}
            </div>
            <div className="font-cormorant text-[1.5rem] text-cream mb-3">{t(s, 'title', lang)}</div>
            <div className="text-[0.82rem] leading-[1.8] text-white/60">{t(s, 'desc', lang)}</div>
            <div className="mt-6 text-[0.7rem] tracking-[0.15em] uppercase text-accent">{t(s, 'price', lang)}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
