import { HomeAdvantages } from '../Homepage/Advantages'
import { HomeBenefits } from '../Homepage/Benefits'
import Footer from '../Homepage/Footer'
import { HomeHero } from '../Homepage/Hero'

export default function NewLandingPage() {
  return (
    <div className="w-full">
      <HomeHero />
      <HomeBenefits />
      <HomeAdvantages />
    </div>
  )
}
