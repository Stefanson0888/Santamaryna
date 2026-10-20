import { notFound } from 'next/navigation'
import SiteShell from '@/components/SiteShell'
import { getGreetingBySlug } from '@/lib/queries'
import GreetingOrderForm from '@/components/GreetingOrderForm'

export const revalidate = 60

export default async function GreetingPage({
  params,
}: {
  params: { slug: string }
}) {
  const greeting = await getGreetingBySlug(params.slug).catch(() => null)

  if (!greeting) {
    notFound()
  }

  return (
    <SiteShell>
      <main className="min-h-screen bg-[#FDFCFA] px-5 pb-16 pt-[120px] sm:px-8 lg:px-12">
        <div className="mx-auto max-w-5xl">
          <div className="section-label">Personalized Video</div>

          <h1
            className="mb-5 text-[3rem] font-light leading-none text-[#1A1814] sm:text-[4rem]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {greeting.titleEn}
          </h1>

          <p className="mb-8 max-w-2xl text-[0.9rem] leading-[1.8] text-[#6B6560]">
            {greeting.descEn}
          </p>

          <div className="text-[1.8rem] text-[#1A1814]">
            {greeting.currency || '$'}{greeting.price}
          </div>

          <div className="mt-12">
            <GreetingOrderForm greeting={greeting} />
          </div>
        </div>
      </main>
    </SiteShell>
  )
}
