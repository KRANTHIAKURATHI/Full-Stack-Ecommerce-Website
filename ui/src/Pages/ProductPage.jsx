import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../API';
import Sidebar from './sidebar';

function ProductsPage() {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('userID')) {
      navigate('/');
      return;
    }

    setLoading(true);
    setError('');

    API.get(`/products/category_id/${category}`) 
      .then(res => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching products by category ID:', err);
        setError('No products found for this category.');
        setLoading(false);
      });
  }, [category, navigate]);

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-50 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 capitalize">Products</h2>

        {loading ? (
          <p>Loading products...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : products.length === 0 ? (
          <p>No products available in this category.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map(product => (
              <div
                key={product.product_id}
                className="cursor-pointer border p-4 bg-white rounded-xl shadow hover:shadow-lg transition"
                onClick={() => navigate(`/product/${product.product_id}`)}
              >
                <img
                    src={`http://localhost:5000/api/images/${product.imageURL}`}
                    alt={product.product_name}
                    className="w-full h-48 object-contain rounded"
                    onError={(e) => e.target.src = 'https://via.placeholder.com/200x200?text=No+Image'}
                />
                <h3 className="text-lg font-semibold mt-2">{product.product_name}</h3>
                <p className="text-blue-600 font-bold">₹{product.amount}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductsPage;