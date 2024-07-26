import React, { useState, useEffect } from "react";
import "./App.css";
import { Route, Routes, useLocation, matchPath } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Cart from "./pages/Cart/Cart";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Product from "./pages/Product/Product";
import ProductDisplay from "./components/ProductDisplay/ProductDisplay";
import Footer from "./components/Footer/Footer"

import "react-toastify/dist/ReactToastify.css";
import "semantic-ui-css/semantic.min.css";

import Service from "./pages/Service/Service";
import ContactUs from "./pages/ContactUs/ContactUs";
import AboutUs from "./pages/AboutUs/AboutUs";
import BookingService from "./pages/Service/BookingService";
import Profile from "./pages/Profile/Profile";
import DashBoard from "./pages/DashBoard/DashBoard";
import Checkout from "./components/Checkout/Checkout";
import NotFound from "./pages/NotFound/NotFound";
import GetService from "./components/DashBoard/ServiceManagement.jsx/GetService";
import AddOrder from "./components/DashBoard/ServiceManagement.jsx/AddOrder";
import Layout from "./components/Layout";
import User from "./components/DashBoard/User";
import GetProduct from "./components/DashBoard/ProductManage.jsx/GetProduct";
import PaymentSuccess from "./components/Checkout/PaymentSuccess";
import BookingHistory from "./components/Profile/BookingHistory";
import Dashboards from "./components/DashBoard/Dashboards";
import AddService from "./components/DashBoard/ServiceManagement.jsx/AddService";
import EditService from "./components/DashBoard/ServiceManagement.jsx/EditService";
import ViewService from "./components/DashBoard/ServiceManagement.jsx/ViewService";
import BookingProduct from "./components/DashBoard/ProductManage.jsx/BookingProduct";

import QR from "./pages/QR/QR";
import AddProduct from "./components/DashBoard/ProductManage.jsx/AddProduct";
import SearchResult from "./components/PageProduct/SearchResult";
import SecondForm from "./components/FormComponents/SecondForm";
import FirstForm from "./components/FormComponents/FirstForm";
import { ToastContainer } from "react-toastify";
import Transactions from "./components/DashBoard/Transactions";
import PrivateRoute from "../src/utils/PrivateRoute"
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";

const App = () => {
  const [showNavbarAndFooter, setShowNavbarAndFooter] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const routesToHideNavbar = ["/dashboard", "/layout"];
    const isLayoutOrDashboardRoute = routesToHideNavbar.some(route =>
      location.pathname.startsWith(route)
    );

    setShowNavbarAndFooter(!isLayoutOrDashboardRoute);
  }, [location.pathname]);

  return (
    <>
      <div className="app">
      <ToastContainer />

        {showNavbarAndFooter && <Navbar />}
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
          <Route path="/first-form" element={<FirstForm />} />
          <Route path="/booking" element={<BookingService />} />
          <Route path="/second-form" element={<SecondForm />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/booking-history" element={<BookingHistory />} />
          <Route path="/order-service" element={<GetService />} />
          <Route path="/qr" element={<QR />} />
          <Route path="/productdisplay/:productId" element={<ProductDisplay />} />
          <Route path="/search" element={<SearchResult />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />

          <Route path="/layout" element={<PrivateRoute  element={<Layout/>}  allowedRoles={['Admin']}/>}>
            <Route path="dashboards" element={<PrivateRoute element={<Dashboards />} allowedRoles={['Admin']} />} />
            <Route path="add-order/:orderId" element={<PrivateRoute element={<AddOrder />} allowedRoles={['Admin']} />} />
            <Route path="service-info" element={<PrivateRoute element={<GetService />} allowedRoles={['Admin']} />} />
            <Route path="add-service" element={<PrivateRoute element={<AddService />} allowedRoles={['Admin']} />} />
            <Route path="edit-service/:servicesId" element={<PrivateRoute element={<EditService />} allowedRoles={['Admin']} />} />
            <Route path="view-service" element={<PrivateRoute element={<ViewService />} allowedRoles={['Admin']} />} />
            <Route path="account-info" element={<PrivateRoute element={<User />} allowedRoles={['Admin']} />} />
            <Route path="product-info" element={<PrivateRoute element={<GetProduct />} allowedRoles={['Admin']} />} />
            <Route path="add-product" element={<PrivateRoute element={<AddProduct />} allowedRoles={['Admin']} />} />
            <Route path="booking-product" element={<PrivateRoute element={<BookingProduct />} allowedRoles={['Admin']} />} />
            <Route path="transactions" element={<PrivateRoute element={<Transactions />} allowedRoles={['Admin']} />} />
          </Route>

          <Route path="/layout/dashboards" element={<DashBoard />} />

          {/* Đường dẫn không khớp */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      {showNavbarAndFooter && <div className="bg-gray-700"><Footer/></div>}
    </>
  );
};

export default App;
