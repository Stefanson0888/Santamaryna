import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabaseServer'

export async function requireAdmin() {
  const supabase = createSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/orders/login')
  }

  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase()
  const userEmail = user.email?.trim().toLowerCase()

  if (!adminEmail || userEmail !== adminEmail) {
    redirect('/admin/orders/login?error=unauthorized')
  }

  return user
}
