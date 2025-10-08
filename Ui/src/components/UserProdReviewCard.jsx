
//UserProdReviewCard component


import React from 'react';
import dummyImage from '../assets/images/placeholder.jpg'; 
import { productLoader } from '../pages/Addreviewpage';

const UserProdReviewCard = ({ product }) => {
 

  const imageUrl = product?.imagePath ? `/api/${product.imagePath}` : dummyImage;


 
const review = product.reviews[product.reviews.length - 1] || {}; 

const renderStars = (rating) => {
  return [...Array(5)].map((_, index) => (
    <span key={index} className={`text-xl ${index < rating ? 'text-yellow-500' : 'text-gray-400'}`}>
      ★
    </span>
  ));
};

return (
  <div className="my-8 text-md">
    <div className="border border-gray-300 rounded-md p-4 bg-white">
      <div className="flex items-center mb-4">
        <img src={imageUrl} alt="Product" className="h-28 border border-solid" />
        <div className="ml-4">
          <p className="text-md font-semibold">{product.productName}</p>
          <p className="text-md font-semibold">Category: {product.category}</p>
          <p className="text-md font-semibold">{product.description}</p>
          <p className="text-md font-semibold">Price: {product.price}</p>
          <div className="mt-1">
            {/* Display review text if available */}
            {review.reviewText && (
              <p className="text-gray-600">{review.reviewText}</p>
            )}
            {/* Display rating if available */}
            {review.rating && (
              <div className="flex items-center mt-2">
                {renderStars(review.rating)}
              </div>
            )}
            {/* If both review text and rating are present */}
            {review.reviewText && review.rating && (
              <p className="text-gray-500 mt-2">Posted on {new Date(review.createdAt).toLocaleDateString()}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
  
  
  
  );
};

export default UserProdReviewCard;








