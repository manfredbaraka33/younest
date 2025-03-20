import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import axiosService from '../helpers/axios';
import { Link,useNavigate } from 'react-router-dom';


const AddShop = () => {
  const {user} = useAuth();
  console.log("Here is the user"+{user});
  const [formData,setFormData] = useState({
    owner:user.id,
    name:"",
    logo:null,
    location:"",
    contact:""
  });
  const [addedShop,setAddedShop] = useState();
  const navigate = useNavigate();

  console.log("her is the form data".formData);

 const [success, setSuccess] = useState(false);
 const [errors, setErrors] = useState(null);

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

    console.log("form data before submitting",formData);
    const response = await axiosService.post('/shops/',formData)
    .then((response)=>{
        setSuccess(true);
        setErrors(null);
        setAddedShop(response.data);
        console.log("Shop created successfully:", response.data);
      })
      .catch((error)=>{
        setSuccess(false);
        console.error("Shop creation failed:", error);
      });
  };


  return (
    <div className='container mt-5'>
        <br />
        <h3 className='mb-2'>Create shop</h3>
        <form onSubmit={handleSubmit} className='form-control'>
            <label htmlFor="shop-name">Name: </label>
            <input className='form-control mb-3' 
            id='name'
            name = 'name'
            type="text" 
            placeholder='Enter the Shop name'
            value={formData.name}
            onChange={handleChange}
            required
            />
            <label htmlFor="location">Location: </label>
            <select  className='form-control' 
            name="location" 
            id="location"
            value={formData.location}
            onChange={handleChange}
            required
            >
                <option  className='form-control' value="ujas">UJAS</option>
                <option  className='form-control' value="cive">CIVE</option>
                <option  className='form-control' value="social">Social</option>
            </select>

            <label htmlFor="contact">Phone: </label>
             <input type="phone" 
             className='form-control'
             id='phone'
             name='contact'
             onChange={handleChange}
             value={formData.contact}
             maxLength='15'
             required
             />
             <label htmlFor="logo">Logo: </label>
            <input  className='form-control' 
            type="file" 
            id='logo' 
            name='logo'
            onChange={handleChange}
            required
            />
            {errors && (
      <div className="alert alert-danger">
        {errors && <div> An error occurred</div>}
      </div>
    )}
    {success && <div className="alert alert-success">Congratulations {user.username} for creating your shop! click <Link to={`/shop/${addedShop.id}`}>here</Link> to view your shop</div>}

     
            <button type='submit' className='btn btn-success my-3'>Create</button>
        </form>
    </div>
  )
}

export default AddShop