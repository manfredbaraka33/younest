import React from 'react'
import "../css/PoSCard.css"
import { Link } from "react-router-dom"
import { useState } from "react"
import { FaHeart, FaMapMarkerAlt, FaRegHeart } from "react-icons/fa";
import { toggleSaveProduct } from '../helpers/axios';

const SavedPosCard = ({p}) => {
    const images = Array.isArray(p?.image) ? p.image : [];
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isSaved, setIsSaved] = useState(true); // Since it's in saved list

    const truncateText = (text,maxLength)=>{
        if (!text) return '';

        if(text.length > maxLength){
            return text.slice(0,maxLength) + '...';
        }
        return text;
    }

   

    // Function to go to the next image
    const nextImage = () => {
        if (currentImageIndex < p.image.length - 1) {
            setCurrentImageIndex(currentImageIndex + 1);
        } else {
            setCurrentImageIndex(0); // Loop back to the first image
        }
    };

    // Function to go to the previous image
    const prevImage = () => {
        if (currentImageIndex > 0) {
            setCurrentImageIndex(currentImageIndex - 1);
        } else {
            setCurrentImageIndex(p.image.length - 1); // Loop back to the last image
        }
    };



      // Remove from saved list
      const handleToggleSave = async () => {
        try {
            const response = await toggleSaveProduct(p.id);
            setIsSaved(response.saved); // Update UI state
            if (!response.saved) {
                onRemove(p.id); // Remove from parent list
            }
        } catch (error) {
            console.error("Error removing from saved:", error);
        }
    };

  return (
    <div className="pos-card border border-secondary rounded">
    <Link style={{textDecoration:"none"}} to={`/pos/${p.id}`}>
    
    <div className="pos-poster">
        {p.image.length > 1 && (
            <button className="carousel-btn prev-btn" onClick={prevImage}>
                &#10094;
            </button>
        )}

        {/* Check if there's at least one image */}
        {images.length > 0 ? (
            <img src={"https://younest.onrender.com"+images[currentImageIndex]?.image} alt={p.name} />
        ) : (
            <img src="default-image.jpg" alt="default" /> // Fallback if no images
        )}

        
        {p.image.length > 1 && (
            <button className="carousel-btn next-btn" onClick={nextImage}>
                &#10095;
            </button>
        )}
    </div>
    </Link>
    <div className="pos-info p-2">
        <div className="container">
            <div className="row">
                <div className="col">
                    <Link style={{textDecoration:"none"}} to={`/pos/${p.id}`}>
                        <span style={{fontSize:"medium",fontWeight:"bold"}}>{truncateText(p.name,13)}</span>
                    </Link>
                </div>
                <div className="col-4">
                    <p className="">{p.price}Tsh</p>
                </div>
            </div>
            <div className="row text-warning my-1">
                <div className="col">
                    <Link style={{textDecoration:"none"}} to={`/shop/${p.shop.id}`}>
                    <span style={{fontSize:"medium",fontWeight:"bold"}} className="p-0"><img src={'https://younest.onrender.com' + p.shop.logo} className="rounded-circle mx-2" width="30px" height="30px" alt="logo" /></span>
                    {truncateText(p.shop.name,15)}
                    </Link>
                </div>
               
            </div>
            <div className="row text-primary mb-3">
            <div style={{fontSize:"medium",fontWeight:"bold"}} className="col px-4 text-secondary"><FaMapMarkerAlt/> {p.shopDetails.location}</div>
            <div className="col text-end">
                            <button onClick={handleToggleSave} className="save-button  rounded">
                                {isSaved ? <FaHeart color="red" /> : <FaRegHeart />}
                            </button>
                        </div>
            </div>
           
        </div>
    </div>
</div>
  )
}

export default SavedPosCard
