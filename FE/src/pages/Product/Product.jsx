import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import ProductList from '../../components/PageProduct/ProductList';
import { assets } from '../../assets/assets';
import { RxDotFilled } from 'react-icons/rx';

const Product = () => {
  const slides = [
    {
      url: assets.banner_product,
    },
    {
      url: assets.banner_product1,
    },
    {
      url: assets.banner_product2,
    },
    {
      url: assets.banner_product3,
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === slides.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Chuyển đổi slide sau mỗi 5 giây

    return () => {
      clearInterval(interval); // Xóa bỏ interval khi component unmount
    };
  }, [slides.length]); // Dependency array chỉ cần slides.length để đảm bảo useEffect được gọi lại khi slides thay đổi


  const goToSlide = (slideIndex) => {
    setCurrentIndex(slideIndex);
  };
  return (

    <div>
        <div className='max-w-[1196px] h-[424px] w-full m-auto pt-[14px] relative group'>
    <div
      style={{ backgroundImage: `url(${slides[currentIndex].url})` }}
      className='w-full h-full rounded-2xl bg-center bg-cover duration-500'
    ></div>

    
    <div className='flex top-4 justify-center py-2'>
      {slides.map((slide, slideIndex) => (
        <div
          key={slideIndex}
          onClick={() => goToSlide(slideIndex)}
          className={`text-2xl cursor-pointer ${
            currentIndex === slideIndex ? 'text-gray-900' : 'text-gray-400'
          }`}
        >
          <RxDotFilled />
        </div>
      ))}
    </div>
  </div>
  <ProductList/>
    </div>
    
  );
};

export default Product;
