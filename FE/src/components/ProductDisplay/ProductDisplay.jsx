// eslint-disable-next-line no-unused-vars
import React, { useContext,useState,useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ShopContext } from '../Context/ShopContext';
import { getProductName } from '../../api/apiService';
import '../ProductDisplay/ProductDisplay.css';
import Grid from '@mui/material/Grid';
import Breadcrumb from '../Breadcrum/Breadcrum';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import RelatedProducts from '../RelatedProducts/RelatedProduct';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const ProductDisplay = () => {
  const { productName } = useParams();
  const { addToCart } = useContext(ShopContext);
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProduct();
  }, [productName]);

  const fetchProduct = async () => {
    try {
      const response = await getProductName({ productName });
      setProduct(response);
      if (response.length > 0) {
        setMainImage(response[0].picture);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  const handleIncreaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    if (product && product.length > 0) {
      addToCart(product[0].productId, quantity);
      toast.success("Product added to cart successfully!");
    } else {
      toast.error("Failed to add product to cart. Please try again.");
    }
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <Grid container spacing={2} className='container-grid'>
      <Grid item xs={12}>
        <Breadcrumb />
      </Grid>
      <Grid item xs={6}>
        <div className="productdisplay-left">
          <div className="productdisplay-img">
            <img src={mainImage} alt="Main Product" />
          </div>
        </div>
      </Grid>
      <Grid item xs={6}>
        <div className="productdisplay-right">
          <h1>{product[0].productName}</h1>
          <div className="productdisplay-right-star">
            {/* Star icons */}
          </div>
          <div className="productdisplay-right-prices">
            <div className="productdisplay-right-price-new">
              {product[0].price}
            </div>
          </div>
          <p className='producdisplay-right-desciption'>
            <span>Description :</span>{product[0].description}
          </p>
          <p className='productdisplay-right-category'>
            <span>Category :</span>{product[0].categoryName}
          </p>
          <div className='productdisplay-quantity'>
            <ButtonGroup variant="contained" aria-label="Basic button group">
              <Button onClick={handleDecreaseQuantity}>-</Button>
              <Button>{quantity}</Button>
              <Button onClick={handleIncreaseQuantity}>+</Button>
            </ButtonGroup>
          </div>
          <button className="learn-more" onClick={handleAddToCart}>Add To Cart</button>
        </div>
      </Grid>
      <Grid item xs={12}>
        <RelatedProducts />
      </Grid>
      <ToastContainer />
    </Grid>
  );
};

export default ProductDisplay;
