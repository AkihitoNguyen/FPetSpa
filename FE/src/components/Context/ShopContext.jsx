import { createContext, useState, useEffect } from "react";
import { getProductById } from '../../api/apiService';
import PropTypes from 'prop-types';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';

export const ShopContext = createContext(null);

const ShopContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const storedCartItems = localStorage.getItem('cartItems');
    if (storedCartItems) {
      setCartItems(JSON.parse(storedCartItems));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const fetchProducts = async () => {
    try {
      const productList = await getProductById(); // Adjust this call based on your API
      setProducts(productList);
      setLoading(false);
    } catch (error) {
      setError(error.message || 'Error fetching products');
      setLoading(false);
    }
  };

  const addToCart = (productId, quantity) => {
    const newCartItems = { ...cartItems };
    if (newCartItems[productId]) {
      newCartItems[productId] += quantity;
    } else {
      newCartItems[productId] = quantity;
    }
    setCartItems(newCartItems);
    toast.success('Product added to cart successfully!');
  };

  const removeFromCart = (itemId) => {
    if (cartItems[itemId] > 0) {
      const newCartItems = { ...cartItems, [itemId]: cartItems[itemId] - 1 };
      setCartItems(newCartItems);
    }
    toast.success('Item removed from cart successfully!');
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
  
    for (const itemId in cartItems) {
      if (cartItems[itemId] > 0) {
        const itemInfo = products.find((product) => product.productId === itemId);
  
        if (itemInfo) {
          totalAmount += itemInfo.price * cartItems[itemId];
        }
      }
    }
    return totalAmount;
  };

  const getTotalCartItems = () => {
    let totalItem = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        totalItem += cartItems[item];
      }
    }
    return totalItem;
  };

  const contextValue = {
    getTotalCartItems,
    getTotalCartAmount,
    products,
    cartItems,
    addToCart,
    removeFromCart,
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
