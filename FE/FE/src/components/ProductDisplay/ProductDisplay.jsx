// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProductName } from '../../api/apiService';
import { assets } from '../../assets/assets';
import '../ProductDisplay/ProductDisplay.css'
import DescriptionBox from '../DescriptionBox/DescriptionBox';

const ProductDisplay = () => {
  const { productName } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetchProduct();
  }, [productName]);

  const fetchProduct = async () => {
    try {
      const response = await getProductName({ productName });
      setProduct(response);
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
<div className='productdisplay-main'>
<div className='productdisplay'>
<div className="productdisplay-left">
  <div className="productdisplay-img">
  {product.map((item,index)=>{
              return(
                <tr key={index}>
                <img src={item.picture} alt={item.productName} />
              </tr>
              )
            })}
  </div>
</div>
<div className="productdisplay-right">
  <h1> {product.map((item,index)=>{
              return(
                <tr key={index}>
                {item.productName}
              </tr>
              )
            })}</h1>
  <div className="productdisplay-right-star">
      <img src={assets.star_icon} alt="" />
      <img src={assets.star_icon} alt="" />
      <img src={assets.star_icon} alt="" />
      <img src={assets.star_icon} alt="" />
      <img src={assets.star_icon} alt="" />
      <p>(122)</p>
  </div>
  <div className="productdisplay-right-prices">
      <div className="productdisplay-right-price-new">
        {product.map((item,index)=>{
              return(
                <tr key={index}>
                {item.price}
              </tr>
              )
            })}
            </div>

  </div>
  <div className="producdisplay-right-desciption">
      Qua la tuyet voi luon quy di khan gia
      cam mon vi da ghe qua xem san pham nha chung em
  </div>
  <div className="productdisplay-right-size">
      <h1>Select Size</h1>
      <div className="productdisplay-right-sizes">
          <div>S</div>
          <div>M</div>
          <div>L</div>
          <div>XL</div>
          <div>XXL</div>
      </div>
  </div>
  <button>Add To Cart</button>
  <p className='productdisplay-right-category'><span>Categogy :</span>Women, T-Shirt, Crop-Top</p>
  <p className='productdisplay-right-category'><span>Tags :</span>Modern, Latest</p>
</div>
</div>
<div className='description'><DescriptionBox/></div>
</div>
  );
};

export default ProductDisplay;