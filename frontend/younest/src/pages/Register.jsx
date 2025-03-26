import React,{useState} from 'react'
import axios from "axios";
import { Link } from 'react-router-dom';

const Register = () => {


  const [formData, setFormData] = useState({
    username: "",
    bio: "",
    profile_image: null,
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    for (let key in formData) {
      form.append(key, formData[key]);
    }

    try {
      const response = await axios.post("https://younest.onrender.com/api/register/", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccess(true);
      setErrors(null);
      console.log("User registered successfully:", response.data);
    } catch (error) {
      setSuccess(false);
      setErrors("An error occurred");
      console.error("Registration failed:", error);
    }
  };



  return (
    <div className="container mt-5">
   
   
  
    <div className='card shadow p-4 animated-card'>
    <form onSubmit={handleSubmit}>
    <h2 className="text-center  mb-4">User Registration</h2>
      {/* Username */}
      <div className="mb-3">
        <label htmlFor="username" className="form-label">
          Username
        </label>
        <input
          type="text"
          className="form-control"
          id="username"
          name="username"
          placeholder="Enter your username"
          value={formData.username}
          onChange={handleChange}
          required
        />
      </div>

      {/* Bio */}
      <div className="mb-3">
        <label htmlFor="bio" className="form-label">
          Bio
        </label>
        <textarea
          className="form-control"
          id="bio"
          name="bio"
          rows="3"
          placeholder="Write a short bio about yourself"
          value={formData.bio}
          onChange={handleChange}
        ></textarea>
      </div>

      {/* Profile Image */}
      <div className="mb-3">
        <label htmlFor="profile_image" className="form-label">
          Profile Image
        </label>
        <input
          type="file"
          className="form-control"
          id="profile_image"
          name="profile_image"
          onChange={handleChange}
        />
      </div>

      {/* Email */}
      <div className="mb-3">
        <label htmlFor="email" className="form-label">
          Email
        </label>
        <input
          type="email"
          className="form-control"
          id="email"
          name="email"
          placeholder="Enter your email address"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      {/* Password */}
      <div className="mb-3">
        <label htmlFor="password" className="form-label">
          Password
        </label>
        <input
          type="password"
          className="form-control"
          id="password"
          name="password"
          placeholder="Enter a secure password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>

      {success && <div className="alert alert-success">Registration successful! click <Link to="/login">here</Link> to login</div>}
      {errors && (
      <div className="alert alert-danger">
        {typeof errors === "string" ? errors : JSON.stringify(errors)}
      </div>
    )}
      {/* Submit Button */}
      <div className="d-grid">
        <button type="submit" className="btn btn-primary">
          Register
        </button>
      </div>
    </form>
    </div>
    
    
  </div>
  )
}

export default Register
