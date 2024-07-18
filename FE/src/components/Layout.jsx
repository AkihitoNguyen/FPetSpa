// components/Layout.jsx
import React from "react";
import Sidebar from "./DashBoard/SideBar"; // Đảm bảo đường dẫn tới Sidebar đúng
import { Outlet } from "react-router-dom";
import AdminNavbar from "./AdminNavbar/AdminNavbar";

const Layout = () => {
  return (
    <div className="flex">
      <div className="">
      <Sidebar />
      </div>
      <div className="flex flex-col">
        <div className="w-[1200px]">
          <AdminNavbar />
        </div>
        <div className="flex justify-center items-center">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
