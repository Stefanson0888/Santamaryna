import Link from 'next/link'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { requireAdmin } from '@/lib/requireAdmin'
import AdminSignOut from '@/components/AdminSignOut'

export const dynamic = 'force-dynamic'

export default async function OrdersAdminPage() {
  const user = await requireAdmin()

  const { data: orders, error } = await supabaseAdmin
    .from('greeting_orders')
    .select(`
      id,
      product_slug,
      customer_email,
      payment_status,
      render_status,
      created_at
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Orders admin error:', error)
  }

  return (
    <main className="min-h-screen bg-[#FDFCFA] px-5 py-10 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="mb-3 text-[0.65rem] uppercase tracking-[0.18em] text-[#B8976A]">
              Santamaryna
            </p>

            <h1
              className="text-[3rem] font-light leading-none text-[#1A1814]"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Orders Admin
            </h1>

            <p className="mt-3 text-sm text-[#8A837D]">
              Signed in as {user.email}
            </p>
          </div>

          <AdminSignOut />
        </div>

        <div className="overflow-x-auto border border-black/[0.08] bg-white">
          <table className="w-full min-w-[900px] border-collapse">
            <thead>
              <tr className="border-b border-black/[0.08] text-left">
                <th className="p-4 text-[0.65rem] uppercase tracking-[0.12em] text-[#6B6560]">
                  Created
                </th>
                <th className="p-4 text-[0.65rem] uppercase tracking-[0.12em] text-[#6B6560]">
                  Product
                </th>
                <th className="p-4 text-[0.65rem] uppercase tracking-[0.12em] text-[#6B6560]">
                  Customer
                </th>
                <th className="p-4 text-[0.65rem] uppercase tracking-[0.12em] text-[#6B6560]">
                  Payment
                </th>
                <th className="p-4 text-[0.65rem] uppercase tracking-[0.12em] text-[#6B6560]">
                  Render
                </th>
                <th className="p-4 text-[0.65rem] uppercase tracking-[0.12em] text-[#6B6560]">
                  Order ID
                </th>
              </tr>
            </thead>

            <tbody>
              {(orders || []).map(order => (
                <tr
                  key={order.id}
                  className="border-b border-black/[0.06] last:border-b-0"
                >
                  <td className="p-4 text-sm text-[#6B6560]">
                    {new Date(order.created_at).toLocaleString()}
                  </td>

                  <td className="p-4 text-sm text-[#1A1814]">
                    {order.product_slug}
                  </td>

                  <td className="p-4 text-sm text-[#1A1814]">
                    {order.customer_email}
                  </td>

                  <td className="p-4 text-sm text-[#6B6560]">
                    {order.payment_status}
                  </td>

                  <td className="p-4 text-sm text-[#6B6560]">
                    {order.render_status}
                  </td>

                  <td className="p-4 font-mono text-xs">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="text-[#8A837D] underline decoration-black/20 underline-offset-4 hover:text-[#1A1814]"
                    >
                      {order.id}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {!orders?.length && (
            <div className="p-8 text-center text-sm text-[#8A837D]">
              No orders yet.
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
