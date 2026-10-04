import SiteShell from '@/components/SiteShell'
import GreetingsSection from '@/components/sections/GreetingsSection'
import { getGreetings, getHowItWorks } from '@/lib/queries'

export const revalidate = 60

export default async function VideoGreetingsPage() {
  const [greetings, steps] = await Promise.all([
    getGreetings().catch(() => []),
    getHowItWorks().catch(() => []),
  ])

  return (
    <SiteShell>
      <main>
        <GreetingsSection greetings={greetings} steps={steps} />
      </main>
    </SiteShell>
  )
}
