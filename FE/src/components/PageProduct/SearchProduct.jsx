// SearchBar.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchProduct = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (query) {
      navigate(`/search?query=${query}`);
      setQuery(''); // Reset the search input field
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative">
      <input
        className="rounded-full px-8 py-3 border-2 border-transparent focus:outline-none focus:border-blue-500 placeholder-gray-400 transition-all duration-300 shadow-md"
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for products"
      />
    </form>
  );
};

export default SearchProduct;
