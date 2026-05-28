import React, { useState } from 'react';
import { Star, Trash2, Edit2 } from 'lucide-react';
import API from '../API';

function ReviewList({ reviews, avgRating, totalReviews, productId, onReviewUpdated, currentUserId }) {
  const [editingId, setEditingId] = useState(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEdit = (review) => {
    setEditingId(review.review_id);
    setEditRating(review.rating);
    setEditComment(review.comment || '');
  };

  const handleSaveEdit = async (reviewId) => {
    setLoading(true);
    try {
      const res = await API.put(`/reviews/${reviewId}`, {
        rating: editRating,
        comment: editComment
      });

      if (res.data.success) {
        alert('Review updated successfully!');
        setEditingId(null);
        onReviewUpdated();
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update review');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;

    try {
      const res = await API.delete(`/reviews/${reviewId}`);
      if (res.data.success) {
        alert('Review deleted successfully!');
        onReviewUpdated();
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete review');
    }
  };

  return (
    <div className="mt-8">
      {/* Rating Summary */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 mb-6">
        <div className="flex items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-4xl font-bold text-gray-900">{avgRating}</span>
              <div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={20}
                      fill={star <= Math.round(avgRating) ? '#FFD700' : '#D1D5DB'}
                      stroke="none"
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-600">{totalReviews} reviews</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold">Customer Reviews</h3>

        {reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet. Be the first to review!</p>
        ) : (
          reviews.map((review) => (
            <div key={review.review_id} className="bg-white p-4 rounded-lg border border-gray-200">
              {editingId === review.review_id ? (
                // Edit Mode
                <div className="space-y-3">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setEditRating(star)}
                        className={`text-2xl transition ${
                          star <= editRating ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>

                  <textarea
                    value={editComment}
                    onChange={(e) => setEditComment(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    rows="3"
                  />

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSaveEdit(review.review_id)}
                      disabled={loading}
                      className="bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-300 text-black font-bold px-4 py-2 rounded transition"
                    >
                      {loading ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold px-4 py-2 rounded transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // View Mode
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-bold text-gray-900">{review.fullname}</p>
                      <div className="flex gap-1 mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={16}
                            fill={star <= review.rating ? '#FFD700' : '#D1D5DB'}
                            stroke="none"
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  {review.comment && (
                    <p className="text-gray-700 text-sm mb-3">{review.comment}</p>
                  )}

                  {/* Edit/Delete buttons (only for user's own reviews) */}
                  {currentUserId === review.user_id && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(review)}
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-semibold"
                      >
                        <Edit2 size={14} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(review.review_id)}
                        className="flex items-center gap-1 text-red-600 hover:text-red-800 text-sm font-semibold"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ReviewList;
