// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Breadcrumb from './components/Breadcrum/Breadcrum';  // Import Breadcrumb
import Cart from './pages/Cart/Cart';
import PlaceOrder from './pages/PlaceOrder/PlaceOrder';
import Home from './pages/Home/Home';
import Footer from './components/Footer/Footer';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Product from './pages/Product/Product';
import ProductDisplay from './components/ProductDisplay/ProductDisplay';
import ConfirmEmail from './pages/ConfirmEmail/ConfirmEmail';
import CheckEmail from './pages/CheckEmail/CheckEmail';
import Checkout from './components/Checkout/Checkout';
import 'react-toastify/dist/ReactToastify.css';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import Search from './components/PageProduct/Search';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'

const App = () => {
  return (
    <PayPalScriptProvider options={{ "client-id": "Acu-Lmk731qYDK8sCNwvcy77bP49dVd0VvuNFByVU41LL3m3mdKn8GrSIfGj8H7s-XGHSP-_wg5zmUzs" }}>
      <>
        <div className='app'>
          <Navbar />
          <Breadcrumb /> {/* Add Breadcrumb here */}
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/cart' element={<Cart />} />
            <Route path='/order' element={<PlaceOrder />} />
            <Route path='/login' element={<Login />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path='/register' element={<Register />} />
            <Route path='/product' element={<Product />} />
            <Route path='/search' element={<Search/>}/>
            <Route path='/productdisplay/:productName' element={<ProductDisplay />} />
            <Route path='/confirm-email' element={<ConfirmEmail />} />
            <Route path='/check-email' element={<CheckEmail />} />
          </Routes>
        </div>
        <Footer />
      </>
    </PayPalScriptProvider>
  );
};

export default App;
