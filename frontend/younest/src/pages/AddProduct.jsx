import React, { useState } from 'react';
import axiosService from '../helpers/axios';

const AddProduct = ({ shop }) => {
  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [formData, setFormData] = useState({
    shop: shop,
    name: '',
    price: 0,
    description: '',
    category: '',
    type: '',
  });
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState(null);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    console.log('Files selected:', files); // Debugging
    setImages(files);
    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(newPreviewUrls);
    console.log('Images state after setting:', files); // Additional Debugging
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === 'shop') {
        data.append('shop', formData.shop.id);
      } else {
        data.append(key, formData[key]);
      }
    });

    console.log('Images before submitting:', images); // Debugging

    images.forEach((image) => {
      data.append('images', image);
    });

    for (let pair of data.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }

    try {
      const response = await axiosService.post('/pos/create/', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSuccess(true);
      setErrors(null);
      setFormData({
        shop: shop,
        name: '',
        price: 0,
        description: '',
        category: '',
        type: '',
      });
      setImages([]);
      setPreviewUrls([]);
      console.log('Product created successfully:', response.data);
    } catch (error) {
      setSuccess(false);
      setErrors(error);
      console.error('Product creation failed:', error);
    }
  };

  return (
    <div className="container mt-5">
      <form onSubmit={handleSubmit} className="form-control">
        {errors && (
          <div className="alert alert-danger">
            <div>An error occurred</div>
          </div>
        )}
        {success && (
          <div className="alert alert-success">
            Congratulations! Your product has been added.
          </div>
        )}

        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          className="form-control"
          value={formData.name}
          onChange={handleChange}
        />

        <label htmlFor="price">Price:</label>
        <input
          type="number"
          id="price"
          name="price"
          className="form-control"
          value={formData.price}
          onChange={handleChange}
        />

        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          name="description"
          className="form-control"
          value={formData.description}
          onChange={handleChange}
        ></textarea>

        <label htmlFor="category">Category:</label>
        <select
          id="category"
          name="category"
          className="form-control"
          value={formData.category}
          onChange={handleChange}
        >
          <option value="">Select Category</option>
          <option value="food">Food</option>
          <option value="bedings">Bedings</option>
          <option value="electronics">Electronics</option>
        </select>

        <h6>Type</h6>
        <input
          type="radio"
          id="product"
          name="type"
          value="product"
          unchecked={formData.type === 'product'}
          onChange={handleChange}
        />
        <label htmlFor="product"> Product</label>
        <br />
        <input
          type="radio"
          id="service"
          name="type"
          value="service"
          unchecked={formData.type === 'service'}
          onChange={handleChange}
        />
        <label htmlFor="service"> Service</label>

        <label htmlFor="imageUpload">Upload image(s):</label>
        <input
          className="form-control my-2"
          type="file"
          id="imageUpload"
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

        <button type="submit" className="btn btn-outline-primary my-3">
          Add
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
