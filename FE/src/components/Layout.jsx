// components/Layout.jsx
import React from "react";
import Sidebar from "./DashBoard/SideBar"; // Đảm bảo đường dẫn tới Sidebar đúng
import { Outlet } from "react-router-dom";
import AdminNavbar from "./AdminNavbar/AdminNavbar";

const Layout = () => {
  return (
    <div className="flex bg-[#F5F7F8]">
      <div className="bg-[#F5F7F8]">
      <Sidebar />
      </div>
      <div className="flex flex-col bg-[#F5F7F8]">
        <div className="w-[1200px] bg-[#F5F7F8]">
          <AdminNavbar />
        </div>
        <div className="flex justify-center items-center bg-[#F5F7F8]">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
