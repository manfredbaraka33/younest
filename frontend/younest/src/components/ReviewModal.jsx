import React, { useState } from "react";
import Modal from "react-modal"; // Importing modal from react-modal
import { useParams } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure you have imported Bootstrap CSS
import { postData } from "../helpers/axios";

const ReviewModal = ({ isOpen, onClose, product }) => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const reviewData = { product: product.id, rating, comment };
            const response = await postData(`/reviews/${product.id}/`, reviewData); // Call the postData function to submit the review
            if (response) {
                alert("Review submitted!");
                // console.log(response);
                onClose(); // Close the modal after submitting
            }
        } catch (error) {
            if (error.response && error.response.data) {
                alert(error.response.data.detail || "Failed to submit review. Please try again.");
            } else {
                alert("An error occurred while submitting the review.");
            }
        }
    };

    return (
        <Modal 
            isOpen={isOpen} 
            onRequestClose={onClose} 
            ariaHideApp={false}
            className="modal-contentx mx-1" // Apply Bootstrap modal styling with custom class
            overlayClassName="modal-backdrop" // Custom backdrop for dark overlay
        >
            <div className="modal-contentx  p-3">
                <div className="modal-header">
                    <h5 className="modal-title">Submit Review for {product.name}</h5>
                    <button type="button" className="close btn mx-3 btn-outline-danger" onClick={onClose}>
                        <span>&times;</span>
                    </button>
                </div>
                <div className="modal-body">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="rating" className="form-label">Rating:</label>
                            <select 
                                id="rating"
                                value={rating}
                                onChange={(e) => setRating(e.target.value)} 
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

                        <button type="submit" className="btn btn-primary">Submit Review</button>
                    </form>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
                </div>
            </div>
        </Modal>
    );
};

export default ReviewModal;

