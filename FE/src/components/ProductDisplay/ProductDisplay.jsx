import React, { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ShopContext } from '../Context/ShopContext';
import { getProductById } from '../../api/apiService';
import { StarIcon } from '@heroicons/react/20/solid';
import 'react-toastify/dist/ReactToastify.css';
import { assets } from '../../assets/assets';
import '../ProductDisplay/ProductDisplay.css';
import RelatedProduct from '../../components/RelatedProducts/RelatedProduct';

const ProductDisplay = () => {
  const { productId } = useParams();
  const { addToCart } = useContext(ShopContext);
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [comments, setComments] = useState([]);
  const [commentName, setCommentName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [users, setUsers] = useState([]);
  const [commentStar, setCommentStar] = useState(5); // State for star rating
  const user = useSelector((state) => state.auth.login?.currentUser);

  const handleSubmitComment = async (e) => {
    e.preventDefault();

    const newComment = {
      userFeedBackId: user.userId,
      productId: productId,
      pictureName: '', // Add picture URL if needed
      star: commentStar, // Use the selected star rating
      description: commentText,
    };

    try {
      const response = await fetch('https://localhost:7055/api/FeedBack/Create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.accessToken}`
        },
        body: JSON.stringify(newComment),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      setComments([...comments, result]);
      setCommentName('');
      setCommentText('');
      setCommentStar(5); // Reset star rating
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

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
        
      }
    } catch (error) {
      console.error("Error fetching product:", error);
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
    } catch (error) {
      console.error("Error fetching comments:", error);
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
    } catch (error) {
      console.error("Error fetching users:", error);
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
    <div className="bg-white">
      <div className="pt-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 lg:py-16">
          <div className="lg:grid lg:grid-cols-3 lg:gap-x-8">
            <div className="lg:col-span-2">
              <div className="aspect-w-4 aspect-h-5 sm:overflow-hidden sm:rounded-lg">
                <img
                  src={product.pictureName}
                  alt={product.productName}
                  className="h-full w-3/4 object-cover object-center"
                />
              </div>
            </div>

            <div className="mt-4 ml-8 lg:mt-0 lg:col-span-1 lg:border-l lg:border-gray-200 lg:pl-8">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{product.productName}</h1>
              <p className="mt-4 text-3xl tracking-tight text-gray-900">${product.price}</p>

              <div className="mt-10">
                <div className="lg:pr-8">
                  <div>
                    <h3 className="sr-only">Description</h3>
                    <div className="space-y-6">
                      <p className="text-base text-gray-900">{product.productDescription}</p>
                    </div>
                  </div>
                  <div className="mt-10">
                    <div className="mt-4 space-y-6">
                      <p className="text-sm text-gray-600">{product.productDetails}</p>
                    </div>
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
                className="mt-10 flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                onClick={handleAddToCart}
              >
                Add to cart
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 lg:mt-16 lg:grid lg:grid-cols-3 lg:gap-x-8">
          <div className="lg:col-span-3">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Product Comments</h2>
            <div className="mt-6 space-y-8">
              {comments.map((comment) => (
                <div key={comment.id} className="border-b border-gray-200 pb-8">
                  <div className="flex space-x-4">
                    <div>
                      <img className="h-10 w-10 rounded-full" src={comment.pictureName || 'https://via.placeholder.com/150'} alt="User" />
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

            {/* Comment Submission Form */}
            <div className="mt-8 bg-gray-100 p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-medium text-gray-900">Leave a Comment</h3>
              {user ? (
                <form onSubmit={handleSubmitComment} className="mt-4 space-y-4">
                  <div>
                    <label htmlFor="commentText" className="block text-sm font-medium text-gray-700">Comment</label>
                    <textarea
                      id="commentText"
                      name="commentText"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      rows="4"
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition duration-200"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Rating</label>
                    <div className="flex space-x-1 mt-1">
                      {renderStarRating()}
                    </div>
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >Submit</button>
                  </div>
                </form>
              ) : (
                <div className="mt-4 text-sm text-gray-600">
                  Please <a href="/login" className="text-indigo-600 hover:text-indigo-500">login</a> to leave a comment.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className='related-product'>
        <RelatedProduct />
      </div>
    </div>
  );
};

export default ProductDisplay;