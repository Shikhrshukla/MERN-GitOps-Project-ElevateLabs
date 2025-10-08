import React from 'react'
import ProductCards from '../components/ProductCards'
import Header from '../components/Header'
import Footer from '../components/Footer'

const Adminhomepage = () => {
  return (
    <>
          <Header />
          <ProductCards isHome={true} />
          <Footer />  
    </>
  )
}

export default Adminhomepage