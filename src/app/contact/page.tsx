import SiteShell from '@/components/SiteShell'
import ContactSection from '@/components/sections/ContactSection'
import { getSiteSettings } from '@/lib/queries'

export const revalidate = 60

export default async function ContactPage() {
  const settings = await getSiteSettings().catch(() => null)

  return (
    <SiteShell>
      <main>
        <ContactSection settings={settings} />
      </main>
    </SiteShell>
  )
}
