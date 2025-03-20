import React, { useEffect, useState } from "react";
import { getFosSale } from "../services/api";
import ForsaleCard from "../components/ForsaleCard";
import BackToTopButton from "../components/BackToTopButton";
import { useAuth } from "../contexts/AuthContext";
import AddForSale from "./AddForSale";

const ForSale = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const {user} = useAuth();

  useEffect(() => {
    const loadForSale = async () => {
      try {
        const products = await getFosSale();
        setProducts(products);
      } catch (err) {
        setError("Failed to load items...");
      } finally {
        setLoading(false);
      }
    };

    loadForSale();
  }, []);

  return (
    <div className="container-fluid p-0 mt-5">
      <div className="row">
        <div className="col"><h6>Products for Sale</h6></div>
        <div className="col">{user?  (<button className="btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#productModal">Add Forsale</button>):(<></>)}</div>
      </div>
      
      {loading ? (
        <div className="text-center my-3">
          <span>Loading items...</span>
        </div>
      ) : error ? (
        <div className="alert alert-danger text-center">{error}</div>
      ) : products.length > 0 ? (
        <div className="pos-grid">
          {products.map((product) => (
            <ForsaleCard product={product} key={product.id} className='col' />
          ))}
        </div>
      ) : (
        <div className="alert alert-info text-center">No items for sale...</div>
      )}
      <BackToTopButton/>


  <div className="modal" id="productModal">
  <div className="modal-dialog modal-fullscreen">
    <div className="modal-content">

      
      <div className="modal-header">
        <h4 className="modal-title">Add product  for sale</h4>
        <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
      </div>

     
      <div className="modal-body">
       <AddForSale/>
      </div>

     
      <div className="modal-footer">
        <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Close</button>
      </div>

    </div>
  </div>
</div>

    </div>
  );
};

export default ForSale;
