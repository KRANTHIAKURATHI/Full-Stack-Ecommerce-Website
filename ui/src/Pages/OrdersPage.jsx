import React, { useEffect, useState } from 'react';
import API from '../API';
import Sidebar from './sidebar';
import OrderReviewForm from './OrderReviewForm';

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedProducts, setExpandedProducts] = useState({});

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await API.get('/orders');
        if (Array.isArray(res.data)) {
          setOrders(res.data);
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const toggleReviewForm = (productId) => {
    setExpandedProducts(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  const handleReviewAdded = async () => {
    // Refresh orders to show updated review status
    const res = await API.get('/orders');
    if (Array.isArray(res.data)) {
      setOrders(res.data);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-6 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">Your Orders</h2>
        
        {orders.length === 0 ? (
          <div className="text-center bg-white p-10 rounded-lg shadow">
            <p className="text-gray-500 text-lg">You haven't placed any orders yet.</p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-6">
            {orders.map(order => (
              <div key={order.order_id} className="bg-white border rounded-lg shadow-sm overflow-hidden">
                {/* Order Header */}
                <div className="bg-gray-100 p-4 flex flex-wrap justify-between items-center border-b gap-4">
                  <div className="flex gap-8">
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-bold">Order Placed</p>
                      <p className="text-sm">{new Date(order.order_date).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-bold">Total Amount</p>
                      <p className="text-sm font-bold text-blue-600">₹{order.amount}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold">Order #</p>
                    <p className="text-sm font-mono">{order.order_id}</p>
                  </div>
                </div>

                {/* Products in this Order */}
                <div className="p-4 divide-y">
                  {order.products.map((product, index) => (
                    <div key={index} className="py-4 first:pt-0 last:pb-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center flex-1">
                          <img 
                            src={`http://localhost:5000/api/images/${product.image}`} 
                            className="w-20 h-20 object-contain border rounded p-1" 
                            alt={product.name} 
                          />
                          <div className="ml-4">
                            <p className="font-bold text-gray-800">{product.name}</p>
                            <p className="text-sm text-gray-500">
                              Quantity: <span className="font-semibold text-gray-700">{product.quantity || 1}</span>
                            </p>
                          </div>
                        </div>
                        <div className="text-right mr-4">
                          <p className="font-semibold">₹{product.price * (product.quantity || 1)}</p>
                          <p className="text-xs text-gray-400">₹{product.price} per unit</p>
                        </div>
                      </div>

                      {/* Review Button/Form */}
                      <div className="mt-3 ml-24">
                        <OrderReviewForm 
                          productId={product.product_id}
                          productName={product.name}
                          orderId={order.order_id}
                          onReviewAdded={handleReviewAdded}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Footer Actions */}
                <div className="bg-gray-50 p-3 border-t flex justify-end">
                  <button className="text-sm text-blue-600 hover:underline font-medium">
                    View Order Details
                  </button>
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