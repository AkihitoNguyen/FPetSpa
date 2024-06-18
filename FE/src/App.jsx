// eslint-disable-next-line no-unused-vars
import React from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Cart from "./pages/Cart/Cart";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder";
import Home from "./pages/Home/Home";
import Footer from "./components/Footer/Footer";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Product from "./pages/Product/Product";
import ProductDisplay from "./components/ProductDisplay/ProductDisplay";
import ConfirmEmail from "./pages/ConfirmEmail/ConfirmEmail";
import CheckEmail from "./pages/CheckEmail/CheckEmail";
import "react-toastify/dist/ReactToastify.css";

import Service from "./pages/Service/Service";
import ContactUs from "./pages/ContactUs/ContactUs";
import AboutUs from "./pages/AboutUs/AboutUs";
import Navlink from "./components/Navlink/Navlink";
import BookingService from "./pages/Service/BookingService";
import Modal from "./components/Modal/Modal"

const App = () => {
  return (
      <>
        <div className="app">
          <Navlink />
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/service" element={<Service />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/order" element={<PlaceOrder />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/product" element={<Product />} />
            <Route path="/booking" element = {<BookingService/>}/>
            <Route path="/modal" element={<Modal />}/>
            <Route
              path="/productdisplay/:productName"
              element={<ProductDisplay />}
            />
            <Route path="/confirm-email" element={<ConfirmEmail />} />
            <Route path="/check-email" element={<CheckEmail />} />
          </Routes>
        </div>
        <div className="bg-gray-700">
        <Footer />
        </div>
      </>
  );
};

export default App;
