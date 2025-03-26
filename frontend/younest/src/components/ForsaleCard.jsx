import "../css/PoSCard.css"
import { Link } from "react-router-dom"
import { useState } from "react"
import { FaMapMarkerAlt } from "react-icons/fa";


function ForSalecard({ product }) {
    const images = Array.isArray(product?.image) ? product.image : [];
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
        if (currentImageIndex < product.image.length - 1) {
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
            setCurrentImageIndex(product.image.length - 1); // Loop back to the last image
        }
    };

    return (
        <div className="pos-card border border-secondary">
            <Link style={{textDecoration:"none"}} to={`/product/${product.id}`}>
            <div className="pos-poster">
                {product.image.length > 1 && (
                    <button className="carousel-btn prev-btn" onClick={prevImage}>
                        &#10094;
                    </button>
                )}

                {/* Check if there's at least one image */}
                {images.length > 0 ? (
                    <img src={images[currentImageIndex]?.image} alt={product.name} />
                ) : (
                    <img src="default-image.jpg" alt="default" /> // Fallback if no images
                )}

                
                {product.image.length > 1 && (
                    <button className="carousel-btn next-btn" onClick={nextImage}>
                        &#10095;
                    </button>
                )}
            </div>
            </Link>
            <div className="pos-info">
                <div className="container p-2">
                    <div className="row">
                        <div className="col">
                            <Link style={{textDecoration:"none"}} to={`/product/${product.id}`}>
                                <h3>{truncateText(product.name,15)}</h3>
                            </Link>
                            
                        </div>
                        <div className="col">
                            <p className="">{product.price} Tsh</p>
                        </div>
                    </div>
                    <div className="row text-warning">
                        <div className="col">
                            {product.seller.username}
                        </div>
                       
                    </div>
                    <div className="row text-primary px-0">
                   
                    <div style={{fontSize:"larger",fontWeight:"bold"}} className="col px-4 text-secondary"><FaMapMarkerAlt/> {truncateText(product.location,15)}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ForSalecard;
