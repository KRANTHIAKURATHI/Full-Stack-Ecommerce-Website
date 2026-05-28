import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../API';
import Sidebar from './sidebar';
import ReviewList from './ReviewList';

function ProductDetailsPage() {
  const { product_id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await API.get(`/products/${product_id}`);
        setProduct(res.data);
      } catch (error) { console.error(error); }
    };
    
    const fetchReviews = async () => {
      try {
        const res = await API.get(`/products/${product_id}/reviews`);
        setReviews(res.data.reviews);
        setAvgRating(res.data.avgRating);
        setTotalReviews(res.data.totalReviews);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchCurrentUser = async () => {
      try {
        const res = await API.get('/userprofile');
        setCurrentUserId(res.data.user_id);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProduct();
    fetchReviews();
    fetchCurrentUser();
  }, [product_id]);

  const handleAddToCart = async () => {
    try {
      // FIX: Send quantity in the object body
      await API.post(`/cart/add/${product_id}`, { quantity });
      alert(`Added ${quantity} item(s) to cart`);
    } catch (err) {
      alert('Failed to add to cart');
    }
  };

  const handleBuyNow = async () => {
    try {
      const res = await API.post(`/orders/buy_now`, {
        product_id,
        amount: product.amount,
        quantity
      });
      if (res.data.success) {
        alert('Order placed successfully!');
        navigate('/orders');
      }
    } catch (err) {
      alert('Failed to place order');
    }
  };

  if (!product) return <p>Loading...</p>;

  const handleReviewAdded = async () => {
    // Refresh reviews after adding a new one
    try {
      const res = await API.get(`/products/${product_id}/reviews`);
      setReviews(res.data.reviews);
      setAvgRating(res.data.avgRating);
      setTotalReviews(res.data.totalReviews);
    } catch (error) {
      console.error(error);
    }
  };

  const handleReviewUpdated = async () => {
    // Refresh reviews after updating/deleting
    try {
      const res = await API.get(`/products/${product_id}/reviews`);
      setReviews(res.data.reviews);
      setAvgRating(res.data.avgRating);
      setTotalReviews(res.data.totalReviews);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex h-full bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-6">
        <div className="bg-white p-8 rounded shadow-lg max-w-5xl">
          <div className="flex gap-10 mb-8">
            <img src={`http://localhost:5000/api/images/${product.imageURL}`} className="w-64 h-64 object-contain" alt=""/>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{product.product_name}</h1>
              <p className="text-xl text-blue-600 font-bold mt-2">₹{product.amount}</p>
              
              <div className="flex items-center gap-3 my-6">
                <label className="font-bold">Quantity:</label>
                <select 
                  value={quantity} 
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  className="border p-2 rounded"
                >
                  {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>

              <div className="flex gap-4">
                <button onClick={handleAddToCart} className="bg-yellow-400 px-6 py-2 rounded font-bold">Add to Cart</button>
                <button onClick={() => handleBuyNow()} className="bg-orange-500 text-white px-6 py-2 rounded font-bold">Buy Now</button>
              </div>
            </div>
          </div>

          {/* Review List - Only for viewing, no write option here */}
          <div className="border-t pt-6">
            <ReviewList 
              reviews={reviews} 
              avgRating={avgRating}
              totalReviews={totalReviews}
              productId={product_id}
              onReviewUpdated={handleReviewUpdated}
              currentUserId={currentUserId}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
export default ProductDetailsPage;