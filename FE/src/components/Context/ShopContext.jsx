// ShopContextProvider.js
// eslint-disable-next-line no-unused-vars
import React, { createContext, useState, useEffect } from "react";
import { getProductById } from '../../api/apiService';
import PropTypes from 'prop-types';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { addToCartAsync, removeFromCartAsync, setCartItems } from '../../redux/cartSlice';

// Create the ShopContext
export const ShopContext = createContext(null);

const ShopContextProvider = (props) => {
  // State for products, loading status, and error handling
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Redux dispatch and selector for cart items
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);

  // Fetch products when the component mounts
  useEffect(() => {
    fetchProducts();
  }, []);

  // Load cart items from localStorage when the component mounts
  useEffect(() => {
    const storedCartItems = localStorage.getItem('cartItems');
    if (storedCartItems) {
      dispatch(setCartItems(JSON.parse(storedCartItems)));
    }
  }, [dispatch]);

  // Save cart items to localStorage whenever cartItems changes
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // Fetch products from the API
  const fetchProducts = async () => {
    try {
      const productsList = await getProductById();
      setProducts(productsList);
      setLoading(false);
    } catch (error) {
      setError(error.message || 'Error fetching products');
      setLoading(false);
    }
  };

  // Handle adding items to the cart
  const handleAddToCart = (productId, quantity) => {
    dispatch(addToCartAsync({ productId, quantity }));
    toast.success('Product added to cart successfully!');
  };

  // Handle removing items from the cart
  const handleRemoveFromCart = (productId) => {
    dispatch(removeFromCartAsync({ productId }));
    toast.success('Item removed from cart successfully!');
  };

  // Calculate the total amount in the cart
  const getTotalCartAmount = () => {
    if (products.length === 0) {
      return 0;
    }

    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        const itemInfo = products.find((product) => product.productId === Number(item));
        if (itemInfo) {
          totalAmount += itemInfo.price * cartItems[item];
        }
      }
    }
    return totalAmount;
  };

  // Calculate the total number of items in the cart
  const getTotalCartItems = () => {
    let totalItem = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        totalItem += cartItems[item];
      }
    }
    return totalItem;
  };

  // Context value to be provided to children components
  const contextValue = {
    getTotalCartItems,
    getTotalCartAmount,
    products,
    cartItems,
    addToCart: handleAddToCart,
    removeFromCart: handleRemoveFromCart,
    loading,
    error
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

ShopContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ShopContextProvider;
