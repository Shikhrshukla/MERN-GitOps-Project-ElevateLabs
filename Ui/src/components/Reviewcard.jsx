
//Review Card 


import React from 'react';
import userProfile from '../assets/images/userProfile.jpg';

const Reviewcard = ({ review }) => {
 
  const renderStars = (rating) => {
    let stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rating ? "text-yellow-500" : "text-gray-400"}>
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="border border-gray-300 rounded-md p-4 bg-white">
      <div className="flex items-center mb-4">
        <img src={userProfile} alt="User Profile" className="w-12 h-12 rounded-full" />
        <div className="ml-4">
          <p className="text-lg font-semibold">{review.userDetails}</p>
          <div className="flex items-center mt-1">
            {/* Render star rating */}
            <div className="flex">
              {renderStars(review.rating)}
            </div>
            <p className="text-gray-500 ml-2">Posted on {new Date(review.createdAt).toLocaleDateString()}</p>
          </div>
          <p className="text-gray-600 mt-2">{review.reviewText}</p>
        </div>
      </div>
    </div>
  );
};

export default Reviewcard;











