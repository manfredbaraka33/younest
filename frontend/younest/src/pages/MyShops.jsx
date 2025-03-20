

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

const MyShops = () => {
  const [shops, setShops] = useState([]);
  const { user } = useAuth(); // Access the user from AuthContext
  
  useEffect(() => {
    const fetchShops = async () => {
      if (user && user.access) { // Ensure the access token is used
        try {
          const response = await axios.get('http://localhost:8000/api/user-shops/', {
            headers: {
              'Authorization': `Bearer ${user.access}` // Use the access token here
            }
          });
          setShops(response.data);
        } catch (error) {
          console.error('Error fetching shops:', error);
        }
      }
    };

    fetchShops();
  }, [user]);

  console.log(shops)

  
  return (
    <div className='container mt-5'>
      <div className="row">
        <div className="col">
          <h6>My Shops</h6>
        </div>
        <div className="col">
          <Link to="/addshop"><button className='btn btn-primary'>Create shop</button></Link>
        </div>
      </div>
      <div className='container'>
        {shops.length > 0 ? (
          shops.map(shop => (
            <Link key={shop.id} style={{ textDecoration: "none" }} to={`/shop/${shop.id}`}>
              <div className='row border p-2 rounded my-2'>
                <div className="col-lg-2 col-sm-9 col-md-3 my-2">
                  <img src={shop.logo} className='rounded-circle' width="80" height="80" alt="logo" />
                </div>
                <div className="col my-2">
                  <h5>{shop.name}</h5>
                  <p>Location: {shop.location}</p>
                  <p>Contact: {shop.contact}</p>
                  <p>Followers: {shop.followers_count}</p>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div>You have no shops yet. Click <Link to="/addshop">here</Link> to add a shop.</div>
        )}
      </div>
    </div>
  );
};

export default MyShops;
