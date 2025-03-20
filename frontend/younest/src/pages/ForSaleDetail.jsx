import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { deleteData, patchData, updateData } from "../helpers/axios";
import PoSCard2 from "../components/PoSCard2";
import { FaArrowLeft } from "react-icons/fa";

const ForSaleDetail = () => {
  const { productId } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [product, setProduct] = useState(null);
  const [updatedProduct, setUpdatedProduct] = useState({});
  const { user } = useAuth();
  const navigate = useNavigate();
  const [previewUrls, setPreviewUrls] = useState([]);
  const [images, setImages] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch product details
  const getForsaleDetails = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/forsale_details/${productId}/`
      );
      const data = await response.json();
      return data;
    } catch (err) {
      throw new Error("Failed to load product details");
    }
  };

  useEffect(() => {
    const loadForsaleDetails = async () => {
      setLoading(true);
      try {
        const productDetails = await getForsaleDetails();
        setProduct(productDetails);
        setUpdatedProduct(productDetails);
      } catch (err) {
        setError("Failed to load product details.");
      } finally {
        setLoading(false);
      }
    };

    loadForsaleDetails();
  }, [productId]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

 

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    console.log('Files selected:', files); // Debugging
    setImages(files);
    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(newPreviewUrls);
    console.log('Images state after setting:', files); // Additional Debugging
  };


  // Handle product update
  const handleUpdate = async () => {
    
      const formData = new FormData();
      formData.append("name", updatedProduct.name);
      formData.append("price", updatedProduct.price);
      formData.append("location", updatedProduct.location);
      formData.append("description", updatedProduct.description);

       // Debugging: Check the formData after appending fields (excluding images)
       console.log("FormData after appending fields (before images):");
       for (let pair of formData.entries()) {
         console.log(pair[0] + ": " + pair[1]);
       }

      // Append images if there are any
      if (updatedProduct.images) {
        images.forEach((image) => {
          formData.append('images', image);
        });
      }
       
      
      console.log("FormData after appending images:");
      for (let pair of formData.entries()) {
        if (pair[0] === 'images') {
          // Log details of each file (name, size, type)
          console.log(pair[0] + ": " + pair[1].name);  // Log file name
        } else {
          console.log(pair[0] + ": " + pair[1]);  // Log other fields
        }
      }
     

      // Send the form data with PUT request
      try { const updated = await patchData(`/forsale/${productId}/update/`, formData);
      setProduct(updated);
      setIsModalOpen(false);
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
        await deleteData(`/forsale/${productId}/delete/`);
        alert("Product deleted successfully!");
        navigate("/forsale");
      } catch (err) {
        console.error("Failed to delete product:", err);
        alert("Failed to delete product.");
      }
    }
  };

  if (error) return <div>{error}</div>;
  if (loading || !product) return <div>Loading...</div>;

  return (
    <div className="container-fluid mt-5 p-3">
     <Link to="/forsale"> <FaArrowLeft className="mb-2" /></Link>
      {product && (
        <>
          <h6>
            {product.name} by{" "}
            <Link to={`/profile2/${product.seller.id}`} ><span className="">{product.seller.username}</span></Link>
          </h6>

          <div className="row">
            <div className="col-sm-12 col-md-8 col-lg-6 my-2">
             <center>
             <PoSCard2 p={product} />
             </center>
            </div>
            <div className="col my-2">
                     <table>
                          <thead className='bg-success'>
                            <tr>
                              <th>Item</th>
                              <th>Info</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr><td>Price</td><td>{product.price} Tshs</td></tr>
                            
                            <tr><td>Location</td><td>{product.location}</td></tr>
                            <tr><td>Contact</td><td>{product.contact}</td></tr>
                          </tbody>
                        </table>


            </div>
          </div>
          <center>
          {user?.username === product.seller.username && (
            <div className="btns my-3">
              <button
                className="btn btn-primary mx-3 my-2"
                onClick={() => setIsModalOpen(true)}
              >
                Update Product
              </button>
              <button className="btn btn-danger mx-3 my-2" onClick={deleteItem}>
                Delete Product
              </button>
            </div>
          )}
          </center>
          <div className="container bg-light border rounded my-3">
            <p className="card-text">{product.description}</p>
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
                    value={updatedProduct.name || ""}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Price</label>
                  <input
                    type="number"
                    className="form-control"
                    name="price"
                    value={updatedProduct.price || ""}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Location</label>
                  <input
                    type="text"
                    className="form-control"
                    name="location"
                    value={updatedProduct.location || ""}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    name="description"
                    value={updatedProduct.description || ""}
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
                    onChange={handleImageChange}
                  />
                </div>
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

      {/* Backdrop */}
      {isModalOpen && <div className="modal-backdrop fade show"></div>}
    </div>
  );
};

export default ForSaleDetail;

