import axios from 'axios';
import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const ShopContext = createContext(null);

const ShopContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const isLoggedIn = useSelector((state) => state.auth.login?.currentUser);
  const [userId, setUserId] = useState(null);
  const [cartId, setCartId] = useState(null);

  useEffect(() => {
    if (isLoggedIn) {
      setUserId(isLoggedIn.userId);
      fetchCartId(isLoggedIn.userId);
      fetchProducts(); // Fetch products initially
    } else {
      setCartItems({});
      setCartId(null);
    }
  }, [isLoggedIn]);

  const fetchCartId = async (userId) => {
    try {
      const response = await axios.get(`https://fpetspa.azurewebsites.net/api/CartDetail/Getbyid`, {
        params: { userId: userId }
      });

      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        const firstCartItem = response.data[0]; // Giả sử tất cả các mục trong mảng có cùng cartId
        const fetchedCartId = firstCartItem.cartId;

        // Tạo đối tượng cartItems từ dữ liệu API
        const cartItemsFromAPI = {};
        response.data.forEach(item => {
          cartItemsFromAPI[item.productId] = item.quantity;
        });
        setCartItems(cartItemsFromAPI);
        setCartId(fetchedCartId)
      } else {
        console.error('No cart details found for the user.');
      }
    } catch (error) {
      console.error('Error fetching cartId:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get('https://fpetspa.azurewebsites.net/api/products?pageSize=100'); // Adjust the API endpoint as needed
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const addToCart = async (productId, quantity) => {
    try {
      const updatedCartItems = { ...cartItems };

      if (updatedCartItems[productId]) {
        updatedCartItems[productId] += quantity;
      } else {
        updatedCartItems[productId] = quantity;
      }

      setCartItems(updatedCartItems); // Update cartItems immediately
      if (isLoggedIn) {
        const response = await axios.post(`https://fpetspa.azurewebsites.net/api/Cart/AddtoCart`, {
          userId: userId,
          productId: productId,
          quantity: quantity
        });
        if (response.data) {
          setCartId(response.data);
          fetchProducts(); // Fetch products after adding to cart
        }
      }

      toast.success('Product added to cart successfully!');
    } catch (error) {
      handleCartError(error);
    }
  };

  const removeFromCart = async (productIdToRemove) => {
    try {
      if (!contextValue.cartId) {
        throw new Error('Cart ID is missing.');
      }
  
      if (cartItems[productIdToRemove] > 0) {
        const updatedCartItems = { ...cartItems };
        updatedCartItems[productIdToRemove] = 0;
        delete updatedCartItems[productIdToRemove];
        setCartItems(updatedCartItems); // Update cartItems immediately
  
        try {
          const response = await axios.delete(`https://fpetspa.azurewebsites.net/api/CartDetail/Delete`, {
            params: { cartId: contextValue.cartId, productId: productIdToRemove }
          });
          console.log('Response from deleting cart detail:', response);
       
        } catch (error) {
          console.error('Error deleting cart detail:', error);
          toast.error('Failed to delete cart detail. Please try again.');
        }
  
        toast.success('Product removed from cart successfully!');
      } else {
        toast.error('This product is not in the cart to remove.');
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('Failed to remove product from cart. Please try again.');
    }
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
    return parseFloat(totalAmount.toFixed(2));
  };

  const getTotalCartItems = () => {
    let totalItems = 0;
    for (const itemId in cartItems) {
      if (cartItems[itemId] > 0) {
        totalItems += cartItems[itemId];
      }
    }
    return totalItems;
  };

  const handleCartError = (error) => {
    if (error.response) {
      console.error('Error adding/removing to/from cart - Server error:', error.response.data);
      toast.error('Failed to update cart. Please try again.');
    } else if (error.request) {
      console.error('Error adding/removing to/from cart - No response received:', error.request);
      toast.error('No response from server. Please check your network connection.');
    } else {
      console.error('Error adding/removing to/from cart - Request setup error:', error.message);
      toast.error('An unexpected error occurred. Please try again later.');
    }
  };

  const contextValue = {
    getTotalCartItems,
    getTotalCartAmount,
    products,
    cartItems,
    addToCart,
    removeFromCart,
    cartId,
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
