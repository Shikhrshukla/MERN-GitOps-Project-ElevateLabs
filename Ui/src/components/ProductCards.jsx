import React from 'react'
import Productcard from './Productcard'
import { useEffect,useState } from 'react'
import {BarLoader} from 'react-spinners'

const ProductCards = ({ isHome = false }) => {

              const [product, setProduct] = useState([]);
              const [loading, setLoading] = useState(true)
              
              useEffect(() => {

                  const fetchProduct = async () => {
                      try {
                          const res = await fetch('/api/products');
                          const data = await res.json()
                          setProduct(data)
                      } catch (error) {
                          console.log('error', error)
                      } finally {
                          setLoading(false)
                      }
                  };
                  fetchProduct()
              },[])
              const productList = isHome ? product.slice(0, 3) : product;
              console.log("product===",product)

  return (
    <>
        
            <div>
                    
                <div className="mx-24 bg-white">
                        <div className="mt-0 h-full p-6">
                            <h1 className="font-semibold text-center text-4xl ">Items</h1>
                        </div>

                      <h1 className='font-semibold text-xl text-white h-11 p-2 rounded-lg bg-gradient-to-r from-neutral-500 to-neutral-400'>{isHome ? 'Top products' : 'All products'}</h1>
                      {loading ? <BarLoader /> : <div className='grid grid-rows-2 grid-cols-3 gap-4 p-8'>
                          {productList.map((product) => (
                              <Productcard key={product.productId} product={product} />
                          ))}
                      </div>}
                </div>
            </div>
    </>
  )
}

export default ProductCards