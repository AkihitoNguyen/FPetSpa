import React, { useContext, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ShopContext } from '../Context/ShopContext';
import { getProductById } from '../../api/apiService';
import { StarIcon } from '@heroicons/react/20/solid';
import 'react-toastify/dist/ReactToastify.css';
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import '../ProductDisplay/ProductDisplay.css';
import { assets } from '../../assets/assets';
import Loading from '../Loading';

const ProductDisplay = () => {
  const { productId } = useParams();
  const { addToCart } = useContext(ShopContext);
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [comments, setComments] = useState([]);
  const [users, setUsers] = useState([]);
  const [commentStar, setCommentStar] = useState(5);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);




  useEffect(() => {
    fetchProduct();
    fetchComments(productId);
    fetchUsers();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const response = await getProductById({ productId });
      if (response) {
        setProduct(response);
        fetchRelatedProducts(response.categoryName); // Fetch related products by category
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      setIsLoading(false);
    }
  };

  const fetchComments = async (productId) => {
    try {
      const response = await fetch(`https://localhost:7055/api/FeedBack/productId?productId=${productId}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setComments(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching comments:", error);
      setIsLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('https://localhost:7055/api/account/getAllCustomer');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setUsers(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setIsLoading(false);
    }
  };

  const fetchRelatedProducts = async (categoryName) => {
    try {
      const response = await fetch(`https://localhost:7055/api/products?pageSize=100&categoryName=${categoryName}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setRelatedProducts(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching related products:", error);
      setIsLoading(false);
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

  function stringToColor(string) {
    let hash = 0;
    let i;
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = "#";
    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    return color;
  }

  function stringAvatar(name) {
    if (!name || typeof name !== "string") {
      return {
        sx: {
          bgcolor: "#000000",
        },
        children: "",
      };
    }

    const nameParts = name.split(" ");
    if (nameParts.length < 2) {
      return {
        sx: {
          bgcolor: stringToColor(name),
        },
        children: name.charAt(0),
      };
    }

    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: `${nameParts[0][0]}${nameParts[1][0]}`,
    };
  }

  const renderStars = (rating) => {
    const stars = [];
    const totalStars = rating ?? 5; // Default to 5 stars if no rating
    for (let i = 0; i < totalStars; i++) {
      stars.push(
        <StarIcon key={i} className="h-5 w-5 text-yellow-400" />
      );
    }
    return stars;
  };

  const getUserName = (userId) => {
    const user = users.find((user) => user.id === userId);
    return user ? user.fullName : 'Anonymous';
  };

  const handleStarClick = (rating) => {
    setCommentStar(rating);
  };

  const renderStarRating = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <StarIcon
          key={i}
          className={`h-5 w-5 cursor-pointer ${i <= commentStar ? 'text-yellow-400' : 'text-gray-300'}`}
          onClick={() => handleStarClick(i)}
        />
      );
    }
    return stars;
  };


  return (
    <div>

    
    {isLoading ? (
      <Loading />
    ) : (
    <div className="bg-white">
    
        <div className="pt-6">
        
        {/* Image gallery */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 lg:py-16">
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
          <div className="aspect-w-4 aspect-h-5 sm:overflow-hidden sm:rounded-lg">
            <img
              src={product.pictureName}
              alt={product.productName}
              className="h-full w-full object-cover object-center"
            />
          </div>

          <div className="mt-4 lg:mt-0 lg:border-l lg:border-gray-200 lg:pl-8">
            <div className='bg-pink-50 rounded p-7'>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{product.productName}</h1>
            <p className="mt-4 text-3xl tracking-tight text-gray-900">${product.price}</p>

            <div className="mt-10">
              <div>
                <h3 className="sr-only">Description</h3>
                <div className="space-y-6">
                  <p className="text-base text-gray-900">{product.productDescription}</p>
                </div>
              </div>
              <div className="mt-10">
                <div className="space-y-6">
                  <p className="text-sm text-gray-600">{product.productDetails}</p>
                </div>
              </div>
            </div>

            <div className="mt-6">
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

            <div className="mt-6">
              <div className="flex items-center space-x-2">
                <button onClick={handleDecreaseQuantity} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-200 transition duration-200">-</button>
                <span className="text-lg font-medium text-gray-900">{quantity}</span>
                <button onClick={handleIncreaseQuantity} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-200 transition duration-200">+</button>
              </div>
            </div>

            <button
              className="mt-10 flex items-center justify-center border border-transparent bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded-full animate-pulse"
              onClick={handleAddToCart}
            >
              Add to cart
            </button>
            </div>
          </div>
        </div>
      </div>

        <div className="mt-12 lg:mt-16 lg:grid lg:grid-cols-3 lg:gap-x-8 ml-28 mr-20">
          <div className="lg:col-span-3">
            
            <div className="bg-white rounded-3xl shadow-md p-6 mb-4 overflow-auto mt-6 space-y-8  ">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Product Comments</h2>
              {comments.map((comment) => (
                <div key={comment.id} className="border-b border-gray-200 pb-8">
                  <div className="flex space-x-4">
                  <div>
                      <Stack direction="row" spacing={2}>
                          <Avatar {...stringAvatar(getUserName(comment.userFeedBackId))} />
                      </Stack>
                  </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{getUserName(comment.userFeedBackId)}</h3>
                      <div className="flex items-center">
                        {renderStars(comment.star)}
                      </div>
                      <p className="mt-4 text-base text-gray-900">{comment.description}</p>
                    </div>
                  </div>
                </div>
              ))}
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

        {/* Related products */}
        <div className='related-product bg-white'>
              <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
                <h2 className="text-center text-2xl font-bold tracking-tight text-gray-900 mb-6">Customers also purchased</h2>
                <div className="flex justify-center space-x-6 ">
                  {relatedProducts.slice(0, 4).map((product) => (
                    <div key={product.productId} className="w-60 h-96 bg-pink-100 rounded-3xl text-neutral-300 p-4 flex flex-col items-start justify-center gap-3 hover:bg-gray-900 hover:shadow-2xl hover:shadow-sky-400 transition-shadow">
                      <div className="aspect-w-1 aspect-h-1 rounded-md overflow-hidden bg-gray-200 lg:aspect-none group">
                        <Link to={`/productdisplay/${product.productId}`}>
                          <img
                            src={product.pictureName}
                            alt={product.productName}
                            className="object-cover object-center w-52 h-56 bg-sky-300 rounded-2xl"
                          />
                        </Link>
                      </div>
                      <div className="mt-4 flex justify-between">
                      <h4 className="font-bold text-gray-800">{product.productName}</h4>
                      </div>
                      <p className="text-sm font-medium text-gray-900">${product.price}</p> 
                    </div>
                  ))}
                </div>
              </div>
           </div>


      </div>
      
     
    </div>
    )}
    </div>
  );
};

export default ProductDisplay;
