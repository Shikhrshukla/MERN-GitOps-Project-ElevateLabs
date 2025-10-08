

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Header from '../components/Header';
import Footer from '../components/Footer';

const AddProductPage = () => {
  const [productName, setProductName] = useState('');
  const [productId, setproductId] = useState('');
  const [category, setProductCategory] = useState('MobilePhonesAccessories');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const submitForm = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('productName', productName);
    formData.append('productId', productId);
    formData.append('category', category);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('image', image); // Add image file to form data

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        body: formData
      });

      if (res.ok) {
        toast.success('Product added successfully');
        navigate('/products');
      } else {
        toast.error('Failed to add product');
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred');
    }
  };

  return (
    <>
      <Header />

      <section className="bg-white mb-20">
        <div className="container m-auto max-w-2xl py-2">
          <div className="px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0">
            <form onSubmit={submitForm} encType="multipart/form-data">
              <h2 className="text-3xl text-black text-center font-semibold mb-6">
                Add Product
              </h2>

              {/* Product Name */}
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Product Name</label>
                <input
                  type="text"
                  id="productName"
                  name="productName"
                  className="border rounded w-full py-2 px-3 mb-2"
                  placeholder="eg. Redmi"
                  required
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                />
              </div>

              {/* Product ID */}
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Product Id</label>
                <input
                  type="text"
                  id="productId"
                  name="productId"
                  className="border rounded w-full py-2 px-3 mb-2"
                  placeholder="eg. 1"
                  required
                  value={productId}
                  onChange={(e) => setproductId(e.target.value)}
                />
              </div>

              {/* Product Category */}
              <div className="mb-4">
                <label htmlFor="category" className="block text-gray-700 font-bold mb-2">Product category</label>
                <select
                  id="category"
                  name="category"
                  className="border rounded w-full py-2 px-3"
                  required
                  value={category}
                  onChange={(e) => setProductCategory(e.target.value)}
                >
                  <option value="MobilePhonesAccessories">Mobile Phones & Accessories</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Laptops">Laptops</option>
                </select>
              </div>

              {/* Description */}
              <div className="mb-4">
                <label htmlFor="description" className="block text-gray-700 font-bold mb-2">Description</label>
                <textarea
                  id="description"
                  name="description"
                  className="border rounded w-full py-2 px-3"
                  rows="4"
                  placeholder="Small description on the Product"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>

              {/* Price */}
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2" htmlFor="price">Price</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  className="border border-gray-300 rounded w-full py-2 px-4"
                  placeholder="e.g., 5000"
                  required
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>

              {/* Product Image */}
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2" htmlFor="image">Product Image</label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/jpeg, image/png"
                  className="border border-gray-300 rounded w-full py-2 px-4"
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </div>

              {/* Submit Button */}
              <div>
                <button
                  className="bg-amber-400 hover:bg-orange-400 my-10 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline"
                  type="submit"
                >
                  Add Product
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default AddProductPage;














//---------------------------------------------------------------------------------------------------------------------

