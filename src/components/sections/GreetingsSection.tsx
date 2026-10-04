'use client'

import { useLang, t } from '@/lib/lang'

export default function GreetingsSection({
  greetings,
  steps,
}: {
  greetings: any[]
  steps: any[]
}) {
  const { lang } = useLang()

  const fallbackGreetings = [
    {
      _id: '1',
      order: 1,
      titleEn: 'Birthday Greeting',
      titleUa: 'Привітання з ДН',
      descEn:
        'A magical personalized video with name, age, and favorite things — make them feel truly special.',
      descUa:
        'Магічне персоналізоване відео з іменем, віком і улюбленим.',
      price: 29,
      currency: '$',
      badge: 'Most Popular',
      thumbColor: 'linear-gradient(135deg, #E8D9C0 0%, #D4C0A0 100%)',
    },
    {
      _id: '2',
      order: 2,
      titleEn: 'New Year Greeting',
      titleUa: 'Новорічне привітання',
      descEn:
        'Ring in the new year with a personalized cinematic video for family, friends or clients.',
      descUa:
        'Зустрічайте Новий рік з персоналізованим кінематографічним відео.',
      price: 34,
      currency: '$',
      thumbColor: 'linear-gradient(135deg, #D4E8D0 0%, #B4CEB0 100%)',
    },
    {
      _id: '3',
      order: 3,
      titleEn: 'Christmas Greeting',
      titleUa: 'Різдвяне привітання',
      descEn:
        'Warm cinematic Christmas magic — with personalized names, photos, and festive atmosphere.',
      descUa:
        'Тепла кінематографічна різдвяна магія — з персоналізованими іменами та фото.',
      price: 34,
      currency: '$',
      thumbColor: 'linear-gradient(135deg, #D4D8E8 0%, #B4B8D0 100%)',
    },
  ]

  const fallbackSteps = [
    {
      _id: 's1',
      order: 1,
      titleEn: 'Choose & fill',
      titleUa: 'Обери та заповни',
      descEn: 'Select the occasion, enter name, details and upload photos.',
      descUa: "Обери привід, введи ім'я, деталі та завантаж фото.",
    },
    {
      _id: 's2',
      order: 2,
      titleEn: 'Pay securely',
      titleUa: 'Сплати безпечно',
      descEn: 'Quick checkout via WayForPay — cards, Apple Pay, Google Pay.',
      descUa:
        'Швидка оплата через WayForPay — картки, Apple Pay, Google Pay.',
    },
    {
      _id: 's3',
      order: 3,
      titleEn: 'We create',
      titleUa: 'Ми створюємо',
      descEn:
        'Your video is personalized and rendered — usually within the hour.',
      descUa:
        'Ваше відео персоналізується та рендериться — зазвичай протягом години.',
    },
    {
      _id: 's4',
      order: 4,
      titleEn: 'Download & share',
      titleUa: 'Завантаж та поділись',
      descEn:
        'Get a private download link via email. Share, print, or keep forever.',
      descUa:
        'Отримай приватне посилання для завантаження на email.',
    },
  ]

  const list = greetings?.length > 0 ? greetings : fallbackGreetings
  const stepList = steps?.length > 0 ? steps : fallbackSteps

  return (
    <>
      <section className="bg-cream px-5 pb-16 pt-28 sm:px-8 sm:pb-20 lg:px-12 lg:pb-24 lg:pt-32">
        <div className="mb-10 lg:mb-14">
          <div className="section-label">
            {lang === 'en' ? 'A personal touch' : 'Особистий дотик'}
          </div>

          <h1 className="font-cormorant mb-4 text-[2.8rem] font-light leading-[1.05] text-charcoal sm:text-[3.2rem]">
            {lang === 'en' ? (
              <>
                Personalized{' '}
                <em className="text-accent not-italic">video</em> greetings
              </>
            ) : (
              <>
                Персоналізовані{' '}
                <em className="text-accent not-italic">відео</em>-привітання
              </>
            )}
          </h1>

          <p className="max-w-xl text-[0.9rem] leading-[1.8] text-mid">
            {lang === 'en'
              ? 'Unique AI-generated greeting videos for any occasion — personalized with names, photos, and heartfelt messages. Ready within minutes.'
              : 'Унікальні AI-генеровані відео-привітання для будь-якого приводу — з іменами, фото та щирими побажаннями.'}
          </p>
        </div>

        <div className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {list.map(g => (
            <div
              key={g._id}
              className="overflow-hidden border border-black/[0.06] bg-warm-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(26,24,20,0.08)]"
            >
              <div
                className="relative flex h-44 items-center justify-center sm:h-40"
                style={{
                  background:
                    g.thumbColor ||
                    'linear-gradient(135deg,#E8D9C0,#D4C0A0)',
                }}
              >
                {g.badge && (
                  <span className="absolute left-3 top-3 bg-charcoal px-2.5 py-1 text-[0.58rem] tracking-[0.15em] uppercase text-cream">
                    {lang === 'ua' && g.badge === 'Most Popular'
                      ? 'Популярне'
                      : g.badge}
                  </span>
                )}

                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/60 bg-white/20 text-base text-white">
                  ▶
                </div>
              </div>

              <div className="p-5 sm:p-6">
                <div className="font-cormorant mb-1 text-[1.3rem] text-charcoal">
                  {t(g, 'title', lang)}
                </div>

                <div className="mb-5 text-[0.78rem] leading-[1.7] text-mid">
                  {t(g, 'desc', lang)}
                </div>

                <div className="flex flex-col gap-4 border-t border-black/[0.06] pt-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="font-cormorant text-[1.5rem] text-charcoal">
                    {g.currency || '$'}
                    {g.price}{' '}
                    <span className="font-jost text-[0.72rem] text-mid">
                      / video
                    </span>
                  </div>

                  <button className="w-full bg-charcoal px-4 py-2.5 font-jost text-[0.65rem] tracking-[0.15em] uppercase text-warm-white transition-colors hover:bg-accent sm:w-auto">
                    {lang === 'en' ? 'Order →' : 'Замовити →'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-accent-light px-5 py-12 sm:px-8 lg:px-12 lg:py-14">
        <div className="mb-8 text-[0.65rem] tracking-[0.2em] uppercase text-accent">
          {lang === 'en' ? 'How it works' : 'Як це працює'}
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stepList.slice(0, 4).map((s, i) => (
            <div key={s._id}>
              <div className="font-cormorant mb-2 text-[2.5rem] font-light leading-none text-accent">
                {String(i + 1).padStart(2, '0')}
              </div>

              <div className="mb-1 text-[0.72rem] tracking-[0.12em] uppercase text-charcoal">
                {t(s, 'title', lang)}
              </div>

              <div className="text-[0.78rem] leading-[1.7] text-mid">
                {t(s, 'desc', lang)}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
