// src/components/Breadcrumb.js
// eslint-disable-next-line no-unused-vars
import React from 'react';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';

const Breadcrumb = () => {
  return(
  // <Breadcrumb>
  //   <Breadcrumb.Item href="#">Home</Breadcrumb.Item>
  //   <Breadcrumb.Item href="#">Category</Breadcrumb.Item>
  //   <Breadcrumb.Item active>Product</Breadcrumb.Item>
  // </Breadcrumb>

  <div>
    <Breadcrumbs aria-label="breadcrumb">
  <Link underline="hover" color="inherit" href="/">
    MUI
  </Link>
  <Link
    underline="hover"
    color="inherit"
    href="/material-ui/getting-started/installation/"
  >
    Core
  </Link>
  <Typography color="text.primary">Breadcrumbs</Typography>
</Breadcrumbs> 
  </div>
  )
}


export default Breadcrumb;
