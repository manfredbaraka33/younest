import React,{useState,useEffect} from 'react'
import Shopcard from '../components/Shopcard';
import { getShops } from '../services/api';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ShopsList = () => {

const {user} = useAuth();

const [shops, setShops] = useState([]);
   const [error, setError] = useState(null);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
    const loadshops = async () => {
      try {
        const shops = await getShops();
        setShops(shops);
       //  setLe(pos.length);
      } catch (err) {
       
        setError("Failed to load items...");
      } finally {
        setLoading(false);
      }
    };

    loadshops();
  }, []);

  return (
    <div className='contanier mt-4'>
        <br />
        <div className="row">
          <div className="col-sm-12 col-md-8 col-lg-6">
            <h2>All shops</h2> 
          </div>
          <div className="col">

          {user ? (<div className="row"><div className='col'><Link to="/myshops"><button className='btn btn-success'>My shops</button></Link></div><div className='col mx-3'><Link to="/addshop"><button className='btn btn-primary'>Create shop</button></Link></div></div>):
          ( <Link to="/login"><button className='btn btn-danger'>Login to Create shop</button></Link>)
          }
          </div>
        </div>
        <div className="row">
        {shops?(shops.map((shop)=>(<div className='col-sm-12 col-md-6 col-lg-4'><Shopcard className="bg-secondary"  shop={shop} key={shop.id}/></div>))):(<div>No shops found</div>)}
        </div>
    </div>
  )
}

export default ShopsList