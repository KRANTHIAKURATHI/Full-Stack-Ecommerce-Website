// CartPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../API';
import Sidebar from './sidebar';

function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();
  const userID = localStorage.getItem('userID');

  const fetchCart = async () => {
    if (!userID) {
      navigate('/');
      return;
    }

    try {
      const res = await API.get(`/cart/${userID}`);
      if (res.data?.data) {
        setCartItems(res.data.data.cart_items || []);
      } else {
        setCartItems([]);
      }
    } catch (err) {
      console.error('Failed to fetch cart:', err);
      setCartItems([]);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [userID]);

  const handleRemoveItem = async (productID) => {
    try {
      await API.delete(`/cart/remove/${productID}`, { data: { user_id: userID } });
      alert('Product removed from cart!');
      fetchCart();
    } catch (err) {
      alert('Failed to remove product.');
    }
  };

  const handlePlaceOrder = async () => {
    try {
      await API.post(`/orders/place_from_cart/${userID}`);
      alert('Order placed successfully!');
      navigate('/orders');
    } catch (err) {
      alert('Failed to place order. Please try again.');
    }
  };

  const totalAmount = cartItems.reduce((total, item) => total + parseFloat(item.price || 0), 0);

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-50 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
        {cartItems.length === 0 ? (
          <p className="text-gray-600">Your cart is empty.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cartItems.map((item) => (
                <div key={item.product_id} className="border p-4 bg-white shadow rounded">
                  <img
                    src={`http://localhost:5000/api/images/${item.imageURL}`}
                    alt={item.product_name}
                    className="w-full h-48 object-contain mb-2"
                    onError={(e) => (e.target.src = '/default-image.jpg')}
                  />
                  <h3 className="text-lg font-semibold">{item.product_name}</h3>
                  <p className="text-blue-600 font-bold mb-2">₹{item.price}</p>
                  <button
                    onClick={() => handleRemoveItem(item.product_id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 w-full"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-white rounded-xl shadow-md text-end">
              <h3 className="text-xl font-bold">Total: ₹{totalAmount.toFixed(2)}</h3>
              <button
                onClick={handlePlaceOrder}
                className="mt-4 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
              >
                Place Order
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default CartPage;