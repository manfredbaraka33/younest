// import "../css/Home.css";
// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { fetchSavedProducts } from '../helpers/axios';
// import SavedPosCard from '../components/SavedPosCard';

// const SavedPoS = () => {

//     const [savedProducts, setSavedProducts] = useState([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//     const getSavedProducts = async () => {
//         try {
//         const response = await fetchSavedProducts();
//         setSavedProducts(response || []);
//         console.log("Here are the saved ones",response);
//         } catch (error) {
//         console.error("Error fetching saved products:", error);
//         } finally {
//         setLoading(false);
//         }
//     };

//     getSavedProducts();
//     }, []);

   
   
//         const getShopDetails = async () => {
//             try {
//               const data = await getData(`/shop/${shopId}/`); 
//               console.log("Shop data is here...." + data);
//               setShop(data);
//             } catch (error) {
//               setError("Failed to load shop details.");
//             } 
//           };
    

     

//     console.log(savedProducts); 
    
//     // Remove product from list
//     const handleRemoveProduct = (productId) => {
//         setSavedProducts(savedProducts.filter(p => p.id !== productId));
//     };

//     return (
//     <div className="container mt-5">
//         <h2>Favourite Products</h2>
//         <div className="row">
//         {loading ? (
//         <p>Loading...</p>
//       ) : savedProducts.length === 0 ? (
//         <p>No added favorite products yet.</p>
//       ) : (
       
//           <div className="pos-grid">
//           {savedProducts.map((product) => (
//            <div className="col"><SavedPosCard key={product.id} p={product} onRemove={handleRemoveProduct}/></div>
//           ))}
    
//           </div>
//       )}
//         </div>
//     </div>
//     )
// }

// export default SavedPoS


import "../css/Home.css";
import React, { useEffect, useState } from "react";
import { fetchSavedProducts, getData } from '../helpers/axios'; 
import SavedPosCard from '../components/SavedPosCard';

const SavedPoS = () => {
    const [savedProducts, setSavedProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getSavedProducts = async () => {
            console.log("Fetching saved products..."); // Debugging log
            
            try {
                const response = await fetchSavedProducts();
                console.log("Fetched saved products:", response); // Debugging log
                
                if (!Array.isArray(response)) {
                    console.error("Invalid response format:", response);
                    setLoading(false);
                    return;
                }

                // Fetch shop details for each product
                const updatedProducts = await Promise.all(
                    response.map(async (product) => {
                        console.log(`Fetching shop details for shop ID: ${product.shop}`); // Debugging log
                        
                        try {
                            const shopData = await getData(`/shop/${product.shop}/`);
                            console.log(`Fetched shop details for shop ID ${product.shop}:`, shopData); // Debugging log
                            return { ...product, shopDetails: shopData }; // Append shop details
                        } catch (error) {
                            console.error(`Error fetching shop ${product.shop}:`, error);
                            return { ...product, shopDetails: null }; // Handle failed shop fetch
                        }
                    })
                );

                console.log("Final updated products with shop details:", updatedProducts); // Debugging log
                setSavedProducts(updatedProducts);
            } catch (error) {
                console.error("Error fetching saved products:", error);
            } finally {
                setLoading(false);
            }
        };

        getSavedProducts();
    }, []);

    // Remove product from list
    const handleRemoveProduct = (productId) => {
        console.log(`Removing product with ID: ${productId}`); // Debugging log
        setSavedProducts(savedProducts.filter(p => p.id !== productId));
    };

    return (
        <div className="container mt-5">
            <h2>Favourite Products</h2>
            <div className="row">
                {loading ? (
                    <p>Loading...</p>
                ) : savedProducts.length === 0 ? (
                    <p>No added favorite products yet.</p>
                ) : (
                    <div className="pos-grid">
                        {savedProducts.map((product) => (
                            <div className="col" key={product.id}>
                                <SavedPosCard 
                                    p={product} 
                                    onRemove={handleRemoveProduct} 
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default SavedPoS;
