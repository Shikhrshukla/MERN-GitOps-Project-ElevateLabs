

//Review Cards for displaying 


import React from 'react'
import Reviewcard from './Reviewcard'
import { useEffect,useState } from 'react'
import {BarLoader} from 'react-spinners'

const ReviewCards = () => {
  
                 const [review, setReviews] = useState([]);
              const [loading, setLoading] = useState(true)
             
              useEffect( () => {
          

                  const fetchreview = async () => {
                      try {
                          const res = await fetch('/api/reviews');
                          const data = await res.json()
                          setReviews(data)
                      } catch (error) {
                          console.log('error', error)
                      } finally {
                          setLoading(false)
                      }
                  };
                  fetchreview()
              },[])
              const reviewList = isHome ? review.slice(0, 3) : review;
    console.log("review===", review)
                  
    return (
        <>  

            <div>
                    
                <div className="mx-24 bg-white">
                        <div className="mt-0 h-full p-6">
                            <h1 className="font-semibold text-center text-4xl ">Reviews</h1>
                        </div>

                      <h1>{isHome ? 'Top reviews' : 'All reviews'}</h1>
                      {loading ? <BarLoader /> : <div className='grid grid-rows-2 grid-cols-3 gap-4 p-8'>
                          {reviewList.map((review) => (
                              <Reviewcard key={review.reviewId} review={review} />
                          ))}
                      </div>}

                </div>


            </div>

    </>
  )
}

export default ReviewCards





