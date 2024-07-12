import React from "react";
import Sidebar from "../../components/DashBoard/SideBar";
import User from "../../components/DashBoard/User";
import GetProduct from "../../components/DashBoard/ProductManage.jsx/GetProduct";
import GetService from "../../components/DashBoard/ServiceManagement.jsx/GetService";
import AddOrder from "../../components/DashBoard/ServiceManagement.jsx/AddOrder";
import { Routes, Route } from "react-router-dom"; 

const DashBoardStaff = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-8">
        <Routes>
          <Route path="/layout/product-info" element={<GetProduct />} />
          <Route path="/layout/service-info" element={<GetService />} />
          <Route path="/layout/add-order" element={<AddOrder />} />
        </Routes>
      </div>
    </div>
  );
};

export default DashBoardStaff;