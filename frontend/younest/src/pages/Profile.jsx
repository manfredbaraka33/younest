import React from 'react'
import { useAuth } from '../contexts/AuthContext'

const Profile = () => {

    const {user,logout} = useAuth();

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
            <h5 className="font-weight-bold text-muted">Username</h5>
            <p className="text-dark">{user?.username}</p>
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

   <center>
     {/* Log Out Button Section */}
     <button onClick={logout} className="btn btn-danger btn-lg w-50 py-3 mt-4 shadow-lg ">
        Log out
    </button>
   </center>
    </div>
</div>

  )
}

export default Profile