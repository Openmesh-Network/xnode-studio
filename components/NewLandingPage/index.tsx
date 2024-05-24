import Footer from '../Homepage/Footer'
import { HomeHero } from '../Homepage/Hero'
import { HomeBenefits } from '../Homepage/Benefits'
import { HomeAdvantages } from '../Homepage/Advantages'

export default function NewLandingPage() {
  return (
    <div className="w-full">
      <HomeHero />
      <HomeBenefits />
      <HomeAdvantages />
      <Footer />
    </div>
  )
}
