'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabaseBrowser'

export default function OrdersLoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setErrorMessage('')
    setSubmitting(true)

    const supabase = createSupabaseBrowserClient()

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setErrorMessage('Incorrect email or password.')
      setSubmitting(false)
      return
    }

    router.push('/admin/orders')
    router.refresh()
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FDFCFA] px-5">
      <div className="w-full max-w-md border border-black/[0.08] bg-white p-8 sm:p-10">
        <p className="mb-3 text-[0.65rem] uppercase tracking-[0.18em] text-[#B8976A]">
          Santamaryna
        </p>

        <h1
          className="mb-8 text-[2.5rem] font-light text-[#1A1814]"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Orders Admin
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="mb-2 block text-[0.68rem] uppercase tracking-[0.12em] text-[#6B6560]">
              Email
            </label>

            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full border border-black/[0.1] bg-[#FDFCFA] p-3.5 outline-none focus:border-[#B8976A]"
            />
          </div>

          <div>
            <label className="mb-2 block text-[0.68rem] uppercase tracking-[0.12em] text-[#6B6560]">
              Password
            </label>

            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border border-black/[0.1] bg-[#FDFCFA] p-3.5 outline-none focus:border-[#B8976A]"
            />
          </div>

          {errorMessage && (
            <p className="text-sm text-red-700">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 bg-[#1A1814] px-6 py-3.5 text-[0.7rem] uppercase tracking-[0.16em] text-[#FDFCFA] disabled:opacity-50"
          >
            {submitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </main>
  )
}
