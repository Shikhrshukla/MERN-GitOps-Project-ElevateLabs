

//Productcard.jsx

import React, {useState} from 'react';
import { getUserType } from '../pages/Loginpage';
import { Link } from 'react-router-dom';
import dummyImage from '../assets/images/placeholder.jpg'; 


const Productcard = ({ product }) => {
  const userType = getUserType();
  const id = product.productId;

  // Use imagePath instead of image
  const imageUrl = product?.imagePath ? `/api/${product.imagePath}` : dummyImage;

  const [showFullDescription, setShowFullDescription] = useState(false);

  let description = product.description;

  if (!showFullDescription) {
    description = description.substring(0, 100) + "  ..."
  }

  const toggleText = () => {
    setShowFullDescription(!showFullDescription)
  }



  const deleteProduct = async () => {
    const confirm = window.confirm('Sure want to delete?');
    if (!confirm) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Item Deleted Successfully');
        navigate('/products');
      } else {
        toast.error('Failed to delete product');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error deleting product');
    }
  };

  return (
    <div className="border border-solid border-gray-400 rounded-lg p-4 flex flex-col">
      <h2 className="text-xl font-semibold mb-2">{product.productName}</h2>
      <img
        src={imageUrl}
        alt="product thumbnail"
        className="max-w-full max-h-full object-cover rounded-md mb-2"
      />
      <p className="text-black mb-2">{description}</p>

      <button onClick={toggleText} className='flex w-full ml-10 mb-5 text-blue-500 hover:text-blue-800'>{showFullDescription ? ' Less': '...'}</button>

      <div className="flex justify-between items-center">
        {userType === 'user' && (
          <Link to={`/view-product/${product.productId}`}>
            <button className="rounded-full bg-teal-500 px-8 py-2 hover:outline-double hover:outline-teal-500">
              View
            </button>
          </Link>
        )}
        {userType === 'admin' && (
          <Link to={`/product-reviews/${product.productId}`}>
            <button className="rounded-full bg-teal-500 px-8 py-2 hover:outline-double hover:outline-teal-500">
              View
            </button>
          </Link>
        )}
        {userType === 'admin' && (
          <Link to="/products">
            <button
              onClick={() => deleteProduct(id)}
              className="rounded-full bg-red-600 px-8 py-2 hover:outline-double hover:outline-red-600"
            >
              Delete
            </button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Productcard;









//----------------------------------------------------------------------------------------------------------------

