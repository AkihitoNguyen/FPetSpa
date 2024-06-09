// eslint-disable-next-line no-unused-vars
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../Product/Product.css';
import Grid from '@mui/material/Grid';
import { assets } from '../../assets/assets';
import Breadcrumb from '../../components/Breadcrum/Breadcrum';
import Search from '../../components/PageProduct/Search';
import ProductList from '../../components/PageProduct/ProductList';

const Product = () => {
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <img src={assets.Un} alt="Product" style={{ width: '100%', height: 'auto' }} />
        </Grid>
        <Grid item xs={12}>
          <Breadcrumb />
        </Grid>
        <Grid item xs={12}><Search/></Grid>
        <Grid item xs={12}><ProductList/></Grid>
      </Grid>
    </>
  );
};

export default Product;
