import React, { useEffect, useState } from 'react';
import API from '../API';
import Sidebar from './sidebar';
import { useNavigate } from 'react-router-dom';

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const userID = localStorage.getItem('userID');

  const fetchOrders = async () => {
    if (!userID) {
      navigate('/');
      return;
    }

    try {
      const res = await API.get(`/orders/${userID}`);
      if (Array.isArray(res.data)) {
        setOrders(res.data);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setOrders([]);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [userID]);

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-50 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Your Orders</h2>
        {orders.length === 0 ? (
          <p className="text-gray-500">You haven't placed any orders yet.</p>
        ) : (
          <div className="space-y-6">
            {orders.map((order, index) => (
              <div key={index} className="bg-white p-4 rounded shadow-md">
                <div className="mb-2 text-sm text-gray-500">
                  Order Date: {new Date(order.order_date).toLocaleDateString()} | Total: ₹{order.amount}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {order.products.map((product, idx) => (
                    <div
                      key={idx}
                      className="border p-3 rounded bg-gray-100 flex flex-col items-center"
                    >
                      <img
                        src={`http://localhost:5000/api/images/${product.image}`}
                        alt={product.name}
                        className="w-24 h-24 object-contain mb-2"
                        onError={(e) => (e.target.src = '/default-image.jpg')}
                      />
                      <p className="text-sm text-center">{product.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default OrdersPage;