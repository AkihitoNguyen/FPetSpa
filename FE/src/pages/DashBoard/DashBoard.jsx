import React from "react";
import Sidebar from "../../components/DashBoard/SideBar";
import User from "../../components/DashBoard/User";
import GetProduct from "../../components/DashBoard/ProductManage.jsx/GetProduct";
import GetService from "../../components/DashBoard/ServiceManagement.jsx/GetService";
import AddOrder from "../../components/DashBoard/ServiceManagement.jsx/AddOrder";
import { Routes, Route } from "react-router-dom";
import Dashboards from "../../components/DashBoard/Dashboards";
import EditService from "../../components/DashBoard/ServiceManagement.jsx/EditService";
import ViewService from "../../components/DashBoard/ServiceManagement.jsx/ViewService";
import AddProduct from "../../components/DashBoard/ProductManage.jsx/AddProduct";
import BookingProduct from "../../components/DashBoard/ProductManage.jsx/BookingProduct";

const DashBoard = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-8">
        <Routes>
          <Route path="/layout/dashboards" element={<Dashboards />} />
          <Route path="/layout/account-info" element={<User />} />
          <Route path="/layout/product-info" element={<GetProduct />} />
          <Route path="/layout/service-info" element={<GetService />} />
          <Route path="/layout/add-service" element={<GetService />} />
          <Route path="/layout/add-order" element={<AddOrder />} />
          <Route path="/layout/edit-order" element={<EditService />} />
          <Route path="/layout/view-order" element={<ViewService />} />
          <Route path="/layout/add-product" element={<AddProduct />} />
          <Route path="/layout/booking-product" element={<BookingProduct />} />

        </Routes>
      </div>
    </div>
  );
};

export default DashBoard;

