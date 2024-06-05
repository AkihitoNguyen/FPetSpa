// Search.jsx
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import PropTypes from 'prop-types';
const Search = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    // Gửi yêu cầu tìm kiếm đến component cha
    onSearch(searchQuery);
  };
  Search.propTypes = {
    onSearch: PropTypes.func.isRequired,
  };

  return (
    <div>
      <Form.Control
        type="text"
        placeholder="Search products..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <Button variant="primary" onClick={handleSearch}>Search</Button>
    </div>
  );
}

export default Search;
