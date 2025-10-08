import React from 'react'
import Navbar from '../components/Navbar'
import AddReviewSc from '../assets/images/AddReview_screenshot.png'
import ProductListSc from '../assets/images/Productlist_screenshot.png'
import UserProfileSc from '../assets/images/UserProfile_screenshot.png'
import Footer from '../components/Footer'

const Indexpage = () => {
  return (
    <>
        
            <div className='bg-amber-300 min-h-screen flex flex-col'>
                <Navbar/>

                <div className="h-96  bg-gradient-to-r from-orange-400 via-orange-500 to-orange-400">
                    <p className=" text-white bg-clip-text font-extrabold font-sans text-5xl text-center p-24 animated-text">"Review, Reflect, Decide: Your Trusted <br /> Guide to Honest Feedback"</p>
                    
                </div>

                <style jsx>
                        {`
                        .animated-text {
                            background: linear-gradient(45deg,white,transparent,yellow, white);
                            background-size: 300% 300%;
                            -webkit-background-clip: text; /* Clips the gradient to text */
                            -webkit-text-fill-color: transparent; /* Makes the text itself transparent */
                            animation: text-flow 3s infinite linear;
                        }

                        @keyframes text-flow {
                            0% {
                            background-position: 0% 0%;
                            }
                            100% {
                            background-position: 100% 100%;
                            }
                        }
                        `}
                </style>


                <div className="bg-black ">
                    <br />
                    <br />
                    <div className="mr-28 mb-8 backdrop-blur-sm  bg-white/20 rounded-r-3xl">
                        <div className="flex gap-10   h-2/5 ml-0 p-24">
                            <div className="text-white">   
                                <p className="text-3xl font-semibold">Add Reviews to Products</p>
                                <p className="text-xl font-semibold mt-12">Welcome to the review writing section of our app! <br /> Your opinions matter, and sharing your experiences can help <br /> others make informed decisions.</p>
                            </div> 
                            <img src={AddReviewSc}className="rounded-md h-80 w-4/5 border border-solid border-gray-400" />
                        </div>
                    </div>
                    <hr />
                    <div className="ml-28 mb-8 mt-8 backdrop-blur-sm  bg-white/20 rounded-l-3xl">
                        <div className="flex gap-10  h-2/5 ml-0 p-24">
                            <img src={ProductListSc} className="rounded-md h-80 w-3/5 border border-solid border-gray-400" />
                            <div className="text-white">
                                <p className="text-3xl font-semibold">View Products</p>
                                <p className="text-xl font-semibold mt-12">Search for your favourite products! </p>
                            </div>
                        </div>
                    </div>
                    <hr />
                    <div className="mr-28 mt-8 mb-8 backdrop-blur-sm  bg-white/20 rounded-r-3xl">
                        <div className="flex gap-10  h-2/5 ml-0 p-24">
                            <div className="text-white">
                                <p className="text-3xl font-semibold">Your Reviews</p>
                                <p className="text-xl font-semibold mt-12">See what all reviews you have given.</p>
                            </div>
                        <img src={UserProfileSc} className="rounded-md h-80 w-3/5 border border-solid border-gray-400" />
                        </div>
                    </div> 
                    <br /><br />  
                </div>
            </div>
       
        <Footer />
    </>
  )
}

export default Indexpage