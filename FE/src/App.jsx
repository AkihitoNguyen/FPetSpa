// App.jsx
import React, { useState, useEffect } from "react";
import "./App.css";
import { Route, Routes, useLocation } from "react-router-dom";
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
import Profile from "./pages/Profile/Profile";
import DashBoard from "./pages/DashBoard/DashBoard";
import BookingHistory from "./components/Profile/BookingHistory";
import GetService from "./components/DashBoard/ServiceManagement.jsx/GetService";
import AddOrder from "./components/DashBoard/ServiceManagement.jsx/AddOrder";
import Layout from "./components/Layout";
import User from "./components/DashBoard/User";
import GetProduct from "./components/DashBoard/ProductManage.jsx/GetProduct";
import Dashboards from "./components/DashBoard/Dashboards";
import AddService from "./components/DashBoard/ServiceManagement.jsx/AddService";
import EditService from "./components/DashBoard/ServiceManagement.jsx/EditService";
import ViewService from "./components/DashBoard/ServiceManagement.jsx/ViewService";

const App = () => {
  const [showNavbarAndFooter, setShowNavbarAndFooter] = useState(true);
  const location = useLocation();

  useEffect(() => {
    setShowNavbarAndFooter(
      !location.pathname.includes("/dashboard") &&
        !location.pathname.includes("/layout")
    );
  }, [location.pathname]);

  return (
    <>
      <div className="app">
        {showNavbarAndFooter && (
          <>
            <Navlink />
            <Navbar />
          </>
        )}
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
          <Route path="/booking" element={<BookingService />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/booking-history" element={<BookingHistory />} />
          <Route path="/order-service" element={<GetService />} />
          <Route path="/dashboard" element={<DashBoard />} />

          <Route path="/layout" element={<Layout />}>
            <Route path="/layout/dashboards" element={<Dashboards />} />
            <Route path="/layout/add-order/:orderId" element={<AddOrder />} />
            <Route path="/layout/service-info" element={<GetService />} />
            <Route path="/layout/add-service" element={<AddService />} />
            <Route path="/layout/edit-service/:servicesId" element={<EditService />} />
            <Route path="/layout/view-service" element={<ViewService />} />
            <Route path="/layout/account-info" element={<User />} />
            <Route path="/layout/product-info" element={<GetProduct />} />
          </Route>

          <Route
            path="/productdisplay/:productName"
            element={<ProductDisplay />}
          />
          <Route path="/confirm-email" element={<ConfirmEmail />} />
          <Route path="/check-email" element={<CheckEmail />} />
        </Routes>
      </div>
      {showNavbarAndFooter && (
        <div className="bg-gray-700">
          <Footer />
        </div>
      )}
    </>
  );
};

export default App;
