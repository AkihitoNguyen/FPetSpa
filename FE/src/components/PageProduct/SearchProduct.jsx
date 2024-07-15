import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { debounce, escapeRegExp, filter } from 'lodash';
import { useNavigate } from 'react-router-dom';
const SearchProduct = ({ source, onResultSelect }) => {
  const initialState = {
    isLoading: false,
    results: [],
    value: '',
  };

  const [searchState, setSearchState] = useState(initialState);
  const navigate = useNavigate();
  const handleResultSelect = (e, { result }) => {
    setSearchState((prevState) => ({ ...prevState, value: result.title }));
    navigate(`/productdisplay/${result.title}`);
    onResultSelect(result);
  };

  const handleSearchChange = debounce((e, { value }) => {
    setSearchState((prevState) => ({ ...prevState, isLoading: true, value }));

    setTimeout(() => {
      if (value.length < 1) return setSearchState((prevState) => ({ ...prevState, ...initialState }));

      const re = new RegExp(escapeRegExp(value), 'i');
      const isMatch = (result) => re.test(result.productName);

      setSearchState((prevState) => ({
        ...prevState,
        isLoading: false,
        results: filter(source, isMatch).map(product => ({
          title: product.productName,
          description: product.productDescription,
          image: product.pictureName,
          price: `$${product.price}`
        })),
      }));
    }, 100);
  }, 100);

  return (
    <Grid>
      <GridColumn width={6}>
        <Search
          fluid
          loading={searchState.isLoading}
          onResultSelect={handleResultSelect}
          onSearchChange={handleSearchChange}
          results={searchState.results}
          value={searchState.value}
        />
      </GridColumn>
    </Grid>
  );
};

SearchProduct.propTypes = {
  source: PropTypes.array.isRequired,
  onResultSelect: PropTypes.func.isRequired,
};

export default SearchProduct;
