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
import Transactions from "../../components/DashBoard/Transactions";
import PayInOut from "../../components/DashBoard/ServiceManagement.jsx/PayInOut";

const DashBoard = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <div className="p-8">
          <Routes>
            <Route path="/dashboards" element={<Dashboards />} />
            <Route path="/account-info" element={<User />} />
            <Route path="/product-info" element={<GetProduct />} />
            <Route path="/service-info" element={<GetService />} />
            <Route path="/add-service" element={<GetService />} />
            <Route path="/add-order/:orderId" element={<AddOrder />} />
            <Route path="/edit-service/:servicesId" element={<EditService />} />
            <Route path="/view-service" element={<ViewService />} />
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/transaction" element={<Transactions />} />
            <Route path="/layout/pay-in-out" element={<PayInOut />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default DashBoard;

