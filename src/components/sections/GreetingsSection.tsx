'use client'
import { useLang, t } from '@/lib/lang'

export default function GreetingsSection({ greetings, steps }: { greetings: any[], steps: any[] }) {
  const { lang } = useLang()

  const fallbackGreetings = [
    { _id: '1', order: 1, titleEn: 'Birthday Greeting', titleUa: 'Привітання з ДН', descEn: 'A magical personalized video with name, age, and favorite things — make them feel truly special.', descUa: 'Магічне персоналізоване відео з іменем, віком і улюбленим.', price: 29, currency: '$', badge: 'Most Popular', thumbColor: 'linear-gradient(135deg, #E8D9C0 0%, #D4C0A0 100%)' },
    { _id: '2', order: 2, titleEn: 'New Year Greeting', titleUa: 'Новорічне привітання', descEn: 'Ring in the new year with a personalized cinematic video for family, friends or clients.', descUa: 'Зустрічайте Новий рік з персоналізованим кінематографічним відео.', price: 34, currency: '$', thumbColor: 'linear-gradient(135deg, #D4E8D0 0%, #B4CEB0 100%)' },
    { _id: '3', order: 3, titleEn: 'Christmas Greeting', titleUa: 'Різдвяне привітання', descEn: 'Warm cinematic Christmas magic — with personalized names, photos, and festive atmosphere.', descUa: 'Тепла кінематографічна різдвяна магія — з персоналізованими іменами та фото.', price: 34, currency: '$', thumbColor: 'linear-gradient(135deg, #D4D8E8 0%, #B4B8D0 100%)' },
  ]

  const fallbackSteps = [
    { _id: 's1', order: 1, titleEn: 'Choose & fill', titleUa: 'Обери та заповни', descEn: 'Select the occasion, enter name, details and upload photos.', descUa: 'Обери привід, введи ім\'я, деталі та завантаж фото.' },
    { _id: 's2', order: 2, titleEn: 'Pay securely', titleUa: 'Сплати безпечно', descEn: 'Quick checkout via WayForPay — cards, Apple Pay, Google Pay.', descUa: 'Швидка оплата через WayForPay — картки, Apple Pay, Google Pay.' },
    { _id: 's3', order: 3, titleEn: 'We create', titleUa: 'Ми створюємо', descEn: 'Your video is personalized and rendered — usually within the hour.', descUa: 'Ваше відео персоналізується та рендериться — зазвичай протягом години.' },
    { _id: 's4', order: 4, titleEn: 'Download & share', titleUa: 'Завантаж та поділись', descEn: 'Get a private download link via email. Share, print, or keep forever.', descUa: 'Отримай приватне посилання для завантаження на email.' },
  ]

  const list = greetings?.length > 0 ? greetings : fallbackGreetings
  const stepList = steps?.length > 0 ? steps : fallbackSteps

  return (
    <>
      <section id="greetings" className="py-24 px-12 bg-cream">
        <div className="mb-14">
          <div className="section-label">{lang === 'en' ? 'A personal touch' : 'Особистий дотик'}</div>
          <h2 className="font-cormorant text-[2.8rem] font-light text-charcoal mb-4">
            {lang === 'en' ? <>Personalized <em className="text-accent not-italic">video</em> greetings</> : <>Персоналізовані <em className="text-accent not-italic">відео</em>-привітання</>}
          </h2>
          <p className="text-[0.9rem] leading-[1.8] text-mid max-w-xl">
            {lang === 'en'
              ? 'Unique AI-generated greeting videos for any occasion — personalized with names, photos, and heartfelt messages. Ready within minutes.'
              : 'Унікальні AI-генеровані відео-привітання для будь-якого приводу — з іменами, фото та щирими побажаннями.'}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-12">
          {list.map(g => (
            <div key={g._id}
                 className="bg-warm-white border border-black/[0.06] overflow-hidden
                            hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(26,24,20,0.08)]
                            transition-all duration-300">
              {/* Thumb */}
              <div className="h-40 relative flex items-center justify-center"
                   style={{ background: g.thumbColor || 'linear-gradient(135deg,#E8D9C0,#D4C0A0)' }}>
                {g.badge && (
                  <span className="absolute top-3 left-3 text-[0.58rem] tracking-[0.15em] uppercase
                                   px-2.5 py-1 bg-charcoal text-cream">
                    {lang === 'ua' && g.badge === 'Most Popular' ? 'Популярне' : g.badge}
                  </span>
                )}
                <div className="w-11 h-11 rounded-full border border-white/60 bg-white/20
                                flex items-center justify-center text-white text-base">▶</div>
              </div>
              {/* Body */}
              <div className="p-6">
                <div className="font-cormorant text-[1.3rem] text-charcoal mb-1">{t(g, 'title', lang)}</div>
                <div className="text-[0.78rem] leading-[1.7] text-mid mb-5">{t(g, 'desc', lang)}</div>
                <div className="flex items-center justify-between pt-4 border-t border-black/[0.06]">
                  <div className="font-cormorant text-[1.5rem] text-charcoal">
                    {g.currency || '$'}{g.price} <span className="text-[0.72rem] text-mid font-jost">/ video</span>
                  </div>
                  <button className="text-[0.65rem] tracking-[0.15em] uppercase px-4 py-2
                                     bg-charcoal text-warm-white hover:bg-accent transition-colors font-jost">
                    {lang === 'en' ? 'Order →' : 'Замовити →'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works strip */}
      <div className="px-12 py-14 bg-accent-light grid gap-8"
           style={{ gridTemplateColumns: 'auto repeat(4, 1fr)' }}>
        <div className="text-[0.65rem] tracking-[0.2em] uppercase text-accent self-center"
             style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
          {lang === 'en' ? 'How it works' : 'Як це працює'}
        </div>
        {stepList.slice(0, 4).map((s, i) => (
          <div key={s._id}>
            <div className="font-cormorant text-[2.5rem] font-light text-accent leading-none mb-2">
              {String(i + 1)}
            </div>
            <div className="text-[0.72rem] tracking-[0.12em] uppercase text-charcoal mb-1">{t(s, 'title', lang)}</div>
            <div className="text-[0.78rem] leading-[1.7] text-mid">{t(s, 'desc', lang)}</div>
          </div>
        ))}
      </div>
    </>
  )
}
