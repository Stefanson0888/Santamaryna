import SiteShell from '@/components/SiteShell'
import ServicesSection from '@/components/sections/ServicesSection'
import { getServices } from '@/lib/queries'

export const revalidate = 60

export default async function ServicesPage() {
  const services = await getServices().catch(() => [])

  return (
    <SiteShell>
      <main>
        <ServicesSection services={services} />
      </main>
    </SiteShell>
  )
}
