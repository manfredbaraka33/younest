import PoSCard from "../components/PoSCard";
import { useState, useEffect } from "react";
import { getProductsOrServices } from "../services/api";
import "../css/Home.css";
import React from 'react'
import FilterPane from "../components/FilterPane";
import { FaSearch } from "react-icons/fa";
import BackToTopButton from "../components/BackToTopButton";

const Home = () => {
   const [pos, setPoS] = useState([]);
   const [error, setError] = useState(null);
   const [loading, setLoading] = useState(false);
   const [len,setLen] = useState(true);
   const [le,setLe] = useState();

   useEffect(() => {
     const loadpos = async () => {
       try {
         const pos = await getProductsOrServices();
         setPoS(pos);
       } catch (err) {
        
         setError("Failed to load items...");
       } finally {
         setLoading(false);
       }
     };
 
     loadpos();
   }, []);

   const filters = ['All', 'electronics', 'books', 'clothing', 'services','food','bedings','kitchen','skin care','perfume','banking','mobile money','recreation','pharmacy','medical Lab'];
   const [flt,setFlt] = useState('All')
   const [selectedFilter, setSelectedFilter] = useState('All');

   const handleFilterSelect = (filter) => {
    setSelectedFilter(filter);  // Update active filter
    fetch(`http://localhost:8000/api/filter-products/?category=${filter}`)
        .then((response) => response.json())
        .then((data) => 
        {
          setPoS(data.products);
          console.log(data)
          console.log(data.products)
          setFlt(filter);
          if(data.products.length==0){
            setLen(false);
          }else{
            setLen(true);
            setLe(data.products.length)
          }
        }
        )
        .catch((error) => console.error('Error fetching products:', error));
};

const [searchQuery, setSearchQuery] = useState("");

const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
};

    // Handle 'Enter' key press
const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
          handleSearch(); // Trigger the search if Enter is pressed
      }
  };

 
const handleSearch = () => {
  setLen(true);
  setSelectedFilter('All')
  if (searchQuery.trim() !== "") {
    fetch(`http://localhost:8000/api/search/?query=${searchQuery}`)
      .then((response) => response.json())
      .then((data) => {
        // Updating the state with the search results
        setPoS(data.results);  
        setLe(data.results.length)
      })
      .catch((error) => console.error("Error searching:", error));
  }
};


  return (
    <div className="home px-1">
        <div className="search-bar">
            <input type="text"
             placeholder="Search products or services here...."
             value={searchQuery} 
             onChange={handleSearchChange}
             onKeyDown={handleKeyDown}
             />
            <button id="search-button" onClick={handleSearch}>
              <FaSearch/>
            </button>
        </div>


    <FilterPane  filters={filters}
     onFilterSelect={handleFilterSelect}
     setSelectedFilter={setSelectedFilter}
     selectedFilter={selectedFilter}
     />

      {error && <div className="error-message">{error}</div>}

       <div className="row">
       {loading ? (
        <div className="loading">Loading...</div>
      ) : (
          !len ? (<div style={{margin:"20px"}}>No results found for {flt}</div>

         ):(<>
            <center><h6 style={{marginTop:"5px"}}>{le} Result(s)</h6></center>
            <div className="pos-grid"> 
            {pos?.map((p) => (
              <div className="col" key={p.id}><PoSCard p={p}  /></div>
            ))}
          </div>
         </>
          )
        
      )}
       </div>
       <BackToTopButton/>
    </div>
  )
}

export default Home




