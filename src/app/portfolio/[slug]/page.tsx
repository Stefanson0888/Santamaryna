import { notFound } from 'next/navigation'
import SiteShell from '@/components/SiteShell'
import PortfolioDetail from '@/components/PortfolioDetail'
import { getPortfolioItemBySlug } from '@/lib/queries'

export const revalidate = 60

export default async function PortfolioItemPage({
  params,
}: {
  params: { slug: string }
}) {
  const item = await getPortfolioItemBySlug(params.slug).catch(() => null)

  if (!item) {
    notFound()
  }

  return (
    <SiteShell>
      <PortfolioDetail item={item} />
    </SiteShell>
  )
}
