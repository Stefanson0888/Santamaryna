import { notFound } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { requireAdmin } from '@/lib/requireAdmin'

export const dynamic = 'force-dynamic'

export default async function OrderDetailPage({
  params,
}: {
  params: { id: string }
}) {
  await requireAdmin()

  const { data: order } = await supabaseAdmin
    .from('greeting_orders')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!order) {
    notFound()
  }

  const personalization =
    order.personalization && typeof order.personalization === 'object'
      ? order.personalization
      : {}

  const media =
    order.media && typeof order.media === 'object'
      ? order.media
      : {}

  const signedMedia = await Promise.all(
    Object.entries(media).map(async ([key, path]) => {
      const { data } = await supabaseAdmin.storage
        .from('greeting-media')
        .createSignedUrl(String(path), 60 * 60)

      return {
        key,
        url: data?.signedUrl || null,
      }
    })
  )

  let videoDownloadUrl: string | null = null

  if (order.video_url) {
    const { data } = await supabaseAdmin.storage
      .from('greeting-renders')
      .createSignedUrl(String(order.video_url), 60 * 60)

    videoDownloadUrl = data?.signedUrl || null
  }


  const importantPeople = Array.isArray(personalization.importantPeople)
    ? personalization.importantPeople
    : []

  return (
    <main className="min-h-screen bg-[#FDFCFA] px-5 py-10 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <a
          href="/admin/orders"
          className="text-[0.7rem] uppercase tracking-[0.14em] text-[#8A837D]"
        >
          ← Back to orders
        </a>

        <div className="mt-6 flex flex-col gap-4 border-b border-black/[0.08] pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-3 text-[0.65rem] uppercase tracking-[0.18em] text-[#B8976A]">
              {order.product_slug}
            </p>

            <h1
              className="text-[3rem] font-light leading-none text-[#1A1814]"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Order Details
            </h1>
          </div>

          <div className="text-sm text-[#8A837D]">
            {new Date(order.created_at).toLocaleString()}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <section className="border border-black/[0.08] bg-white p-6 lg:col-span-2">
            <h2 className="mb-6 text-[0.7rem] uppercase tracking-[0.15em] text-[#B8976A]">
              Personalization
            </h2>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Info label="Child's name" value={personalization.childName} />
              <Info label="Child's age" value={personalization.childAge} />
              <Info
                label="Favorite activity"
                value={personalization.favoriteActivity}
              />
              <Info
                label="Christmas wish"
                value={personalization.christmasWish}
              />
            </div>

            {personalization.specialFact && (
              <div className="mt-6">
                <Info
                  label="Something special about this year"
                  value={personalization.specialFact}
                />
              </div>
            )}

            {importantPeople.length > 0 && (
              <div className="mt-8 border-t border-black/[0.08] pt-6">
                <h3 className="mb-4 text-[0.7rem] uppercase tracking-[0.14em] text-[#6B6560]">
                  Important people
                </h3>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {importantPeople.map((person: any, index: number) => (
                    <div
                      key={index}
                      className="border border-black/[0.08] bg-[#FDFCFA] p-4"
                    >
                      <div className="text-sm text-[#1A1814]">
                        {person.name || '—'}
                      </div>
                      <div className="mt-1 text-xs uppercase tracking-[0.1em] text-[#8A837D]">
                        {person.relationship || '—'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          <section className="border border-black/[0.08] bg-white p-6">
            <h2 className="mb-6 text-[0.7rem] uppercase tracking-[0.15em] text-[#B8976A]">
              Order
            </h2>

            <div className="flex flex-col gap-5">
              <Info label="Customer email" value={order.customer_email} />
              <Info label="Payment" value={order.payment_status} />
              <Info label="Render" value={order.render_status} />
              <Info label="Automation" value={order.automation_key} />
              <Info label="Order ID" value={order.id} />

              {videoDownloadUrl && (
                <a
                  href={videoDownloadUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block bg-[#1A1814] px-5 py-3 text-center text-[0.68rem] uppercase tracking-[0.14em] text-[#FDFCFA]"
                >
                  Download video
                </a>
              )}

            </div>
          </section>
        </div>

        {signedMedia.length > 0 && (
          <section className="mt-6 border border-black/[0.08] bg-white p-6">
            <h2 className="mb-6 text-[0.7rem] uppercase tracking-[0.15em] text-[#B8976A]">
              Photos
            </h2>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {signedMedia.map(item => (
                <div key={item.key}>
                  <div className="mb-2 text-[0.65rem] uppercase tracking-[0.12em] text-[#6B6560]">
                    {item.key}
                  </div>

                  {item.url ? (
                    <img
                      src={item.url}
                      alt={item.key}
                      className="aspect-[4/3] w-full object-cover"
                    />
                  ) : (
                    <div className="flex aspect-[4/3] items-center justify-center bg-[#F3F0EB] text-sm text-[#8A837D]">
                      Image unavailable
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}

function Info({
  label,
  value,
}: {
  label: string
  value: unknown
}) {
  return (
    <div>
      <div className="mb-1 text-[0.65rem] uppercase tracking-[0.12em] text-[#8A837D]">
        {label}
      </div>
      <div className="break-words text-sm text-[#1A1814]">
        {value ? String(value) : '—'}
      </div>
    </div>
  )
}
