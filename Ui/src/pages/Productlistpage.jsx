
//Productlistpage

import React from 'react'
import Header from '../components/Header'
import ProductCards from '../components/ProductCards'
import Footer from '../components/Footer'

const Productlistpage = () => {
  return (
    <>
        <Header showSearchBar={true} />
        <ProductCards />
        <Footer/>

    </>
  )
}

export default Productlistpage

