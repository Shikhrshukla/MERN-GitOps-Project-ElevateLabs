
//UserReviewsPage


import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import UserProdReviewCard from '../components/UserProdReviewCard';

import { useLocation } from 'react-router-dom';
import { getUserEmail } from './Addreviewpage';
import { productLoader } from './Addreviewpage';


const UserReviewsPage = () => {
  const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
        const reviewedProduct = location.state?.reviewedProduct;
        
        const userEmail = getUserEmail(); 

      



  useEffect(() => {
    const fetchReviewedProducts = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/user-home/reviewed-products', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setProducts(data); 
        } else {
          throw new Error('Failed to fetch reviewed products');
        }
      } catch (error) {
        console.error('Error fetching reviewed products:', error);
      } finally {
        setLoading(false); 
      }
    };

    fetchReviewedProducts();
        }, []);
    

  return (
    <>
       <Header />
      <div className="mx-24 bg-white">
        <div className="p-8">
          <h3 className="font-semibold text-4xl">Your Reviews</h3>
         {loading ? <p>Loading...</p> : (
            <div className="mt-6">
              {products.length > 0 ? (
                products.map((product) => (
                  <UserProdReviewCard key={product.productId} product={product} />
                ))
              ) : (
                <p className='text-3xl font-semibold ml-28 mt-12'>No reviews found!</p>
              )}
            </div>
          )}
        </div>
      </div> 
          
         


    </>
  );
};



export { UserReviewsPage as default, productLoader, getUserEmail };
    
    
    



