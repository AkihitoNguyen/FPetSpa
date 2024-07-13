// eslint-disable-next-line no-unused-vars
import React, { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ShopContext } from '../Context/ShopContext';
import { getProductName } from '../../api/apiService';
import { StarIcon } from '@heroicons/react/20/solid';
import 'react-toastify/dist/ReactToastify.css';
import { assets } from '../../assets/assets';
import '../ProductDisplay/ProductDisplay.css'
import RelatedProduct from '../../components/RelatedProducts/RelatedProduct'

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
      if (response && response.length > 0) {
        setProduct(response[0]);
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
    if (product) {
      addToCart(product.productId, quantity);
    }
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  const renderStars = (rating) => {
    const stars = [];
    const totalStars = rating ?? 5; // Nếu không có rating, mặc định là 5 sao
    for (let i = 0; i < totalStars; i++) {
      stars.push(
        <StarIcon key={i} className="h-5 w-5 text-yellow-400" /> // Đây là icon sao của bạn, thay thế bằng icon của bạn
      );
    }
    return stars;
  };

  return (
    <div className="bg-white">
      <div className="pt-6">
        {/* Image gallery */}
        
        <div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:grid lg:max-w-[65rem] lg:grid-cols-3 lg:gap-x-8 lg:px-8 ">
  <div className="hidden lg:grid lg:grid-cols-1 lg:gap-y-5">
    <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
      <img
        src={mainImage}
        alt={product.productName}
        className="h-full w-full object-cover object-center"
      />
    </div>
    <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
      <img
        src={product.pictureName}
        alt={product.productName}
        className="h-full w-full object-cover object-center"
      />
    </div>
  </div>
  <div className="aspect-h-5 aspect-w-4 lg:aspect-h-4 lg:aspect-w-3 sm:overflow-hidden sm:rounded-lg lg:col-span-2">
    <img
      src={'https://bixbipet.com/wp-content/uploads/2022/09/WebTiles_Rawbble_Cat_Dry_ChickenSalmonIndoor_1.png'}
      alt={product.productName}
      className="h-full w-full object-cover object-center"
    />
  </div>
</div>

        {/* Product info */}
        <div className="mx-auto max-w-2xl px-4 pb-16 pt-10 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pb-24 lg:pt-16">
          <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{product.productName}</h1>
          </div>

          {/* Options */}
          <div className="mt-4 lg:row-span-3 lg:mt-0">
            <h2 className="sr-only">Product information</h2>
            <p className="text-3xl tracking-tight text-gray-900">${product.price}</p>

            {/* Reviews */}
            <div className="mt-6">
              <h3 className="sr-only">Reviews</h3>
              <div className="flex items-center">
                <div className="flex items-center">
                  {renderStars(product.averageRating)}
                </div>
                <p className="sr-only">{product.averageRating} out of 5 stars</p>
                <a href="#reviews" className="ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500">
                  {product.totalReviews} reviews
                </a>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="mt-6">
              <div className="flex items-center space-x-2">
                <button onClick={handleDecreaseQuantity} className="px-4 py-2 border">-</button>
                <span>{quantity}</span>
                <button onClick={handleIncreaseQuantity} className="px-4 py-2 border">+</button>
              </div>
            </div>

            <button
              className="mt-10 w-full flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              onClick={handleAddToCart}
            >
              Add to cart
            </button>
          </div>

          <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pb-16 lg:pr-8 lg:pt-6">
            {/* Description and details */}
            <div>
              <h3 className="sr-only">Description</h3>
              <div className="space-y-6">
                <p className="text-base text-gray-900">{product.productDescription}</p>
              </div>
            </div>
            <div className="mt-10">
              <h2 className="text-sm font-medium text-gray-900">Details</h2>
              <div className="mt-4 space-y-6">
                <p className="text-sm text-gray-600">{product.productDescription}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='breakdance1'>
      <section className='bde-section-145096-100 bde-section'>
        <div className='section-container'>
          <div className='bde-globalblock-145096-101 bde-globalblock'>
            <div className='breakdance1'>
              <section className='bde-section-145113-100 bde-section'>
                <div className='section-container'>
                  <h1 className='bde-heading-145113-101 bde-heading'>
                    We craft each recipe for superior nutrition and flavor using trusted ingredient sourcing and thorough product testing
                  </h1>
                  <div className='b-product-features-box-145113-124 b-product-features-box'>
                    <div className='swiper-wrapper b-features-ticker' style={{ '--features-count': 6 }}>
                        <div className='ticker-wrapper'>
                          <div className='swiper-slide'>
                            <div className='b-feature'>
                              <div className='b-feature__icon-box'>
                              <img
                                width="300"
                                height="300"
                                src="https://bixbipet.com/wp-content/uploads/2023/02/icons_Grain-Free-Recipe-300x300.png"
                                className="b-feature__icon"
                                alt=""
                                decoding="async"
                                loading="lazy"
                                srcSet="https://bixbipet.com/wp-content/uploads/2023/02/icons_Grain-Free-Recipe-300x300.png 300w, https://bixbipet.com/wp-content/uploads/2023/02/icons_Grain-Free-Recipe-150x150.png 150w, https://bixbipet.com/wp-content/uploads/2023/02/icons_Grain-Free-Recipe-100x100.png 100w, https://bixbipet.com/wp-content/uploads/2023/02/icons_Grain-Free-Recipe.png 500w"
                                sizes="(max-width: 300px) 100vw, 300px"
                              />
                              </div>
                              <h6 className="b-feature__title">Grain Free Recipe†</h6>
                            </div>
                          </div>

                          <div className='swiper-slide'>
                            <div className='b-feature'>
                              <div className='b-feature__icon-box'>
                              <img
                                width="300"
                                height="300"
                                src="https://bixbipet.com/wp-content/uploads/2023/02/icons_Great-for-Picky-Eaters-300x300.png"
                                className="b-feature__icon"
                                alt=""
                                decoding="async"
                                loading="lazy"
                                srcSet="https://bixbipet.com/wp-content/uploads/2023/02/icons_Great-for-Picky-Eaters-300x300.png 300w, https://bixbipet.com/wp-content/uploads/2023/02/icons_Great-for-Picky-Eaters-300x300.png 150w, https://bixbipet.com/wp-content/uploads/2023/02/icons_Great-for-Picky-Eaters-300x300.png 100w, https://bixbipet.com/wp-content/uploads/2023/02/icons_Great-for-Picky-Eaters-300x300.png 500w"
                                sizes="(max-width: 300px) 100vw, 300px"
                              />
                              </div>
                              <h6 className="b-feature__title">Great for Picky Eaters</h6>
                            </div>
                          </div>

                          <div className='swiper-slide'>
                            <div className='b-feature'>
                              <div className='b-feature__icon-box'>
                              <img
                                width="300"
                                height="300"
                                src="https://bixbipet.com/wp-content/uploads/2023/02/icons_No-Added-Colors-300x300.png"
                                className="b-feature__icon"
                                alt=""
                                decoding="async"
                                loading="lazy"
                                srcSet="https://bixbipet.com/wp-content/uploads/2023/02/icons_No-Added-Colors-300x300.png 300w, https://bixbipet.com/wp-content/uploads/2023/02/icons_No-Added-Colors-300x300.png 150w, https://bixbipet.com/wp-content/uploads/2023/02/icons_No-Added-Colors-300x300.png 100w, https://bixbipet.com/wp-content/uploads/2023/02/icons_No-Added-Colors-300x300.png 500w"
                                sizes="(max-width: 300px) 100vw, 300px"
                              />
                              </div>
                              <h6 className="b-feature__title">No Added Colors</h6>
                            </div>
                          </div>

                          <div className='swiper-slide'>
                            <div className='b-feature'>
                              <div className='b-feature__icon-box'>
                              <img
                                width="300"
                                height="300"
                                src="https://bixbipet.com/wp-content/uploads/2023/02/icons_No-Artifical-Preservatives-300x300.png"
                                className="b-feature__icon"
                                alt=""
                                decoding="async"
                                loading="lazy"
                                srcSet="https://bixbipet.com/wp-content/uploads/2023/02/icons_No-Artifical-Preservatives-300x300.png 300w, https://bixbipet.com/wp-content/uploads/2023/02/icons_No-Artifical-Preservatives-300x300.png 150w, https://bixbipet.com/wp-content/uploads/2023/02/icons_No-Artifical-Preservatives-300x300.png 100w, https://bixbipet.com/wp-content/uploads/2023/02/icons_No-Artifical-Preservatives-300x300.png 500w"
                                sizes="(max-width: 300px) 100vw, 300px"
                              />
                              </div>
                              <h6 className="b-feature__title">No Artificial Preservatives</h6>
                            </div>
                          </div>

                          <div className='swiper-slide'>
                            <div className='b-feature'>
                              <div className='b-feature__icon-box'>
                              <img
                                width="300"
                                height="300"
                                src="https://bixbipet.com/wp-content/uploads/2023/02/icons_No-Meat-Meals-300x300.png"
                                className="b-feature__icon"
                                alt=""
                                decoding="async"
                                loading="lazy"
                                srcSet="https://bixbipet.com/wp-content/uploads/2023/02/icons_No-Meat-Meals-300x300.png 300w, https://bixbipet.com/wp-content/uploads/2023/02/icons_No-Meat-Meals-300x300.png 150w, https://bixbipet.com/wp-content/uploads/2023/02/icons_No-Meat-Meals-300x300.png 100w, https://bixbipet.com/wp-content/uploads/2023/02/icons_No-Meat-Meals-300x300.png 500w"
                                sizes="(max-width: 300px) 100vw, 300px"
                              />
                              </div>
                              <h6 className="b-feature__title">No Meat Meals</h6>
                            </div>
                          </div>

                          <div className='swiper-slide'>
                            <div className='b-feature'>
                              <div className='b-feature__icon-box'>
                              <img
                                width="300"
                                height="300"
                                src="https://bixbipet.com/wp-content/uploads/2023/02/icons_USA-Made-300x300.png"
                                className="b-feature__icon"
                                alt=""
                                decoding="async"
                                loading="lazy"
                                srcSet="https://bixbipet.com/wp-content/uploads/2023/02/icons_USA-Made-300x300.png 300w, https://bixbipet.com/wp-content/uploads/2023/02/icons_USA-Made-300x300.png 150w, https://bixbipet.com/wp-content/uploads/2023/02/icons_USA-Made-300x300.png 100w, https://bixbipet.com/wp-content/uploads/2023/02/icons_USA-Made-300x300.png 500w"
                                sizes="(max-width: 300px) 100vw, 300px"
                              />
                              </div>
                              <h6 className="b-feature__title">USA Made*</h6>
                            </div>
                          </div>

                          <div className='swiper-slide'>
                            <div className='b-feature'>
                              <div className='b-feature__icon-box'>
                              <img
                                width="300"
                                height="300"
                                src="https://bixbipet.com/wp-content/uploads/2023/02/icons_Grain-Free-Recipe-300x300.png"
                                className="b-feature__icon"
                                alt=""
                                decoding="async"
                                loading="lazy"
                                srcSet="https://bixbipet.com/wp-content/uploads/2023/02/icons_Grain-Free-Recipe-300x300.png 300w, https://bixbipet.com/wp-content/uploads/2023/02/icons_Grain-Free-Recipe-300x300.png 150w, https://bixbipet.com/wp-content/uploads/2023/02/icons_Grain-Free-Recipe-300x300.png 100w, https://bixbipet.com/wp-content/uploads/2023/02/icons_Grain-Free-Recipe-300x300.png 500w"
                                sizes="(max-width: 300px) 100vw, 300px"
                              />
                              </div>
                              <h6 className="b-feature__title">Grain Free Recipe†</h6>
                            </div>
                          </div>

                          <div className='swiper-slide'>
                            <div className='b-feature'>
                              <div className='b-feature__icon-box'>
                              <img
                                width="300"
                                height="300"
                                src="https://bixbipet.com/wp-content/uploads/2023/02/icons_Great-for-Picky-Eaters-300x300.png"
                                className="b-feature__icon"
                                alt=""
                                decoding="async"
                                loading="lazy"
                                srcSet="https://bixbipet.com/wp-content/uploads/2023/02/icons_Great-for-Picky-Eaters-300x300.png 300w, https://bixbipet.com/wp-content/uploads/2023/02/icons_Great-for-Picky-Eaters-300x300.png 150w, https://bixbipet.com/wp-content/uploads/2023/02/icons_Great-for-Picky-Eaters-300x300.png 100w, https://bixbipet.com/wp-content/uploads/2023/02/icons_Great-for-Picky-Eaters-300x300.png 500w"
                                sizes="(max-width: 300px) 100vw, 300px"
                              />
                              </div>
                              <h6 className="b-feature__title">Great for Picky Eaters</h6>
                            </div>
                          </div>

                          <div className='swiper-slide'>
                            <div className='b-feature'>
                              <div className='b-feature__icon-box'>
                              <img
                                width="300"
                                height="300"
                                src="https://bixbipet.com/wp-content/uploads/2023/02/icons_No-Added-Colors-300x300.png"
                                className="b-feature__icon"
                                alt=""
                                decoding="async"
                                loading="lazy"
                                srcSet="https://bixbipet.com/wp-content/uploads/2023/02/icons_No-Added-Colors-300x300.png 300w, https://bixbipet.com/wp-content/uploads/2023/02/icons_No-Added-Colors-300x300.png 150w, https://bixbipet.com/wp-content/uploads/2023/02/icons_No-Added-Colors-300x300.png 100w, https://bixbipet.com/wp-content/uploads/2023/02/icons_No-Added-Colors-300x300.png 500w"
                                sizes="(max-width: 300px) 100vw, 300px"
                              />
                              </div>
                              <h6 className="b-feature__title">No Added Colors</h6>
                            </div>
                          </div>

                          <div className='swiper-slide'>
                            <div className='b-feature'>
                              <div className='b-feature__icon-box'>
                              <img
                                width="300"
                                height="300"
                                src="https://bixbipet.com/wp-content/uploads/2023/02/icons_No-Artifical-Preservatives-300x300.png"
                                className="b-feature__icon"
                                alt=""
                                decoding="async"
                                loading="lazy"
                                srcSet="https://bixbipet.com/wp-content/uploads/2023/02/icons_No-Artifical-Preservatives-300x300.png 300w, https://bixbipet.com/wp-content/uploads/2023/02/icons_No-Artifical-Preservatives-300x300.png 150w, https://bixbipet.com/wp-content/uploads/2023/02/icons_No-Artifical-Preservatives-300x300.png 100w, https://bixbipet.com/wp-content/uploads/2023/02/icons_No-Artifical-Preservatives-300x300.png 500w"
                                sizes="(max-width: 300px) 100vw, 300px"
                              />
                              </div>
                              <h6 className="b-feature__title">No Artificial Preservatives</h6>
                            </div>
                          </div>

                          <div className='swiper-slide'>
                            <div className='b-feature'>
                              <div className='b-feature__icon-box'>
                              <img
                                width="300"
                                height="300"
                                src="https://bixbipet.com/wp-content/uploads/2023/02/icons_No-Meat-Meals-300x300.png"
                                className="b-feature__icon"
                                alt=""
                                decoding="async"
                                loading="lazy"
                                srcSet="https://bixbipet.com/wp-content/uploads/2023/02/icons_No-Meat-Meals-300x300.png 300w, https://bixbipet.com/wp-content/uploads/2023/02/icons_No-Meat-Meals-300x300.png 150w, https://bixbipet.com/wp-content/uploads/2023/02/icons_No-Meat-Meals-300x300.png 100w, https://bixbipet.com/wp-content/uploads/2023/02/icons_No-Meat-Meals-300x300.png 500w"
                                sizes="(max-width: 300px) 100vw, 300px"
                              />
                              </div>
                              <h6 className="b-feature__title">No Meat Meals</h6>
                            </div>
                          </div>

                          <div className='swiper-slide'>
                            <div className='b-feature'>
                              <div className='b-feature__icon-box'>
                              <img
                                width="300"
                                height="300"
                                src="https://bixbipet.com/wp-content/uploads/2023/02/icons_USA-Made-300x300.png"
                                className="b-feature__icon"
                                alt=""
                                decoding="async"
                                loading="lazy"
                                srcSet="https://bixbipet.com/wp-content/uploads/2023/02/icons_USA-Made-300x300.png 300w, https://bixbipet.com/wp-content/uploads/2023/02/icons_USA-Made-300x300.png 150w, https://bixbipet.com/wp-content/uploads/2023/02/icons_USA-Made-300x300.png 100w, https://bixbipet.com/wp-content/uploads/2023/02/icons_USA-Made-300x300.png 500w"
                                sizes="(max-width: 300px) 100vw, 300px"
                              />
                              </div>
                              <h6 className="b-feature__title">USA Made*</h6>
                            </div>
                          </div>

                        </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>

      <section className='bde-section-145096-168 bde-section'>
      <div className="flex justify-center items-center flex-row flex-nowrap gap-x-7 mt-[72px]">
      <div>
        <img
          src={assets.content_6}
          alt=""
          className="w-[624px] h-[604.450px]"
        />
      </div>

      <div className="leading-6 mt-[30px]">
        <h6 className="text-[20px] font-normal">FPet delivered</h6>
        <h2 className="text-[42px] font-bold m-0">Subscribe & Save 10%</h2>
        <div className="max-w-full text-[18px] font-normal">
          What’s better than FPet food, treats, and supplements? Getting FPET{" "}
          <br />
          food, treats, and supplements automatically delivered to your front{" "}
          <br />
          door with a bunch of other awesome benefits:
        </div>
        <div className="max-w-full flex  text-left mt-4 font-semibold tracking-[-0.52px] ">
          <ul className="flex flex-col p-0 text-[26px] gap-y-[20px] ">
            <li className="">
              <div className="flex items-center gap-[14px]">
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="33.601"
                    height="24"
                    viewBox="0 0 33.601 24">
                    <path
                      id="check"
                      d="M32.9,96.714a2.4,2.4,0,0,1,0,3.39l-19.2,19.2a2.4,2.4,0,0,1-3.39,0l-9.6-9.6a2.4,2.4,0,0,1,3.395-3.39l7.836,7.9,17.574-17.5a2.392,2.392,0,0,1,3.39,0Z"
                      transform="translate(0 -96.01)"
                      fill="#24b1ac"></path>
                  </svg>
                </span>
                <span className="">Easy to manage delivery dates</span>
              </div>
            </li>
            <li>
              <div className="flex items-center gap-[14px]">
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="33.601"
                    height="24"
                    viewBox="0 0 33.601 24">
                    <path
                      id="check"
                      d="M32.9,96.714a2.4,2.4,0,0,1,0,3.39l-19.2,19.2a2.4,2.4,0,0,1-3.39,0l-9.6-9.6a2.4,2.4,0,0,1,3.395-3.39l7.836,7.9,17.574-17.5a2.392,2.392,0,0,1,3.39,0Z"
                      transform="translate(0 -96.01)"
                      fill="#24b1ac"></path>
                  </svg>
                </span>
                <span className="">Priority shipping</span>
              </div>
            </li>
            <li>
              <div className="flex items-center gap-[14px]">
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="33.601"
                    height="24"
                    viewBox="0 0 33.601 24">
                    <path
                      id="check"
                      d="M32.9,96.714a2.4,2.4,0,0,1,0,3.39l-19.2,19.2a2.4,2.4,0,0,1-3.39,0l-9.6-9.6a2.4,2.4,0,0,1,3.395-3.39l7.836,7.9,17.574-17.5a2.392,2.392,0,0,1,3.39,0Z"
                      transform="translate(0 -96.01)"
                      fill="#24b1ac"></path>
                  </svg>
                </span>
                <span className="">Guaranteed in-stock</span>
              </div>
            </li>
            <li>
              <div className="flex items-center gap-[14px]">
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="33.601"
                    height="24"
                    viewBox="0 0 33.601 24">
                    <path
                      id="check"
                      d="M32.9,96.714a2.4,2.4,0,0,1,0,3.39l-19.2,19.2a2.4,2.4,0,0,1-3.39,0l-9.6-9.6a2.4,2.4,0,0,1,3.395-3.39l7.836,7.9,17.574-17.5a2.392,2.392,0,0,1,3.39,0Z"
                      transform="translate(0 -96.01)"
                      fill="#24b1ac"></path>
                  </svg>
                </span>
                <span className="">10% off all products</span>
              </div>
            </li>
            <li>
              <div className="flex items-center gap-[14px]">
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="33.601"
                    height="24"
                    viewBox="0 0 33.601 24">
                    <path
                      id="check"
                      d="M32.9,96.714a2.4,2.4,0,0,1,0,3.39l-19.2,19.2a2.4,2.4,0,0,1-3.39,0l-9.6-9.6a2.4,2.4,0,0,1,3.395-3.39l7.836,7.9,17.574-17.5a2.392,2.392,0,0,1,3.39,0Z"
                      transform="translate(0 -96.01)"
                      fill="#24b1ac"></path>
                  </svg>
                </span>
                <span className="">Free bonus products</span>
              </div>
            </li>
            <li>
              <div className="flex items-center gap-[14px]">
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="33.601"
                    height="24"
                    viewBox="0 0 33.601 24">
                    <path
                      id="check"
                      d="M32.9,96.714a2.4,2.4,0,0,1,0,3.39l-19.2,19.2a2.4,2.4,0,0,1-3.39,0l-9.6-9.6a2.4,2.4,0,0,1,3.395-3.39l7.836,7.9,17.574-17.5a2.392,2.392,0,0,1,3.39,0Z"
                      transform="translate(0 -96.01)"
                      fill="#24b1ac"></path>
                  </svg>
                </span>
                <span className="">
                  A great reason to get excited when the doorbell rings
                </span>
              </div>
            </li>
          </ul>
        </div>
        <div className="mt-10">
          <button className="border rounded-full bg-black text-white  py-2.5 px-8">
            <a href="">Learn More</a>
          </button>
        </div>
      </div>
    </div>
      </section>
      </div>
      <div className='related-product'>
        <RelatedProduct/>
      </div>
    </div>  
      
    
  );
};

export default ProductDisplay;
