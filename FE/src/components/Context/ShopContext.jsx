import axios from 'axios';
import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux'; // Import useSelector từ react-redux
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getProductById } from '../../api/apiService'; // Giả sử hàm này lấy chi tiết sản phẩm bằng ID


export const ShopContext = createContext(null);

const ShopContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isLoggedIn = useSelector((state) => state.auth.login?.currentUser); // Lấy trạng thái isLoggedIn từ Redux

  // State để lưu trữ userId
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Thiết lập userId nếu người dùng đã đăng nhập
    if (isLoggedIn) {
      setUserId(isLoggedIn.userId);
    }
    
    fetchProducts();
    loadCartItemsFromStorage();
  }, [isLoggedIn]); // Theo dõi sự thay đổi trong isLoggedIn

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const fetchProducts = async () => {
    try {
      const productList = await getProductById();
      setProducts(productList);
      setLoading(false);
    } catch (error) {
      setError(error.message || 'Lỗi khi tải danh sách sản phẩm');
      setLoading(false);
    }
  };

  const loadCartItemsFromStorage = () => {
    const storedCartItems = localStorage.getItem('cartItems');
    if (storedCartItems) {
      setCartItems(JSON.parse(storedCartItems));
    }
  };

  const addToCart = async (productId, quantity) => {
    try {
      if (!userId) {
        throw new Error('Người dùng chưa đăng nhập.');
      }
  
      const response = await axios.post(`https://fpetspa.azurewebsites.net/api/Cart/AddtoCart`, {
        userId: userId,
        productId: productId,
        quantity: quantity
      });
  
      console.log('Phản hồi từ việc thêm vào giỏ hàng:', response);
  
      const updatedCartItems = { ...cartItems };
      if (updatedCartItems[productId]) {
        updatedCartItems[productId] += quantity;
      } else {
        updatedCartItems[productId] = quantity;
      }
      setCartItems(updatedCartItems);
      toast.success('Sản phẩm được thêm vào giỏ hàng thành công!');
    } catch (error) {
      handleCartError(error);
    }
  };

  const handleCartError = (error) => {
    if (error.response) {
      console.error('Lỗi khi thêm vào giỏ hàng - Lỗi máy chủ:', error.response.data);
      toast.error('Không thêm được sản phẩm vào giỏ hàng. Vui lòng thử lại.');
    } else if (error.request) {
      console.error('Lỗi khi thêm vào giỏ hàng - Không nhận được phản hồi:', error.request);
      toast.error('Không có phản hồi từ máy chủ. Vui lòng kiểm tra kết nối mạng.');
    } else {
      console.error('Lỗi khi thêm vào giỏ hàng - Lỗi thiết lập yêu cầu:', error.message);
      toast.error('Đã xảy ra lỗi không mong muốn. Vui lòng thử lại sau.');
    }
  };

  const removeFromCart = (productId) => {
    if (cartItems[productId] > 0) {
      const updatedCartItems = { ...cartItems };
      updatedCartItems[productId] -= 1;
      if (updatedCartItems[productId] === 0) {
        delete updatedCartItems[productId];
      }
      setCartItems(updatedCartItems);
      toast.success('Sản phẩm đã được xóa khỏi giỏ hàng thành công!');
    } else {
      toast.error('Không có sản phẩm này trong giỏ hàng để xóa.');
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

  const contextValue = {
    getTotalCartItems,
    getTotalCartAmount,
    products,
    cartItems,
    addToCart,
    removeFromCart,
    loading,
    error,
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
