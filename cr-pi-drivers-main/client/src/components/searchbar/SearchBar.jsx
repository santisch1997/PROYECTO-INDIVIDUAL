import React, { useState } from 'react';
import './SearchBar.css'; 

const SearchBar = ({ onSearch, searchTerm }) => {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  const handleSearch = () => {
    onSearch(localSearchTerm);
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Buscar conductor por nombre"
        value={localSearchTerm}
        onChange={(e) => setLocalSearchTerm(e.target.value)}
      />
      <button onClick={handleSearch}>Buscar</button>
    </div>
  );
};

export default SearchBar;
