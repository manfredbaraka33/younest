import React from 'react'
import { Link } from 'react-router-dom'

const Shopcard = ({shop}) => {
  return (
    <Link style={{textDecoration:"none"}}  to={`/shop/${shop.id}/`}>
    <div className='card m-2 p-1 bg-secondary'>
       <h5 className='text-light'><span style={{fontSize:"small"}} className='p-1'><img src={shop.logo} width="43px" height="43px" className='rounded-circle mt-1' alt="logo" /></span>{shop.name}</h5>
       <p className='card-text text-warning'>Location: {shop.location}</p>
       <p className='card-text text-warning'> Followers: {`${shop.followers.length}`}</p>
    </div>
    </Link>
  )
}

export default Shopcard