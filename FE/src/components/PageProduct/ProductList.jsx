// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState, useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getAllProduct, getProductsByCategory } from '../../api/apiService';
import { DropdownButton, Dropdown, Row, Col } from 'react-bootstrap';
import Grid from '@mui/material/Grid';
import ListItemText from '@mui/material/ListItemText';
import { ShopContext } from '../Context/ShopContext';
import { Link } from 'react-router-dom';
// import { BsCart4 } from 'react-icons/bs';
import '../PageProduct/ProductList.css';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
// import Rating from '@mui/material/Rating';
const ProductList = () => {
  const [productList, setProductList] = useState([]);
  const [sortedProductList, setSortedProductList] = useState([]);
  const { addToCart } = useContext(ShopContext);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortTitle, setSortTitle] = useState('Sort Options');

  useEffect(() => {
    fetchProducts();
  }, [selectedCategories]);

  useEffect(() => {
    const sortedList = [...productList];
    sortedList.sort((a, b) => a.price - b.price);
    sortDefault();
    setSortedProductList(sortedList);
  }, [productList]);

  const fetchProducts = async () => {
    try {
      let response;
      if (selectedCategories.length === 0) {
        response = await getAllProduct(); 
      } else {
        const promises = selectedCategories.map(category => getProductsByCategory({ category }));
        response = await Promise.all(promises).then(responses => responses.flat());
      }
      setProductList(response);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  

  const sortAscending = () => {
    const sortedList = [...sortedProductList];
    sortedList.sort((a, b) => a.price - b.price);
    setSortedProductList(sortedList);
    setSortTitle('Sort By Price: Low to High');
  };

  const sortDescending = () => {
    const sortedList = [...sortedProductList];
    sortedList.sort((a, b) => b.price - a.price);
    setSortedProductList(sortedList);
    setSortTitle('Sort By Price: High to Low');
  };
  const sortDefault = () => {
    setSortedProductList(productList);
    setSortTitle('Default Sorting');
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <FormControl sx={{ m: 1, width: 300 }}>
        <label >Product Type</label>
          <InputLabel id="demo-multiple-checkbox-label">Categories</InputLabel>
          <Select
            labelId="demo-multiple-checkbox-label"
            id="demo-multiple-checkbox"
            multiple
            value={selectedCategories}
            onChange={(event) => setSelectedCategories(event.target.value)}
            input={<OutlinedInput label="Categories" />}
            renderValue={(selected) => selected.join(', ')}
          >
            {['Dog Food', 'Cat Food', 'Balo', 'Toy', 'Cake'].map((item, index) => (
              <MenuItem key={index} value={item}>
                <Checkbox checked={selectedCategories.includes(item)} />
                <ListItemText primary={item} />
              </MenuItem>
            ))}
          </Select>
          <div className='sort'>
          <Row className="align-items-center">
            <Col xs="auto">
              <label>Sort:</label>
            </Col>
            <Col xs="auto">
              <DropdownButton id="demo-multiple-checkbox-label" title={sortTitle}>
                <Dropdown.Item onClick={sortDefault}>Default Sort</Dropdown.Item>
                <Dropdown.Item onClick={sortDescending}>Sort By Price: High to Low</Dropdown.Item>
                <Dropdown.Item onClick={sortAscending}>Sort By Price: Low to High</Dropdown.Item>
              </DropdownButton>
            </Col>
          </Row>
        </div>
        </FormControl>
      </Grid>

      <Grid item xs={12}>
        <Grid container spacing={2} className='product'>
          {sortedProductList.map((product, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
              {/* <article className="article-wrapper">
                <div className="rounded-lg container-project">
                  <Link to={`/productdisplay/${product.productName}`}>
                    <img src={product.picture} alt={product.productName} className="img-fluid" />
                  </Link>
                </div>
                <div className="project-info">
                  <div className="flex-pr">
                    <div className="project-title text-nowrap">{product.productName}</div>
                    <div className='rating'><Rating name="size-small" defaultValue={5} /></div>
                    <div className="project-hover">
                      <BsCart4
                        className='cart-icon'
                        onClick={() => addToCart(product.productId, 1)} // Add to cart on click
                        style={{ marginLeft: '170px', cursor: 'pointer',marginBottom:'-24%' }}
                      />
                    </div>
                  </div>
                  <div className="types">
                    <span className="project-type" style={{ backgroundColor: 'rgba(165, 96, 247, 0.43)', color: 'rgb(85, 27, 177)' }}>
                      ${product.price}
                    </span>
                  </div>
                </div>
              </article> */}
                <div className="card">
  <div className="card-img">
    <Link to={`/productdisplay/${product.productName}`}>
    <img src={product.picture} alt={product.productName} className="img-fluid" />
    </Link>
    </div>
  <div className="card-info">
    <p className="text-title">{product.productName} </p>
    <p className="text-body">{product.productName}</p>
  </div>
  <div className="card-footer">
  <span className="text-title">${product.price}</span>
  <div className="card-button"  onClick={() => addToCart(product.productId, 1)}>
    <svg className="svg-icon" viewBox="0 0 20 20">
      <path d="M17.72,5.011H8.026c-0.271,0-0.49,0.219-0.49,0.489c0,0.271,0.219,0.489,0.49,0.489h8.962l-1.979,4.773H6.763L4.935,5.343C4.926,5.316,4.897,5.309,4.884,5.286c-0.011-0.024,0-0.051-0.017-0.074C4.833,5.166,4.025,4.081,2.33,3.908C2.068,3.883,1.822,4.075,1.795,4.344C1.767,4.612,1.962,4.853,2.231,4.88c1.143,0.118,1.703,0.738,1.808,0.866l1.91,5.661c0.066,0.199,0.252,0.333,0.463,0.333h8.924c0.116,0,0.22-0.053,0.308-0.128c0.027-0.023,0.042-0.048,0.063-0.076c0.026-0.034,0.063-0.058,0.08-0.099l2.384-5.75c0.062-0.151,0.046-0.323-0.045-0.458C18.036,5.092,17.883,5.011,17.72,5.011z"></path>
      <path d="M8.251,12.386c-1.023,0-1.856,0.834-1.856,1.856s0.833,1.853,1.856,1.853c1.021,0,1.853-0.83,1.853-1.853S9.273,12.386,8.251,12.386z M8.251,15.116c-0.484,0-0.877-0.393-0.877-0.874c0-0.484,0.394-0.878,0.877-0.878c0.482,0,0.875,0.394,0.875,0.878C9.126,14.724,8.733,15.116,8.251,15.116z"></path>
      <path d="M13.972,12.386c-1.022,0-1.855,0.834-1.855,1.856s0.833,1.853,1.855,1.853s1.854-0.83,1.854-1.853S14.994,12.386,13.972,12.386z M13.972,15.116c-0.484,0-0.878-0.393-0.878-0.874c0-0.484,0.394-0.878,0.878-0.878c0.482,0,0.875,0.394,0.875,0.878C14.847,14.724,14.454,15.116,13.972,15.116z"></path>
    </svg>
  </div>
</div></div>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ProductList;
