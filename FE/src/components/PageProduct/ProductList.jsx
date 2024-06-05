// eslint-disable-next-line no-unused-vars

import 'bootstrap/dist/css/bootstrap.min.css';
import { assets } from '../../assets/assets';
import '../PageProduct/ProductList.css'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import SearchProduct from './SearchProduct';
import Search from './Search';

// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';

import Breadcrumb from '../Breadcrum/Breadcrum';
import 'bootstrap/dist/css/bootstrap.min.css';


const ProductList = () => {
  return (
    <>
    <Container>
        <Row>
<div className='banner-Un'>
<img src={assets.Un} alt=""/>
</div>
        </Row>
        <Col>
        <Search/>
        </Col>
        <Col>
   <Breadcrumb/>
        </Col>
      <Row >
        <SearchProduct/>
      </Row>
    </Container>




    </> 
  )
}

export default ProductList;
