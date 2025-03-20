import "../css/PoSCard.css"
import { Link } from "react-router-dom"
import { useState } from "react"

function PoSCard2({ p }) {
    const images = Array.isArray(p?.image) ? p.image : [];
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
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
        <div className="pos-card2">
             {/* className="pos-poster" */}
            <div className="">  
                {p.image.length > 1 && (
                    <button className="carousel-btn prev-btn" onClick={prevImage}>
                        &#10094;
                    </button>
                )}

                {/* Check if there's at least one image */}
                {images.length > 0 ? (
                    <img src={images[currentImageIndex]?.image}  className="image-fluid" alt={p.name} />
                ) : (
                    <img src="default-image.jpg" className="image-fluid" alt="default" /> // Fallback if no images
                )}

                
                {p.image.length > 1 && (
                    <button className="carousel-btn next-btn" onClick={nextImage}>
                        &#10095;
                    </button>
                )}

            </div>
        </div>
    );
}

export default PoSCard2;
