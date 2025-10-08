import React from 'react'
import Prodcard from './Prodcard';
import { useEffect,useState } from 'react'
import { BarLoader } from 'react-spinners'


const ProdCards = () => {

    const [product, setProduct] = useState([]);
    const [loading, setLoading] = useState(true)
   

    useEffect(() => {

        const fetchProduct = async () => {
            try {
                const res = await fetch('/api/all-products');
                const data = await res.json()
                setProduct(data)
            } catch (error) {
                console.log('error', error)
            } finally {
                setLoading(false)
            }
        };
        fetchProduct()
    }, [])
    
    const productList = product;
              console.log("product===",product)


  return (
      <>

<div>
                    
              <div className="mx-24 bg-white">
                 
                            <div className="mt-0 h-full p-6">
                                <h1 className="font-semibold text-center text-4xl ">Items</h1>
                            </div>
    
                          <h1 className='font-semibold text-xl text-white h-11 p-2 rounded-lg bg-gradient-to-r from-neutral-500 to-neutral-400'> All products</h1>
                          {loading ? <BarLoader /> : <div className='grid grid-rows-2 grid-cols-3 gap-4 p-8'>
                              {productList.map((product) => (
                                  <Prodcard key={product.productId} product={product} />
                              ))}
                          </div>}
                    </div>
                </div>
      
      
      </>
  )
}

export default ProdCards