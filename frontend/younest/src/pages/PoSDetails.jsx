import React, { useEffect, useState } from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import useSWR from 'swr';
import { Link } from 'react-router-dom';
import PoSCard2 from '../components/PoSCard2';
import { useAuth } from '../contexts/AuthContext';
import { patchData,deleteData } from '../helpers/axios';
import { FaArrowLeft } from 'react-icons/fa';
import SaveButton from '../components/SaveButton';
import ReviewModal from '../components/ReviewModal';
import ProductReviews from '../components/ProductReviews';
import ReviewEditModal from '../components/ReviewEditModal';
import { getData } from '../helpers/axios';

const PoSDetails = () => {
  const [loading, setLoading] = useState(false);
  const { posId } = useParams();
  const [error, setError] = useState(null);
  const [product, setProduct] = useState(null);
  const {user}=useAuth();
  const navigate =useNavigate()
  const [previewUrls, setPreviewUrls] = useState([]);
  const [images, setImages] = useState([]);
  const [hasReview, setHasReview] = useState(false);
  const [isModalReviewOpen, setIsModalReviewOpen] = useState(false);
  const [isModalReviewEditOpen, setIsModalReviewEditOpen] = useState(false);
  const [reviewId,setReviewId]=useState();
  const [reviewComment,setReviewComment]=useState();
  const [reviewRating,setReviewRating]=useState();
  

  const openModalReview = () => setIsModalReviewOpen(true);
  const closeModalReview = () => setIsModalReviewOpen(false);

  const openModalReviewEdit = () => setIsModalReviewEditOpen(true);
  const closeModalReviewEdit = () => setIsModalReviewEditOpen(false);


  

  const [isModalOpen, setIsModalOpen] = useState(false);

  const getDetails = async () => {
    const response = await fetch(`http://localhost:8000/api/pos/${posId}/`);
    const data = await response.json();
    return data;
  };

  

  useEffect(() => {
    const loadPosDetails = async () => {
      setLoading(true);
      try {
        const posDetails = await getDetails();
        setProduct(posDetails);
      } catch (err) {
        setError("Failed to load items...");
      } finally {
        setLoading(false);
      }
    };

    loadPosDetails();
  }, [posId]);


    useEffect(() => {
      if (posId) {
        // Check if the user has already reviewed the product
        getData(`/reviews/check/${posId}/`)
          .then((data) => {
            if (data.review_exists) {
              setHasReview(true);
              setReviewId(data.review_id); 
              setReviewComment(data.comment);
              setReviewRating(data.rating);
            } else {
              setHasReview(false);
            }
          })
          .catch((error) => console.error("Error checking review:", error));
      }
    }, [posId]);

   // Handle input changes
   const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };



  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    // console.log('Files selected:', files); // Debugging
    setImages(files);
    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(newPreviewUrls);
    console.log('Images state after setting:', files); // Additional Debugging
  };


       
  
    const handleUpdate = async () => {
      const formData = new FormData();
    
     
      formData.append("name", product.name);
      formData.append("price", product.price);
      formData.append("description", product.description);
      formData.append("category", product.category);

      
      // Now append the images
      images.forEach((image) => {
        formData.append('images', image);
      });
    
      
    
      try {
        const updated = await patchData(`/pos/${posId}/update/`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setIsModalOpen(false);
        navigate(`/pos/${posId}`);
        alert("Product updated successfully!");
      } catch (err) {
        console.error("Failed to update product:", err);
        alert("Failed to update product.");
      }
    };
    


   // Handle delete
    const deleteItem = async () => {
      if (window.confirm("Are you sure you want to delete this item?")) {
        try {
          await deleteData(`/pos/${posId}/delete/`);
          alert("Product deleted successfully!");
          navigate(`/shop/${product.shop?.id}`);
        } catch (err) {
          console.error("Failed to delete product:", err);
          alert("Failed to delete product.");
        }
      }
    };


     // Handle delete
     const deleteReview = async () => {
      if (window.confirm("Are you sure you want to delete this your review on this product?")) {
        try {
          await deleteData(`/reviews/${reviewId}/delete/`);
          alert("Review deleted successfully!");
          navigate(`/pos/${product?.id}`);
        } catch (err) {
          console.error("Failed to delete review:", err);
          alert("Failed to delete review.");
        }
      }
    };


  if (error) return <div>Error loading product details.</div>;
  if (loading || !product) return <div>Loading...</div>;

  return (
    <div className="container-fluid mt-5 p-2">
      <Link to="/"><FaArrowLeft className='mb-2'/></Link>
      {product && (
        <>
          <h6>
            {product.name} by{' '}
            <Link className="" style={{ textDecoration: 'none' }} to={`/shop/${product.shop?.id}`}>
              {product.shop?.name || ''}
            </Link>
            <SaveButton className="mx-2" prodId={product.id} />
          </h6>
          <div className="row">
            <div className="col my-2">
              <center>
              <PoSCard2 p={product} />
              </center>
            </div>
            <div className="col my-2">
              <div className="">
                <div className="">
  
                        <table>
                          <thead className='bg-success'>
                            <tr>
                              <th>Item</th>
                              <th>Info</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr><td>Price</td><td>{product.price} Tshs</td></tr>
                            <tr><td>Category</td><td>{product.category}</td></tr>
                            <tr><td>Location</td><td>{product.shop?.location}</td></tr>
                            <tr><td>Contact</td><td>{product.shop?.contact}</td></tr>
                          </tbody>
                        </table>
                     
                         <br />
                        {user?.id == product.shop.owner && (
                        <div className='btn-group mx-1'>
                        <button className="btn btn-outline-secondary my-2"  onClick={() => setIsModalOpen(true)}>Edit product</button>
                        <button className="btn btn-outline-danger my-2" onClick={deleteItem}>Delete product</button>
                      </div>
                      )}

                      {user && (
                        <>
                          {hasReview ? (
                                    // If the user has already reviewed, show the Edit and delete buttons
                                    <div className="btn-group mx-1">
                                    <button onClick={openModalReviewEdit} className="btn btn-outline-secondary px-3">
                                      Edit Review
                                    </button>
                                    <butt className="btn btn-outline-danger px-3" onClick={deleteReview}>Delete review</butt>
                                    </div>
                                  ) : (
                                    // Otherwise, show the Write a Review button
                                    <button onClick={openModalReview} className="btn btn-outline-dark">
                                      Write a Review
                                    </button>
                                  )}
                                                          
                              {/* Modal for review form */}
                              <ReviewModal isOpen={isModalReviewOpen} product={product} onClose={closeModalReview} />

                              {/* Modal for review edit form */}
                              <ReviewEditModal isOpen={isModalReviewEditOpen} reviewId={reviewId} reviewComment={reviewComment} reviewRating={reviewRating}  product={product} onClose={closeModalReviewEdit} />
                        </>
                      )}

                </div>
              </div>
            </div>
          </div>
          
          <div className="container bg-light border rounded my-3">
            <p className="card-text">{product.description}</p>
          </div>
          <div className="container">
          <ProductReviews product={product} />
          </div>
        </>
      )}




{/* Bootstrap Modal */}
<div
        className={`modal ${isModalOpen ? "show" : ""}`}
        tabIndex="-1"
        style={{ display: isModalOpen ? "block" : "none" }}
        aria-labelledby="updateModalLabel"
        aria-hidden={!isModalOpen}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="updateModalLabel">
                Update Product
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setIsModalOpen(false)}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={product.name || ''}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Price</label>
                  <input
                    type="number"
                    className="form-control"
                    name="price"
                    value={product.price || ''}
                    onChange={handleInputChange}
                  />
                </div>
              
                <div className="mb-3">
                  <label htmlFor="form-label">Category</label>
                  <select className='form-control' name="category" value={product.category} 
                  onChange={handleInputChange}
                  >
                  <option value="">Select Category</option>
                  <option value="food">Food</option>
                  <option value="bedings">Bedings</option>
                  <option value="electronics">Electronics</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    name="description"
                    value={product.description || ''}
                    onChange={handleInputChange}
                  ></textarea>
                </div>
                <div className="mb-3">
                  <label className="form-label">Images</label>
                  <input
                    type="file"
                    className="form-control"
                    name="images"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                  />

                <div className="image-previews">
                          {previewUrls.map((url, index) => (
                            <img
                              key={index}
                              src={url}
                              width="100"
                              height="100"
                              alt={`Preview ${index + 1}`}
                            />
                          ))}
                        </div>

                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </button>
              <button className="btn btn-primary" onClick={handleUpdate}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>




    </div>
  );
};

export default PoSDetails;


