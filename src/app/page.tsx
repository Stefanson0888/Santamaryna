import { LangProvider } from '@/lib/lang'
import Navbar from '@/components/Navbar'
import HeroSection from '@/components/sections/HeroSection'
import PortfolioSection from '@/components/sections/PortfolioSection'
import ServicesSection from '@/components/sections/ServicesSection'
import GreetingsSection from '@/components/sections/GreetingsSection'
import ContactSection from '@/components/sections/ContactSection'
import Footer from '@/components/Footer'
import { getSiteSettings, getPortfolioItems, getServices, getGreetings, getHowItWorks } from '@/lib/queries'

export const revalidate = 60

export default async function HomePage() {
  const [settings, portfolio, services, greetings, steps] = await Promise.all([
    getSiteSettings().catch(() => null),
    getPortfolioItems().catch(() => []),
    getServices().catch(() => []),
    getGreetings().catch(() => []),
    getHowItWorks().catch(() => []),
  ])

  return (
    <LangProvider>
      <Navbar />
      <main>
        <HeroSection settings={settings} />
        <PortfolioSection items={portfolio} />
        <ServicesSection services={services} />
        <GreetingsSection greetings={greetings} steps={steps} />
        <ContactSection settings={settings} />
      </main>
      <Footer />
    </LangProvider>
  )
}
