import React, { useState, useEffect } from "react";
import Modal from "react-modal"; // Importing modal from react-modal
import { useParams } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure you have imported Bootstrap CSS
import { patchData } from "../helpers/axios"; // Use patchData for updating reviews
import { getData } from "../helpers/axios";

const ReviewEditModal = ({ isOpen, onClose, product, reviewId,reviewComment,reviewRating }) => {
    const [rating, setRating] = useState(reviewRating); // Default rating
    const [comment, setComment] = useState(reviewComment); // Default comment
    const [error, setError] = useState(null);
    

    console.log("The review sent fro detail page",reviewId);

    

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const reviewData = { rating, comment };
            console.log("data b4 sending",reviewData);
            const response = await patchData(`/reviews/update/${reviewId}/`, reviewData); // PATCH request to update the review
            
            if (response) {
                alert("Review updated!");
                console.log("The response from server",response);
                onClose(); // Close the modal after submitting
            }
        } catch (error) {
            if (error.response && error.response.data) {
                alert(error.response.data.detail || "Failed to update review. Please try again.");
            } else {
                alert("An error occurred while updating the review.");
            }
        }
    };

    return (
        <Modal 
            isOpen={isOpen} 
            onRequestClose={onClose} 
            ariaHideApp={false}
            className="modal-content mx-1" // Apply Bootstrap modal styling with custom class
            overlayClassName="modal-backdrop" // Custom backdrop for dark overlay
        >
            <div className="modal-contentx p-3 rounded">
                <div className="modal-header">
                    <h5 className="modal-title">Edit Review for {product.name}</h5>
                    <button type="button" className="close btn mx-3 btn-outline-danger" onClick={onClose}>
                        <span>&times;</span>
                    </button>
                </div>
                <div className="modal-body">
                    {error && <div className="alert alert-danger">{error}</div>} {/* Display any error */}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="rating" className="form-label">Rating:</label>
                            <select 
                                id="rating"
                                value={rating}
                                onChange={(e) =>setRating(Number(e.target.value))} 
                                className="form-select"
                            >
                                {[1, 2, 3, 4, 5].map((num) => (
                                    <option key={num} value={num}>
                                        {num} ⭐
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="comment" className="form-label">Comment:</label>
                            <textarea 
                                id="comment"
                                value={comment} 
                                onChange={(e) => setComment(e.target.value)} 
                                className="form-control" 
                                rows="3" 
                            />
                        </div>

                        <button type="submit" className="btn btn-primary">Update Review</button>
                    </form>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
                </div>
            </div>
        </Modal>
    );
};

export default ReviewEditModal;
