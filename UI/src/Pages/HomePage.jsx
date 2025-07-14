import React, { useEffect, useState } from 'react';
import Sidebar from './sidebar';
import API from '../API';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const userID = localStorage.getItem('userID');
    if (!userID) {
      navigate('/');
      return;
    }

    API.get('/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error('Error fetching products:', err));
  }, [navigate]);

  const handleProductClick = (product) => {
    if (product?.product_id) {
      navigate(`/product/${product.product_id}`);
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
        <h2 className="text-2xl font-bold mb-6">All Products</h2>

        {products.length === 0 ? (
          <p className="text-gray-500">No products available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.product_id}
                className="cursor-pointer border rounded-xl p-4 bg-white shadow-sm hover:shadow-xl transition"
                onClick={() => handleProductClick(product)}
              >
                <img
                    src={`http://localhost:5000/api/images/${product.imageURL}`}
                    alt={product.product_name}
                    className="w-full h-48 object-contain rounded"
                    onError={(e) => e.target.src = 'https://via.placeholder.com/200x200?text=No+Image'}
                />
                <h3 className="text-lg font-semibold mt-3">{product.product_name}</h3>
                <p className="text-blue-600 font-bold">₹{product.amount}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;