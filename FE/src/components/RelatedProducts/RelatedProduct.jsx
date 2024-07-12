// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProductName, getAllProduct } from '../../api/apiService'; // Ensure both functions are imported
import '../RelatedProducts/RelatedProducts.css';

import CardMedia from '@mui/material/CardMedia';

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
    <div className="bg-white">
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
      <h2 className="text-center text-2xl font-bold tracking-tight text-gray-900">Customers also purchased</h2>
      <div className="mt-6 flex overflow-x-auto space-x-6">
        {relatedProducts.slice(0, 10).map((product) => (
          <div key={product.productId} className="group relative flex-shrink-0 w-60">
            <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-60">
              <Link to={`/productdisplay/${product.productName}`}>
                <CardMedia
                  component="img"
                  height="140"
                  image={product.pictureName}
                  alt={product.productName}
                />
              </Link>
            </div>
            <div className="mt-4 flex justify-between">
              <p className="text-sm font-medium text-gray-900">{product.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
  );
};

export default RelatedProducts;
