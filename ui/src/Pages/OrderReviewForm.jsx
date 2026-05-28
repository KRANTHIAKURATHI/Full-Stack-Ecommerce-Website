import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import API from '../API';

function OrderReviewForm({ productId, productName, orderId, onReviewAdded }) {
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasReviewed, setHasReviewed] = useState(false);

  // Check if user has already reviewed this product
  useEffect(() => {
    const checkExistingReview = async () => {
      try {
        // Get current user's ID
        const userRes = await API.get('/userprofile');
        const currentUserId = userRes.data.user_id;

        // Get all reviews for this product
        const res = await API.get(`/products/${productId}/reviews`);
        
        // Check if current user has reviewed this product
        const userReview = res.data.reviews.find(r => r.user_id === currentUserId);
        if (userReview) {
          setHasReviewed(true);
        }
      } catch (error) {
        console.error('Error checking reviews:', error);
      }
    };
    checkExistingReview();
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await API.post('/reviews', {
        product_id: productId,
        rating,
        comment
      });

      if (res.data.success || res.data.message) {
        alert('Review submitted successfully!');
        setComment('');
        setRating(5);
        setShowForm(false);
        setHasReviewed(true);
        onReviewAdded();
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to submit review';
      setError(errorMessage);
      if (errorMessage.includes('already')) {
        setHasReviewed(true);
      }
    } finally {
      setLoading(false);
    }
  };

  if (hasReviewed) {
    return (
      <div className="bg-green-50 border border-green-200 rounded p-3">
        <p className="text-green-700 text-sm">✓ You have already reviewed this product</p>
      </div>
    );
  }

  return (
    <div>
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="text-blue-600 hover:text-blue-800 text-sm font-semibold"
        >
          Write a Review
        </button>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded p-4 mt-2">
          <h4 className="font-bold mb-3">Review {productName}</h4>
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Star Rating */}
            <div>
              <label className="block text-sm font-bold mb-2">Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`text-2xl transition ${
                      star <= rating ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            {/* Comment */}
            <div>
              <label className="block text-sm font-bold mb-2">Comment (Optional)</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience with this product..."
                className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                rows="3"
              />
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            {/* Buttons */}
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading}
                className="bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-300 text-black font-bold px-4 py-2 rounded text-sm transition"
              >
                {loading ? 'Submitting...' : 'Submit Review'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold px-4 py-2 rounded text-sm transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default OrderReviewForm;
