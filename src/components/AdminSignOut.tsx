'use client'

import { createSupabaseBrowserClient } from '@/lib/supabaseBrowser'

export default function AdminSignOut() {
  async function signOut() {
    const supabase = createSupabaseBrowserClient()

    await supabase.auth.signOut()

    window.location.href = '/admin/orders/login'
  }

  return (
    <button
      type="button"
      onClick={signOut}
      className="text-[0.68rem] uppercase tracking-[0.14em] text-[#8A837D] hover:text-[#1A1814]"
    >
      Sign out
    </button>
  )
}
