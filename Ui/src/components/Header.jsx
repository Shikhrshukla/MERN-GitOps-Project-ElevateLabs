
// Header component


import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getUserType } from '../pages/Loginpage';
import Logout from './Logout';
import Productcard from './Productcard';

const Header = () => {
  const userType = getUserType();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showHeading, setShowHeading] = useState('');
  const targetPath = userType === 'admin' ? '/admin-home' : '/user-home';

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleSearch = async () => {

    setShowHeading(true);

    setTimeout(() => {
        setShowHeading(false);
    }, 5000);


    if (selectedCategory) {
      try {
        const res = await fetch(`/api/products/category/${selectedCategory}`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data);
        } else {
          console.error('Failed to fetch products');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    }
  };

  return (
    <>
      <header className="bg-gradient-to-r from-orange-400 via-yellow-300 to-orange-500  h-24 p-8 flex items-center justify-between">
        <div className="text-white font-semibold flex items-center space-x-4">
          
        <Link to={targetPath} className="hover:underline">Home</Link>

          {userType === 'admin' && (
            <Link to="/add-product" className="hover:underline">Add Product</Link>
          )}
          {userType === 'user' && (
            <Link to="/user-home/reviewed-products" className="hover:underline">Your Reviews</Link>
          )}
              </div>
              

              <div className="flex items-center bg-white border-2 border-gray-300 rounded-lg ">
                <select
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="bg-white text-gray-600 rounded-l-lg py-2 px-4 leading-tight focus:outline-none focus:border-blue-500"
                >
                <option value="" className='text-gray-400'>Select Category</option>
                <option value="MobilePhonesAccessories">Mobile Phones & Accessories</option>
                <option value="Electronics">Electronics</option>
                <option value="Laptops">Laptops</option>
                </select>
                <button
                onClick={handleSearch}
                className="bg-black text-white rounded-r-lg px-4 py-2 border-2 border-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                Search
                </button>
              </div>


        <div className="text-white font-semibold">
          <Logout />
        </div>
      </header>

      {/* Display search results */}
      <div className="container mx-auto py-4">
        
        {showHeading && (
                <h2 className="text-2xl font-bold mb-4">
                    Search Results
                </h2>
            )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {searchResults.map((product) => (
            <Productcard key={product.productId} product={product} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Header;






