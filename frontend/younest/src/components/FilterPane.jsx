import React, { useState,useEffect } from 'react';

const FilterPane = ({ filters, onFilterSelect,setSelectedFilter,selectedFilter }) => {
    // const [selectedFilter, setSelectedFilter] = useState('All');

    
   

    const handleFilterClick = (filter) => {
        setSelectedFilter(filter);
        onFilterSelect(filter); // Notify parent about filter change
    };

    return (
        <div className="filter-pane" 
        style={{
             display: 'flex', 
             gap: '10px', 
             overflowX: 'auto',
            
             }}>
            {filters.map((filter) => (
                <button
                    key={filter}
                    style={{
                        padding: '8px 18px',
                        borderRadius: '20px',
                        backgroundColor: selectedFilter === filter ? '#007BFF' : '#f0f0f0',
                        color: selectedFilter === filter ? '#fff' : '#000',
                        border: 'none',
                        cursor: 'pointer',
                        width:'auto',
                        whiteSpace: 'nowrap',

                    }}
                    onClick={() => handleFilterClick(filter)}
                >
                    {filter}
                </button>
            ))}
        </div>
    );
};

export default FilterPane;
