import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import PoSCard from '../components/PoSCard';
import { useAuth } from '../contexts/AuthContext';
import AddProduct from './AddProduct';
import PoSCard3 from '../components/PosCard3';
import { followUnfollowShop, getData } from '../helpers/axios'; // Import axios helpers
import { FaArrowLeft } from 'react-icons/fa';



const ShopDetails = () => {
  const { user } = useAuth();
  console.log(user);
  const { shopId } = useParams();
  const [shop, setShop] = useState(null);
  const [pos, setPoS] = useState([]);
  const [loadingShop, setLoadingShop] = useState(true);
  const [loadingPos, setLoadingPos] = useState(true);
  const [error, setError] = useState(null);
  const [len, setLen] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false); // Set default to false
  const [followersCount, setFollowersCount] = useState(0); // Default followers count

  const getShopDetails = async () => {
    try {
      const data = await getData(`/shop/${shopId}/`); 
      console.log("Shop data is here...." + data);
      setShop(data);
    } catch (error) {
      setError("Failed to load shop details.");
    } finally {
      setLoadingShop(false);
    }
  };

  const getShopProducts = async () => {
    try {
      const data = await getData(`/shop/${shopId}/products/`); 
      console.log(data);
      setPoS(data);
      setLen(data.length);
    } catch (error) {
      setError("Failed to load products.");
    } finally {
      setLoadingPos(false);
    }
  };

  useEffect(() => {
    getShopDetails();
    getShopProducts();
  }, [shopId]);

  // Update local follow state when shop data is loaded/changed
  useEffect(() => {
    if (shop) {
      setIsFollowing(shop.is_following);
      setFollowersCount(shop.followers_count);
    }
  }, [shop]);

  const handleFollowUnfollow = async () => {
    try {
      const updatedShop = await followUnfollowShop(shop.id); // API call returns updated shop data
      setShop(updatedShop);
      setIsFollowing(updatedShop.is_following); // Update follow status
      setFollowersCount(updatedShop.followers_count); // Update followers count
    } catch (error) {
      console.error("Failed to follow/unfollow shop:", error);
    }
  };

  if (error) return <div>{error}</div>;
  if (loadingShop || !shop) return <div>Loading shop details...</div>;
  if (loadingPos) return <div>Loading products...</div>;

  return (
    <div className="container-fluid py-0 mt-5">
      <Link className='' to="/shops"><FaArrowLeft /></Link>
      <br /><br />
      <center>
        <h2 className=" p-2 text-primary">
          <span>
            <img src={shop.logo} width="45px" height="45px" className="rounded-circle" alt="logo" />
          </span> {shop.name}
        </h2>
      </center>
      <div className="row">
        <div className="col my-1">
          <div className="">
            <div className="">
              <center>
              <span className="mx-2">Location: {shop.location}</span>
              <span className="mx-2">Contacts: {shop.contact}</span>
              <span className="mx-2">Followers: {followersCount}</span>
              {user ? (
                <button
                  onClick={handleFollowUnfollow}
                  className={isFollowing ? "unfollow-btn" : "follow-btn"}
                >
                  {isFollowing ? "Unfollow" : "Follow"}
                </button>
              ) : (
                <p>Login <Link to="/login"> here </Link> to follow this shop</p>
              )}
              </center>
              <br />
              
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid my-2 p-0">
        <div className="row py-2">
          <div className="col">
            <h5>Products ({len})</h5>
          </div>
          <div className="col">
            {user ? (user.id === shop.owner && (
              <button className="btn btn-outline-success" data-bs-toggle="modal" data-bs-target="#productModal">
                Add product
              </button>
            )) : (<></>)}
          </div>
        </div>

        <div className="row">
          {pos.length > 0 ? (
            pos.map((p) => (
              <div className="col-sm-12 col-md-6 col-lg-4 my-2" key={p.id}>
                <PoSCard3 p={p} />
              </div>
            ))
          ) : (
            <div>No results found.</div>
          )}
        </div>
      </div>

      <div className="modal" id="productModal">
        <div className="modal-dialog modal-fullscreen">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Add product for {shop.name}</h4>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <AddProduct shop={shop} />
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

export default ShopDetails;
