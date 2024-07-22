import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import Loading from "../Loading";
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
          `https://fpetspa.azurewebsites.net/api/account/getAllCustomer`,
          {
            headers: { Authorization: `Bearer ${user.accessToken}` },
          }
        );
        console.log(response.data); // Ghi log phản hồi API để kiểm tra dữ liệu
  
        const currentUser = response.data.find((customer) => customer.id === user.userId);
  
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

  if (!user) {
    return <div><Loading/></div>;
  }

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold text-center mb-4">Information</h2>
      <div className="space-y-4">
        <div className="flex flex-col">
          <label htmlFor="fullName" className="text-lg font-medium text-gray-700">
           Name
          </label>
          <input
            id="fullName"
            type="text"
            value={fullName}
            readOnly
            className="mt-1 p-2 border border-gray-300 rounded-md shadow-sm "
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="email" className="text-lg font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            readOnly
            className="mt-1 p-2 border border-gray-300 rounded-md shadow-sm "
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="phoneNumber" className="text-lg font-medium text-gray-700">
           Phone
          </label>
          <input
            id="phoneNumber"
            type="text"
            value={phoneNumber}
            readOnly
            className="mt-1 p-2 border border-gray-300 rounded-md shadow-sm "
          />
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
