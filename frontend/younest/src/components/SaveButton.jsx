import React from 'react'
import { useState, useEffect } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { saveUnsavestatus,toggleSaveProduct } from '../helpers/axios';
import { data } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const SaveButton = ({ prodId }) => {

    const {user} = useAuth();
    const [saved, setSaved] = useState(false);

    const get_saved_data = async ()=>{
        try{
            const savedProducts= await saveUnsavestatus();
            const savedProducts2 = savedProducts.saved_products?.map(p => p.id);
            setSaved(savedProducts2?.includes(prodId));
        }
        catch(error) {
            console.error("Error fetching saved products:", error)
        };
    }

    useEffect( () => {
        get_saved_data();   
    }, [prodId]);

    
    
    const toggleSave = async () => {
        console.log("here is my id",prodId);
        const datax = {"user":user.id,"prodId":prodId}
        console.log("here is my data",data)
           try{
            
            const response = await toggleSaveProduct(prodId,
                datax
            ); 
            setSaved(datax);
           }
           catch(error){
            console.log("Error saving product:", error)
           }    
    };


  return (
    <button onClick={toggleSave} className="save-btn">
    {saved ? <FaHeart color="red" /> : <FaRegHeart />}
</button>
  )
}

export default SaveButton