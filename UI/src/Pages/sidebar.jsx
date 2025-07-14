import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../API';

function Sidebar() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    API.get('/categories')
      .then(res => setCategories(res.data))
      .catch(err => console.error('Error fetching categories:', err));
  }, []);

  const handleNavigation = (path) => {
    const userID = localStorage.getItem('userID');
    if (!userID) {
      navigate('/'); // Redirect to login
    } else {
      navigate(path);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('userID');
    navigate('/');
  };

  return (
    <div className="bg-gray-900 text-white w-48 p-6 flex flex-col justify-between h-screen">
      <div>
        <h2
          className="text-xl font-bold mb-6 cursor-pointer"
          onClick={() => handleNavigation('/HomePage')}
        >
          Categories
        </h2>
        {categories.map((category) => (
          <div
            key={category.category_id}
            className="cursor-pointer p-2 hover:bg-gray-700 rounded"
            onClick={() => handleNavigation(`/products/${category.category_id}`)}
          >
            {category.category_name.charAt(0).toUpperCase() + category.category_name.slice(1)}
          </div>
        ))}
      </div>

      <div>
        <p className="cursor-pointer mb-2" onClick={() => handleNavigation('/cart')}>Cart</p>
        <p className="cursor-pointer mb-2" onClick={() => handleNavigation('/orders')}>Orders</p>
        <p className="cursor-pointer" onClick={handleSignOut}>Sign Out</p>
      </div>
    </div>
  );
}

export default Sidebar;