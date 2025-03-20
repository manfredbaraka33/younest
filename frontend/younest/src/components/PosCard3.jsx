import "../css/PoSCard.css"
import { Link } from "react-router-dom"
import { useState } from "react"
import { FaMapMarkerAlt } from "react-icons/fa";


function PoSCard3({ p }) {
    const images = Array.isArray(p?.image) ? p.image : [];
    const [currentImageIndex, setCurrentImageIndex] = useState(0);


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

    return (
        <div className="pos-card">
            <Link style={{textDecoration:"none"}} to={`/pos/${p.id}`}>
            <div className="pos-poster">
                {p.image.length > 1 && (
                    <button className="carousel-btn prev-btn" onClick={prevImage}>
                        &#10094;
                    </button>
                )}

                {/* Check if there's at least one image */}
                {images.length > 0 ? (
                    <img src={images[currentImageIndex]?.image} alt={p.name} />
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
            <div className="pos-info bg-light border">
                <div className="container">
                    <div className="row text-light">
                        <div className="col">
                            <Link style={{textDecoration:"none"}} to={`/pos/${p.id}`}>
                                <h3>{truncateText(p.name,15)}</h3>
                            </Link>
                        </div>
                        <div className="col">
                            <p className="text-dark">{p.price} Tsh</p>
                        </div>
                    </div>
                   
                    <div className="row text-primary">
                   
                    
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PoSCard3;
