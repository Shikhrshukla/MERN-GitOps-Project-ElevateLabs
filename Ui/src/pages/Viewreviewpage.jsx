
//View Review Page------------



import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import Reviewcard from '../components/Reviewcard';
import { useLoaderData } from 'react-router-dom';
import dummyImage from '../assets/images/placeholder.jpg'; 

const Viewreviewpage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();

  const imageUrl = product?.imagePath ? `/api/${product.imagePath}` : dummyImage;

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`/api/products/${id}`);
        if (response.ok) {
          const data = await response.json();
          setProduct(data);
          setReviews(data.reviews || []); 
        } else {
          throw new Error('Failed to fetch product details');
        }
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };

    if (id) {
      fetchProductDetails();
    }
  }, [id]);

  return (
    <>
      <Header showSearchBar={false} />
      <form className="mx-52 my-12 bg-white p-24 shadow-md h-full max-h-fit">
        <p className="text-xl font-sans font-semibold p-6">{product?.productName || 'Loading...'}</p>
        <div className="grid grid-cols-2 ">
          <img src={imageUrl} alt="Product" className="max-h-96 max-w-fit border border-none" />
          <div>
            <p className="text-3xl font-sans font-semibold">{product?.productName}</p><br />
            <p className="text-2xl font-sans">{product?.description}</p><br />
            <p className="text-xl font-sans text-red-500">Price: {product?.price}</p>
          </div>
          
        </div>
        <br />
        

        <Link to={`/update-product/${id}`}>
          <button className="rounded-full w-24 float-end bg-cyan-500 px-4 py-2 hover:outline-double hover:outline-cyan-500">Edit</button>
        </Link>
        <br />

        <p className="text-xl font-bold">Customer Ratings</p>

        <div className="my-12">
          <div className="overflow-x-auto">
            {reviews.length > 0 ? (
              reviews.map((review, index) => (
                <Reviewcard key={index} review={review} />
              ))
            ) : (
              <p>No ratings or reviews available!</p>
            )}
          </div>
        </div>
      </form>
    </>
  );
};




const productLoader = async ({ params }) => {
  const res = await fetch(`/api/products/${params.id}`);
  const data = await res.json();
  return data;
}


const getUserEmail = () => {
const authToken = document.cookie
  .split("; ")
  .find((row) => row.startsWith("Authtoken"))
  ?.split("=")[1];
console.log("document.cookie value", authToken);

const decoded = jwtDecode(authToken);
console.log("decoded", decoded);
const userEmail = decoded.userEmail;
console.log("useremail", userEmail);
return userEmail;
};

export { Viewreviewpage as default, getUserEmail,productLoader };





