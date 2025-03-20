import React, { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useParams } from 'react-router-dom';
import { getData } from '../helpers/axios';

const Profile2 = () => {
    const [user,setUser]=useState();  
    const {user_id} = useParams();
    
useEffect(()=>{

    getData(`user/details/${user_id}/`)
        .then(data => {
            const user_details=data;
            setUser(data);
        })
        .catch(error => {
            console.error("Error fetching user details", error);
        });

},[user_id])
    
    
    

  return (

<div className="container p-4 mt-5">
    <div className="card animated-card p-3">
        {/* Profile Image Section */}
    <div className="row justify-content-center mb-4">
        <div className="col-12  text-center">
            
                <img 
                    width="150px" 
                    height="150px" 
                    className='rounded-circle' 
                    src={user?.profile_image} 
                    alt={user?.username} 
                    style={{ objectFit: 'cover' }} 
                />
          
        </div>
    </div>

    {/* User Info Section */}
    <div className="row text-center">
        <div className="col-12 col-md-6 mb-3">
            <h5 className="font-weight-bold text-dark">{user?.username}</h5>
           
        </div>
        <div className="col-12 col-md-6 mb-3">
            <h5 className="font-weight-bold text-muted">Email address</h5>
            <p className="text-dark">{user?.email}</p>
        </div>
    </div>

    {user?.bio && (
        <div className="row">
        <center>
        <div className="col">
            <h6>Bio</h6>
            <p>{user?.bio}</p>
        </div>
        </center>
    </div>
    )}

   
    </div>
</div>

  )
}

export default Profile2