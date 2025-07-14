import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../API';
import Sidebar from './sidebar';

function ProductDetailsPage() {
  const { product_id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await API.get(`/products/${product_id}`);
        setProduct(res.data);
      } catch (error) {
        console.error('Error loading product:', error);
      }
    };
    fetchProduct();
  }, [product_id]);

  const handleAddToCart = async () => {
    const user_id = localStorage.getItem('userID');
    try {
      await API.post(`/cart/add/${product_id}`, { user_id });
      alert('Added to cart');
    } catch (err) {
      alert('Failed to add to cart');
    }
  };

  const handleBuyNow = async () => {
    const user_id = localStorage.getItem('userID');
    try {
      await API.post('/orders/buy_now', {
        user_id,
        product_id,
        amount: product.amount,
      });
      alert('Order placed successfully!');
      navigate('/orders');
    } catch (err) {
      console.error('Order failed:', err);
      alert('Failed to place order. Please try again.');
    }
  };

  if (!product) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-lg shadow-md p-8 flex flex-col md:flex-row gap-10 items-center w-full max-w-5xl">
          <div className="md:w-1/2 w-full flex justify-center">
            <img
              src={`http://localhost:5000/api/images/${product.imageURL}`}
              alt={product.product_name}
              className="w-full max-w-sm h-72 object-contain rounded"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
              }}
            />
          </div>

          <div className="md:w-1/2 w-full text-center md:text-left">
            <h1 className="text-2xl font-bold mb-2">{product.product_name}</h1>
            <p className="text-gray-600 mb-1">
              Category: <span className="capitalize">{product.category_name || 'N/A'}</span>
            </p>
            <p className="text-blue-600 text-xl font-semibold mt-2">₹{product.amount}</p>

            <div className="flex flex-col md:flex-row gap-4 mt-6 justify-center md:justify-start">
              <button
                onClick={handleAddToCart}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded"
              >
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailsPage;
