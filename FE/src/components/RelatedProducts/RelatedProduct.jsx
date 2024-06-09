// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProductName, getAllProduct } from '../../api/apiService'; // Ensure both functions are imported
import '../RelatedProducts/RelatedProducts.css';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import { CardActionArea } from '@mui/material';
import { Link } from 'react-router-dom';

const RelatedProducts = () => {
  const { productName } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]); // State to hold related products

  useEffect(() => {
    fetchProduct();
  }, [productName]);

  const fetchProduct = async () => {
    try {
      const response = await getProductName({ productName });
      setProduct(response);
      if (response.length > 0) {
        const categoryName = response[0].categoryName;
        fetchRelatedProducts(categoryName);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  const fetchRelatedProducts = async (categoryName) => {
    try {
      const response = await getAllProduct({ category: categoryName });
      console.log('Related Products:', response); // Log related products to check structure
      setRelatedProducts(response);
    } catch (error) {
      console.error("Error fetching related products:", error);
    }
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className='relatedproducts'>
      <h1>Related Products</h1>
      <hr />
      <div className="relatedproducts-item">
        {relatedProducts.slice(0, 3).map((product, index) => (
          <Card sx={{ maxWidth: 300 }} className="product-card" key={index}>
            <CardActionArea>
              <Link to={`/productdisplay/${product.productName}`}>
                <CardMedia
                  component="img"
                  height="140"
                  image={product.picture}
                  alt={product.productName}
                />
              </Link>
            </CardActionArea>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
