
//Navbar

import React from 'react'
import Logo from '../assets/images/REVO_LOGO.png'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <>       

            <div className="rounded-lg mx-4 my-4 bg-white shadow-md h-20 flex items-center justify-between p-4">
                  <img src={Logo} alt="Logo" className="h-12 w-auto" />
                  <div className="flex items-center space-x-8">
                    <Link to="/all-products" className="text-lg font-bold hover:underline">
                      Products
                    </Link>
                    <Link to="/sign-up">
                      <button className="rounded-full bg-black text-white px-6 py-2 hover:bg-gray-800 transition">
                        Sign Up
                      </button>
                    </Link>
                    <Link to="/login">
                      <button className="rounded-full bg-black text-white px-6 py-2 hover:bg-gray-800 transition">
                        Log In
                      </button>
                    </Link>
                  </div>
                </div>  
     
      
    </>
  )
}

export default Navbar


