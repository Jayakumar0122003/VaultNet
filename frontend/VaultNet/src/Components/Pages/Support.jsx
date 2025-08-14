import React from 'react'
import SupportBanner from './Support/SupportBanner'

import FAQSection from './Support/FAQSection'

import Footer from '../Home/Footer'
import SupportApi from './Support/SupportApi'

function Support() {

  return (
    <div>
      <SupportBanner/>
      <SupportApi/>
      <FAQSection/>
      <Footer/>
    </div>
  )
}

export default Support