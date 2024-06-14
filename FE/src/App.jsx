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
import Checkout from "./components/Checkout/Checkout";
import "react-toastify/dist/ReactToastify.css";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import Search from "./components/PageProduct/Search";
import Service from "./pages/Service/Service";
import ContactUs from "./pages/ContactUs/ContactUs";
import AboutUs from "./pages/AboutUs/AboutUs";
import Navlink from "./components/Navlink/Navlink";
import BookingService from "./pages/Service/BookingService";
const App = () => {
  return (
    <PayPalScriptProvider
      options={{
        "client-id":
          "Acu-Lmk731qYDK8sCNwvcy77bP49dVd0VvuNFByVU41LL3m3mdKn8GrSIfGj8H7s-XGHSP-_wg5zmUzs",
      }}>
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
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/register" element={<Register />} />
            <Route path="/product" element={<Product />} />
            <Route path="/search" element={<Search />} />
            <Route path="/booking" element={<BookingService />} />
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
    </PayPalScriptProvider>
  );
};

export default App;
