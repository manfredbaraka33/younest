import React, { useState, useEffect } from 'react';
import { getData } from '../helpers/axios';
import TimeAgo from 'timeago-react'; // Import TimeAgo for time formatting
import { Link } from 'react-router-dom';

const ProductReviews = ({ product }) => {
    const [reviews, setReviews] = useState([]);
    const [avgRating, setAvgRating] = useState(0);
    const [expandedReviewId, setExpandedReviewId] = useState(null); // Track which review is expanded

    useEffect(() => {
        if (product?.id) {
            console.log("Fetching reviews for product ID:", product.id);

            // Fetch reviews for the product
            getData(`/reviews/${product.id}/`)
                .then(data => {
                    console.log("Data fetched:", data);
                    setReviews(data.results); // Ensure your API returns a list of reviews
                })
                .catch(error => {
                    console.error("Error fetching reviews", error);
                });

            // Fetch average rating for the product
            getData(`/reviews/${product.id}/review-summary/`)
                .then(data => {
                    console.log("Data fetched:", data);
                    setAvgRating(data.avg_rating);
                })
                .catch(error => {
                    console.error("Error fetching average rating:", error);
                });
        }
    }, [product?.id]);

    // Function to handle the toggle of "Show More / Show Less"
    const toggleReview = (reviewId) => {
        setExpandedReviewId(expandedReviewId === reviewId ? null : reviewId);
    };

    // Function to truncate text
    const truncateText = (text, maxLength) => {
        if (text.length > maxLength) {
            return text.substring(0, maxLength) + '...';
        }
        return text;
    };

    return (
        <div>
            <h2>Reviews for {product.name}</h2>
            <h3>Average Rating: {avgRating} ⭐</h3>
            {reviews?.length > 0 ? (
                reviews.map((review) => (
                    <div key={review.id} style={{ borderBottom: '1px solid #ccc', padding: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                           
                            <p>  {review.user_pic && (
                                <Link to={`/profile2/${review.user_id}/`}>
                                <img
                                    src={review.user_pic}
                                    alt="User profile"
                                    width="40"
                                    height="40"
                                    style={{ borderRadius: '50%' }}
                                    className='mx-1'
                                />
                                </Link>
                            )}<strong><Link className='' style={{textDecoration:"none"}} to={`/profile2/${review.user_id}/`}>{review.user}</Link></strong> | <TimeAgo datetime={review.created_at} /></p>
                            <br />
                            
                        </div>
                        
                        <p className='mx-3'>{review.rating} ⭐</p>
                        <p className='mx-3'>
                            {expandedReviewId === review.id
                                ? review.comment // Show full comment if expanded
                                : truncateText(review.comment, 80) // Truncate if not expanded
                            }
                        </p>
                        {review.comment.length > 150 && (
                            <button className='btn btn-outline-dark' onClick={() => toggleReview(review.id)}>
                                {expandedReviewId === review.id ? 'Show Less' : 'Show More'}
                            </button>
                        )}
                    </div>
                ))
            ) : (
                <p>No reviews yet.</p>
            )}
        </div>
    );
};

export default ProductReviews;
