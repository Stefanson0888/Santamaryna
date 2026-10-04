'use client'

import { useState } from 'react'
import { useLang } from '@/lib/lang'

export default function ContactSection({ settings }: { settings: any }) {
  const { lang } = useLang()

  const [status, setStatus] = useState<
    'idle' | 'sending' | 'sent' | 'error'
  >('idle')

  const [form, setForm] = useState({
    name: '',
    email: '',
    service: 'ai-images',
    message: '',
  })

  const services = {
    en: [
      ['ai-images', 'AI Images'],
      ['ai-video', 'AI Video'],
      ['ads', 'Ads & Campaigns'],
      ['greeting', 'Video Greeting'],
    ],
    ua: [
      ['ai-images', 'AI Зображення'],
      ['ai-video', 'AI Відео'],
      ['ads', 'Реклама'],
      ['greeting', 'Відео-привітання'],
    ],
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      setStatus(res.ok ? 'sent' : 'error')
    } catch {
      setStatus('error')
    }
  }

  const email = settings?.email || 'hello@santamaryna.com'
  const instagram = settings?.instagram || 'santamaryna'

  return (
    <section className="grid grid-cols-1 pt-[72px] lg:min-h-[calc(100vh-72px)] lg:grid-cols-2">
      <div className="bg-charcoal px-5 py-14 sm:px-8 sm:py-16 lg:px-12 lg:py-24">
        <div className="section-label" style={{ color: 'var(--accent)' }}>
          {lang === 'en' ? 'Get in touch' : "Зв'яжіться"}
        </div>

        <h1 className="font-cormorant mb-5 text-[2.8rem] font-light leading-[1.05] text-cream sm:text-[3.2rem]">
          {lang === 'en' ? (
            <>
              Let's create{' '}
              <em className="text-accent not-italic">together</em>
            </>
          ) : (
            <>
              Давайте створимо{' '}
              <em className="text-accent not-italic">разом</em>
            </>
          )}
        </h1>

        <p className="max-w-sm text-[0.88rem] leading-[1.8] text-white/60">
          {lang === 'en'
            ? "Ready to elevate your brand with extraordinary AI visuals? Tell me about your project and let's make something remarkable."
            : 'Готові підняти свій бренд за допомогою неординарних AI-візуалів? Розкажіть про свій проєкт.'}
        </p>

        <div className="mt-10 flex flex-col gap-4 lg:mt-12">
          {[
            { icon: '@', text: email },
            { icon: 'ig', text: `@${instagram}` },
          ].map(item => (
            <div key={item.icon} className="flex items-center gap-4">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center border border-white/10 text-[0.72rem] text-accent">
                {item.icon}
              </div>

              <span className="break-all text-[0.82rem] text-white/70">
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-warm-white px-5 py-14 sm:px-8 sm:py-16 lg:px-12 lg:py-24">
        <div className="section-label">
          {lang === 'en' ? 'Send a message' : 'Надіслати повідомлення'}
        </div>

        <div className="mt-6">
          {status === 'sent' ? (
            <div className="text-[0.9rem] leading-[1.8] text-mid">
              {lang === 'en'
                ? "✓ Message sent! I'll get back to you soon."
                : "✓ Повідомлення надіслано! Я зв'яжусь незабаром."}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
                {[
                  {
                    key: 'name',
                    en: 'Name',
                    ua: "Ім'я",
                    placeholder: 'Your name',
                  },
                  {
                    key: 'email',
                    en: 'Email',
                    ua: 'Email',
                    placeholder: 'your@email.com',
                    type: 'email',
                  },
                ].map(f => (
                  <div key={f.key}>
                    <label className="mb-1.5 block text-[0.65rem] tracking-[0.15em] uppercase text-mid">
                      {lang === 'en' ? f.en : f.ua}
                    </label>

                    <input
                      type={f.type || 'text'}
                      placeholder={f.placeholder}
                      value={(form as any)[f.key]}
                      onChange={e =>
                        setForm(prev => ({
                          ...prev,
                          [f.key]: e.target.value,
                        }))
                      }
                      required
                      className="w-full border-b border-black/10 bg-transparent py-2 text-[0.88rem] font-light outline-none transition-colors focus:border-charcoal"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="mb-1.5 block text-[0.65rem] tracking-[0.15em] uppercase text-mid">
                  {lang === 'en' ? 'Service' : 'Послуга'}
                </label>

                <select
                  value={form.service}
                  onChange={e =>
                    setForm(prev => ({
                      ...prev,
                      service: e.target.value,
                    }))
                  }
                  className="w-full appearance-none border-b border-black/10 bg-transparent py-2 text-[0.88rem] font-light outline-none transition-colors focus:border-charcoal"
                >
                  {services[lang].map(([val, label]) => (
                    <option key={val} value={val}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-[0.65rem] tracking-[0.15em] uppercase text-mid">
                  {lang === 'en' ? 'Message' : 'Повідомлення'}
                </label>

                <textarea
                  rows={5}
                  placeholder={
                    lang === 'en'
                      ? 'Tell me about your project...'
                      : 'Розкажіть про ваш проєкт...'
                  }
                  value={form.message}
                  onChange={e =>
                    setForm(prev => ({
                      ...prev,
                      message: e.target.value,
                    }))
                  }
                  required
                  className="w-full resize-none border-b border-black/10 bg-transparent py-2 text-[0.88rem] font-light outline-none transition-colors focus:border-charcoal"
                />
              </div>

              {status === 'error' && (
                <p className="text-[0.78rem] text-red-500">
                  {lang === 'en'
                    ? 'Something went wrong. Please try again.'
                    : 'Щось пішло не так. Спробуйте ще раз.'}
                </p>
              )}

              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full bg-charcoal py-3.5 font-jost text-[0.72rem] tracking-[0.18em] uppercase text-warm-white transition-colors hover:bg-accent disabled:opacity-50"
              >
                {status === 'sending'
                  ? lang === 'en'
                    ? 'Sending...'
                    : 'Надсилаємо...'
                  : lang === 'en'
                    ? 'Send Message →'
                    : 'Надіслати →'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
