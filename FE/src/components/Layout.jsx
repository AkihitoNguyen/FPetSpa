// components/Layout.jsx
import React from "react";
import Sidebar from "./DashBoard/SideBar"; // Đảm bảo đường dẫn tới Sidebar đúng
import { Outlet } from "react-router-dom";
import AdminNavbar from "./AdminNavbar/AdminNavbar";

const Layout = () => {
  return (
    <div className="flex bg-[#F5F7F8] h-screen">
      <Sidebar />
      <div className="flex flex-col flex-grow">
        <AdminNavbar />
        <main className="flex-grow mx-auto bg-[#F5F7F8]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
