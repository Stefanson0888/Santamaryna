import SiteShell from '@/components/SiteShell'
import PortfolioSection from '@/components/sections/PortfolioSection'
import { getPortfolioItems } from '@/lib/queries'

export const revalidate = 60

export default async function PortfolioPage() {
  const portfolio = await getPortfolioItems().catch(() => [])

  return (
    <SiteShell>
      <main>
        <PortfolioSection items={portfolio} />
      </main>
    </SiteShell>
  )
}
