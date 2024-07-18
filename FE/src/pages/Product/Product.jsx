import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../Product/Product.css';
import ProductList from '../../components/PageProduct/ProductList';
import { assets } from '../../assets/assets';

const Product = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    {
      src: assets.banner_product,
      alt: "Los Angeles",
    },
    {
      src: assets.banner_product1,
      alt: "Chicago",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 5000); // 5 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [slides.length]);

  return (
    <div className='breakdance'>
      <div className="pt-80 pb-80 w-11/12 m-auto overflow-hidden relative h-64 md:h-96">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img src={slide.src} alt={slide.alt} className="w-full h-full object-contain " />
          </div>
        ))}
      </div>
      <ProductList />
    </div>
  );
};

export default Product;
