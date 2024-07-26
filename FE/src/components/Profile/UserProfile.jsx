import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

const UserProfile = () => {
  const user = useSelector((state) => state.auth.login?.currentUser);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(
          `https://localhost:7055/api/account/getAllCustomer`,
          {
            headers: { Authorization: `Bearer ${user.accessToken}` },
          }
        );
        console.log(response.data); // Ghi log phản hồi API để kiểm tra dữ liệu

        const currentUser = response.data.find(
          (customer) => customer.id === user.userId
        );

        if (currentUser) {
          setFullName(currentUser.fullName);
          setEmail(currentUser.email);
          setPhoneNumber(currentUser.phoneNumber);
        }
      } catch (err) {
        setError(err.message);
        alert("Failed to fetch user details. Please try again.");
      }
    };

    if (user) {
      fetchUserDetails();
    }
  }, [user]);

  const handleSave = () => {
    // Xử lý lưu thông tin người dùng tại đây
    // Ví dụ: gửi thông tin đã chỉnh sửa đến API
  };

  if (!user) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center w-full min-h-screen py-8 rounded-lg bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-3xl p-8">
        <div className="flex items-center justify-center mb-6">
          <img
            className="object-cover w-32 h-32 p-1 rounded-full ring-2 ring-indigo-300"
            src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGZhY2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60"
            alt="Bordered avatar"
          />
        </div>
        <h2 className="text-2xl font-bold mb-6 text-center">Public Profile</h2>
        <div className="space-y-6">
          {/* Full Name */}
          <div>
            <label
              htmlFor="full_name"
              className="block mb-2 text-sm font-medium text-gray-700">
              Full name
            </label>
            <input
              type="text"
              id="full_name"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
              placeholder="Full name"
              value={fullName || ""}
              onChange={(e) => setFullName(e.target.value)} // Cập nhật state khi người dùng thay đổi
              required
            />
          </div>
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-700">
              Your email
            </label>
            <input
              type="email"
              id="email"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
              placeholder="your.email@mail.com"
              value={email || ""}
              onChange={(e) => setEmail(e.target.value)} // Cập nhật state khi người dùng thay đổi
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSave} // Thực hiện lưu thông tin khi người dùng nhấn nút
              className="text-white bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
