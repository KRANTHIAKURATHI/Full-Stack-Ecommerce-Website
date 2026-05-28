import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../API';

function Sidebar() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    API.get('/categories')
      .then(res => setCategories(res.data))
      .catch(err => console.error('Error fetching categories:', err));
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim().length > 1) {
        API.get(`/products/search/query?q=${searchQuery}`)
          .then(res => setSearchResults(res.data))
          .catch(err => console.error('Search Error:', err));
      } else {
        setSearchResults([]);
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleNavigation = (path) => {
    const token = localStorage.getItem('token');
    const userID = localStorage.getItem('userID');
    if (!token || !userID) {
      navigate('/'); 
    } else {
      navigate(path);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('userID');
    localStorage.removeItem('token'); 
    setSearchQuery('');
    setSearchResults([]);
    navigate('/');
  };

  const handleResultClick = (id) => {
    setSearchQuery('');
    setSearchResults([]);
    navigate(`/product/${id}`);
  };

  return (
    <div className="bg-gray-900 text-white w-64 p-5 flex flex-col justify-between h-screen sticky top-0 border-r border-gray-800">
      <div>
        {/* Clickcharm Branding */}
        <div className="mb-6 pb-5 border-b border-gray-700">
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-blue-600">
            Clickcharm
          </h1>
          <p className="text-xs text-gray-400 mt-1">Your Shopping Destination</p>
        </div>

        <div className="relative mb-8">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full bg-gray-800 text-white text-sm rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          
          {/* Dropdown for Results */}
          {searchResults.length > 0 && (
            <div className="absolute left-0 right-0 bg-white text-black mt-2 rounded-md shadow-2xl z-50 max-h-60 overflow-y-auto">
              {searchResults.map((product) => (
                <div 
                  key={product.product_id}
                  onClick={() => handleResultClick(product.product_id)}
                  className="flex items-center p-3 hover:bg-gray-100 cursor-pointer border-b last:border-0"
                >
                  <img 
                    src={`http://localhost:5000/api/images/${product.imageURL}`} 
                    alt="" 
                    className="w-10 h-10 object-cover rounded mr-3" 
                  />
                  <div className="overflow-hidden">
                    <p className="text-sm font-bold truncate">{product.product_name}</p>
                    <p className="text-xs text-gray-500 font-semibold">₹{product.amount}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No Results found message */}
          {searchQuery.length > 1 && searchResults.length === 0 && (
            <div className="absolute left-0 right-0 bg-white text-gray-400 mt-2 rounded-md p-3 text-xs text-center shadow-lg">
              No results found
            </div>
          )}
        </div>

        <h2 className="text-xl font-bold mb-6 cursor-pointer hover:text-blue-400 transition" onClick={() => handleNavigation('/HomePage')}>
          Categories
        </h2>
        <div className="space-y-2">
          {categories.map((category) => (
            <div
              key={category.category_id}
              className="cursor-pointer p-2 hover:bg-gray-800 rounded transition text-gray-300"
              onClick={() => handleNavigation(`/products/${category.category_id}`)}
            >
              {category.category_name}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4 pt-6 border-t border-gray-800">
        <p className="cursor-pointer hover:text-blue-400 flex items-center" onClick={() => handleNavigation('/cart')}>🛒 Cart</p>
        <p className="cursor-pointer hover:text-blue-400 flex items-center" onClick={() => handleNavigation('/orders')}>📦 Orders</p>
        <p className="cursor-pointer text-red-400 hover:text-red-500 font-medium flex items-center" onClick={handleSignOut}>🚪 Sign Out</p>
      </div>
    </div>
  );
}

export default Sidebar;