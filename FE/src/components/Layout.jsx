// components/Layout.jsx
import React from "react";
import Sidebar from "./DashBoard/SideBar"; // Đảm bảo đường dẫn tới Sidebar đúng
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-grow p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
