import React from 'react'
import Banner from './Home/Banner.jsx'
import Features from './Home/Features.jsx'
import FeatureCards from './Home/FeatureCards.jsx'
import TestimonialsSection from './Home/TestimonialsSection.jsx'
import CurrencyRatesSection from './Home/CurrencyRatesSection.jsx'
import BranchLocatorSection from './Home/BranchLocatorSection.jsx'

function Home() {
  return (
    <>
    <Banner/>
    <Features/>
    <FeatureCards/>
    <CurrencyRatesSection/>
    <BranchLocatorSection/>
    <TestimonialsSection/>
    </>
  )
}

export default Home