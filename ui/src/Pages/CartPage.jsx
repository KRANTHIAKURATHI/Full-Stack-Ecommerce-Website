import React, { useEffect, useState } from 'react';
import API from '../API';
import Sidebar from './sidebar';
import { Trash2, Plus, Minus, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 1. Fetch Cart Data from Backend
  const fetchCart = async () => {
    try {
      const res = await API.get('/cart');
      // Backend returns { success: true, data: { cart_items: [...] } }
      if (res.data?.success) {
        setCartItems(res.data.data.cart_items || []);
      }
    } catch (err) {
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // 2. Handle Quantity Update (+ / -)
  // If quantity is 1 and user clicks minus, delete the item instead
  const handleUpdateQty = async (product_id, action) => {
    try {
      const item = cartItems.find(i => i.product_id === product_id);
      const currentQty = parseInt(item?.quantity) || 1;
      
      // If quantity is 1 and user clicks decrease, remove the item
      if (currentQty === 1 && action === 'dec') {
        await handleRemoveItem(product_id);
        return;
      }
      
      // Matches the backend route: router.put('/cart/update-quantity')
      await API.put('/cart/update-quantity', { product_id, action });
      // Refresh the list immediately to show new quantity and totals
      fetchCart();
    } catch (err) {
      console.error('Update quantity failed:', err);
    }
  };

  // 3. Handle Remove Item
  const handleRemoveItem = async (product_id) => {
    try {
      await API.delete(`/cart/remove/${product_id}`);
      fetchCart();
    } catch (err) {
      console.error('Remove item failed:', err);
    }
  };

  // 4. Calculate Global Total (Fixed NaN issue)
  const totalAmount = cartItems.reduce((total, item) => {
    const price = parseFloat(item.price) || 0;
    const qty = parseInt(item.quantity) || 1;
    return total + (price * qty);
  }, 0);

  const handlePlaceOrder = async () => {
    try {
      const res = await API.post('/cart/placeorder');
      if (res.data.success) {
        alert('Order placed successfully!');
        navigate('/orders');
      }
    } catch (err) {
      alert('Failed to place order');
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <ShoppingCart className="text-gray-700" size={28} />
            <h2 className="text-3xl font-bold text-gray-800">Your Shopping Cart</h2>
          </div>

          {cartItems.length === 0 ? (
            <div className="bg-white p-12 rounded-xl shadow-sm text-center">
              <p className="text-gray-500 text-lg">Your cart is currently empty.</p>
              <button 
                onClick={() => navigate('/')}
                className="mt-4 bg-yellow-400 px-6 py-2 rounded-lg font-bold hover:bg-yellow-500 transition-colors"
              >
                Go Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => {
                // Ensure values are numbers for safe math
                const itemPrice = parseFloat(item.price) || 0;
                const itemQty = parseInt(item.quantity) || 1;

                return (
                  <div key={item.product_id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center gap-6">
                    {/* Product Image */}
                    <div className="w-24 h-24 bg-gray-50 rounded-lg flex items-center justify-center p-2">
                      <img 
                        src={`http://localhost:5000/api/images/${item.imageURL}`} 
                        className="max-w-full max-h-full object-contain" 
                        alt={item.product_name} 
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-800">{item.product_name}</h3>
                      <p className="text-gray-500 font-medium">₹{itemPrice.toLocaleString()}</p>
                    </div>

                    {/* Quantity Selector UI */}
                    <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
                      <button 
                        onClick={() => handleUpdateQty(item.product_id, 'dec')}
                        className="p-2 hover:bg-gray-200 transition-colors text-gray-600"
                      >
                        <Minus size={18} />
                      </button>
                      <span className="w-12 text-center font-bold text-gray-800">{itemQty}</span>
                      <button 
                        onClick={() => handleUpdateQty(item.product_id, 'inc')}
                        className="p-2 hover:bg-gray-200 transition-colors text-gray-600"
                      >
                        <Plus size={18} />
                      </button>
                    </div>

                    {/* Line Total Price (Calculated Item Total) */}
                    <div className="w-32 text-right">
                      <p className="text-xl font-bold text-gray-900">
                        ₹{(itemPrice * itemQty).toLocaleString()}
                      </p>
                    </div>

                    {/* Remove Button */}
                    <button 
                      onClick={() => handleRemoveItem(item.product_id)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={22} />
                    </button>
                  </div>
                );
              })}

              {/* Summary Section */}
              <div className="mt-8 bg-white p-8 rounded-2xl shadow-md border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                  <p className="text-gray-500 text-sm uppercase tracking-wider font-bold">Estimated Total</p>
                  <p className="text-4xl font-black text-gray-900">₹{totalAmount.toLocaleString()}</p>
                </div>
                <button 
                  onClick={handlePlaceOrder}
                  className="w-full md:w-auto bg-yellow-400 hover:bg-yellow-500 text-black text-lg font-black px-12 py-4 rounded-xl shadow-lg transition-all active:scale-95"
                >
                  Place Order
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CartPage;