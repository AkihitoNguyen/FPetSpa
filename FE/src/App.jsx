// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Cart from './pages/Cart/Cart';
import PlaceOrder from './pages/PlaceOrder/PlaceOrder';
import Home from './pages/Home/Home';
import Footer from './components/Footer/Footer';
import Login from './pages/Login/Login';
import ProductDisplay from './components/ProductDisplay/ProductDisplay';

import ProductList from './components/PageProduct/ProductList';
import Register from './pages/Register/Register';

const App = () => {
  return (
    <>
      <div className='app'>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/order' element={<PlaceOrder />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/logout' element={<Register />} />
          <Route path='/product' element={<ProductList />} /> {/* Thêm tuyến đường cho SearchProduct */}
          <Route path="/productdisplay/:productName" element={<ProductDisplay />} /> {/* Sử dụng `element` thay vì `component` */}
        </Routes>
      </div>
      <Footer />
    </>
  );
};

export default App;