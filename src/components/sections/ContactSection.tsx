'use client'
import { useState } from 'react'
import { useLang } from '@/lib/lang'

export default function ContactSection({ settings }: { settings: any }) {
  const { lang } = useLang()
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [form, setForm] = useState({ name: '', email: '', service: 'ai-images', message: '' })

  const services = {
    en: [['ai-images', 'AI Images'], ['ai-video', 'AI Video'], ['ads', 'Ads & Campaigns'], ['greeting', 'Video Greeting']],
    ua: [['ai-images', 'AI Зображення'], ['ai-video', 'AI Відео'], ['ads', 'Реклама'], ['greeting', 'Відео-привітання']],
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
    <section id="contact" className="grid grid-cols-2">
      {/* Left — dark */}
      <div className="px-12 py-24 bg-charcoal">
        <div className="section-label" style={{ color: 'var(--accent)' }}>
          {lang === 'en' ? 'Get in touch' : "Зв'яжіться"}
        </div>
        <h2 className="font-cormorant text-[2.8rem] font-light text-cream mb-5">
          {lang === 'en' ? <>Let's create <em className="text-accent not-italic">together</em></> : <>Давайте створимо <em className="text-accent not-italic">разом</em></>}
        </h2>
        <p className="text-[0.88rem] leading-[1.8] text-white/60 max-w-sm">
          {lang === 'en'
            ? "Ready to elevate your brand with extraordinary AI visuals? Tell me about your project and let's make something remarkable."
            : 'Готові підняти свій бренд за допомогою неординарних AI-візуалів? Розкажіть про свій проєкт.'}
        </p>
        <div className="mt-12 flex flex-col gap-4">
          {[
            { icon: '@', text: email },
            { icon: 'ig', text: `@${instagram}` },
          ].map(item => (
            <div key={item.icon} className="flex items-center gap-4">
              <div className="w-9 h-9 border border-white/10 flex items-center justify-center
                              text-[0.72rem] text-accent">{item.icon}</div>
              <span className="text-[0.82rem] text-white/70">{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right — form */}
      <div className="px-12 py-24 bg-warm-white">
        <div className="section-label">{lang === 'en' ? 'Send a message' : 'Надіслати повідомлення'}</div>
        <br />
        {status === 'sent' ? (
          <div className="text-[0.9rem] text-mid leading-[1.8]">
            {lang === 'en' ? "✓ Message sent! I'll get back to you soon." : "✓ Повідомлення надіслано! Я зв'яжусь незабаром."}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="grid grid-cols-2 gap-6">
              {[
                { key: 'name', en: 'Name', ua: "Ім'я", placeholder: 'Your name' },
                { key: 'email', en: 'Email', ua: 'Email', placeholder: 'your@email.com', type: 'email' },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-[0.65rem] tracking-[0.15em] uppercase text-mid mb-1.5">
                    {lang === 'en' ? f.en : f.ua}
                  </label>
                  <input
                    type={f.type || 'text'}
                    placeholder={f.placeholder}
                    value={(form as any)[f.key]}
                    onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                    required
                    className="w-full py-2 bg-transparent border-b border-black/10
                               text-[0.88rem] font-light outline-none focus:border-charcoal transition-colors"
                  />
                </div>
              ))}
            </div>
            <div>
              <label className="block text-[0.65rem] tracking-[0.15em] uppercase text-mid mb-1.5">
                {lang === 'en' ? 'Service' : 'Послуга'}
              </label>
              <select
                value={form.service}
                onChange={e => setForm(prev => ({ ...prev, service: e.target.value }))}
                className="w-full py-2 bg-transparent border-b border-black/10
                           text-[0.88rem] font-light outline-none focus:border-charcoal transition-colors appearance-none"
              >
                {services[lang].map(([val, label]) => (
                  <option key={val} value={val}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[0.65rem] tracking-[0.15em] uppercase text-mid mb-1.5">
                {lang === 'en' ? 'Message' : 'Повідомлення'}
              </label>
              <textarea
                rows={4}
                placeholder={lang === 'en' ? 'Tell me about your project...' : 'Розкажіть про ваш проєкт...'}
                value={form.message}
                onChange={e => setForm(prev => ({ ...prev, message: e.target.value }))}
                required
                className="w-full py-2 bg-transparent border-b border-black/10
                           text-[0.88rem] font-light outline-none focus:border-charcoal transition-colors resize-none"
              />
            </div>
            {status === 'error' && (
              <p className="text-red-500 text-[0.78rem]">
                {lang === 'en' ? 'Something went wrong. Please try again.' : 'Щось пішло не так. Спробуйте ще раз.'}
              </p>
            )}
            <button type="submit" disabled={status === 'sending'}
                    className="w-full py-3.5 bg-charcoal text-warm-white text-[0.72rem]
                               tracking-[0.18em] uppercase hover:bg-accent transition-colors
                               disabled:opacity-50 font-jost">
              {status === 'sending'
                ? (lang === 'en' ? 'Sending...' : 'Надсилаємо...')
                : (lang === 'en' ? 'Send Message →' : 'Надіслати →')}
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
