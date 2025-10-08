
// Editproductpage   ------------------------------------



import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Editproductpage = () => {
  const [productName, setProductName] = useState('');
  const [productId, setProductId] = useState('');
  const [category, setProductCategory] = useState('MobilePhonesAccessories');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const { id } = useParams(); 
  const navigate = useNavigate();

  
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`/api/products/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch product details');
        }
        const data = await response.json();
        setProductName(data.productName);
        setProductId(data.productId);
        setProductCategory(data.category);
        setDescription(data.description);
        setPrice(data.price);
      } catch (error) {
        console.error('Error fetching product details:', error);
        toast.error('Failed to load product details');
      }
    };

    fetchProductDetails();
  }, [id]);

  const submitForm = async (e) => {
    e.preventDefault();
    const updatedProduct = {
      productName,
      productId,
      category,
      description,
      price
    };
    try {
      const res = await updateProductSubmit(updatedProduct);
      if (res.ok) {
        toast.success('Product updated successfully');
        navigate('/products');
      } else {
        throw new Error('Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
    }
  };

  const updateProductSubmit = async (updatedProduct) => {
    const res = await fetch(`/api/products/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedProduct)
    });
    return res;
  };

  return (
    <>
      <Header />

      <section className="bg-white mb-20">
        <div className="container m-auto max-w-2xl py-2">
          <div className="px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0">
            <form onSubmit={submitForm}>
              <h2 className="text-3xl text-black text-center font-semibold mb-6">
                Edit Product
              </h2>

              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">
                  Product Title
                </label>
                <input
                  type="text"
                  id="productName"
                  name="productName"
                  className="border rounded w-full py-2 px-3 mb-2"
                  placeholder="e.g. Redmi"
                  required
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">
                  Product Id
                </label>
                <input
                  type="text"
                  id="productId"
                  name="productId"
                  className="border rounded w-full py-2 px-3 mb-2"
                  placeholder="e.g. 1"
                  required
                  value={productId}
                  readOnly
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="category"
                  className="block text-gray-700 font-bold mb-2"
                >
                  Product category
                </label>
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

              <div className="mb-4">
                <label
                  htmlFor="description"
                  className="block text-gray-700 font-bold mb-2"
                >
                  Description
                </label>
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

              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2" htmlFor="price">
                  Price
                </label>
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

              <div>
                <button
                  className="bg-amber-400 hover:bg-orange-400 my-10 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline"
                  type="submit"
                >
                  Update
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

export default Editproductpage;







