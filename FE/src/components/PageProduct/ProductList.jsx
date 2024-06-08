// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState, useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getAllProduct } from '../../api/apiService';
import { DropdownButton, Dropdown, Form, Row, Col } from 'react-bootstrap';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ListSubheader from '@mui/material/ListSubheader';
import ListItemIcon from '@mui/material/ListItemIcon';
import { ShopContext } from '../Context/ShopContext';
import DraftsIcon from '@mui/icons-material/Drafts';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import { Link } from 'react-router-dom';
import { BsCart4 } from 'react-icons/bs';
import PetsIcon from '@mui/icons-material/Pets';
import '../PageProduct/ProductList.css';

const ProductList = () => {
  const [productList, setProductList] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [sortedProductList, setSortedProductList] = useState([]);
  const [open, setOpen] = useState(true);
  const { addToCart } = useContext(ShopContext);

  useEffect(() => {
    fetchDefaultProducts();
  }, []);

  useEffect(() => {
    if (categoryName) {
      fetchProducts();
    }
  }, [categoryName]);

  useEffect(() => {
    const sortedList = [...productList];
    sortedList.sort((a, b) => a.price - b.price);
    setSortedProductList(sortedList);
  }, [productList]);

  const fetchDefaultProducts = async () => {
    try {
      const defaultProducts = await getAllProduct({ category: 'Dog Food' });
      setProductList(defaultProducts);
    } catch (error) {
      console.error("Error fetching default products:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await getAllProduct({ category: categoryName });
      setProductList(response);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleCategoryClick = (category) => {
    setCategoryName(category);
  };

  const sortAscending = () => {
    const sortedList = [...sortedProductList];
    sortedList.sort((a, b) => a.price - b.price);
    setSortedProductList(sortedList);
  };

  const sortDescending = () => {
    const sortedList = [...sortedProductList];
    sortedList.sort((a, b) => b.price - a.price);
    setSortedProductList(sortedList);
  };

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={4}>
        <List
          sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
          component="nav"
          aria-labelledby="nested-list-subheader"
          subheader={
            <ListSubheader component="div" id="nested-list-subheader">
              Product Categories
            </ListSubheader>
          }
        >
          <ListItemButton onClick={() => handleCategoryClick('Dog Food')}>
            <ListItemIcon>
              <PetsIcon />
            </ListItemIcon>
            <ListItemText primary="Dog Food" />
          </ListItemButton>
          {['Cat Food', 'Balo', 'Toy', 'Cake'].map((item, index) => (
            <ListItemButton key={index} onClick={() => handleCategoryClick(item)}>
              <ListItemIcon>
                <PetsIcon />
              </ListItemIcon>
              <ListItemText primary={item} />
            </ListItemButton>
          ))}
          <ListItemButton onClick={handleClick}>
            <ListItemIcon>
              <DraftsIcon />
            </ListItemIcon>
            <ListItemText primary="More" />
            {open ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemIcon>
                  <PetsIcon />
                </ListItemIcon>
                <ListItemText primary="Starred" />
              </ListItemButton>
            </List>
          </Collapse>
        </List>
        <Form.Label>Price Range</Form.Label>
        <Form.Range />
      </Grid>
      <Grid item xs={8}>
        <div className='sort'>
          <Row className="align-items-center">
            <Col xs="auto">
              <span>Sort: </span>
            </Col>
            <Col xs="auto">
              <DropdownButton id="dropdown-basic-button" title="Sort Options">
                <Dropdown.Item onClick={sortDescending}>High to Low</Dropdown.Item>
                <Dropdown.Item onClick={sortAscending}>Low to High</Dropdown.Item>
              </DropdownButton>
            </Col>
          </Row>
        </div>
        <Grid container spacing={2} className='product'>
          {sortedProductList.map((product, index) => (
            <Grid item key={index}>
              <Card sx={{ maxWidth: 345 }}>
                <CardActionArea>
                  <Link to={`/productdisplay/${product.productName}`}>
                    <CardMedia
                      component="img"
                      height="140"
                      image={product.picture}
                      alt={product.productName}
                    />
                  </Link>
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {product.productName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ${product.price}
                      <BsCart4 
                        className='cart-icon' 
                        onClick={() => addToCart(product.productId, 1)} // Add to cart on click
                      />
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ProductList;
