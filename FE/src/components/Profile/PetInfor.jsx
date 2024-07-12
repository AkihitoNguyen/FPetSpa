import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import AddNewPet from "./AddNewPet";
import UpdatePet from "./UpdatePet";
import DeletePet from "./DeletePet";
import Loading from "../Loading";

const PetProfile = () => {
  const currentUser = useSelector((state) => state.auth.login.currentUser);
  const [petData, setPetData] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [editingPetId, setEditingPetId] = useState(null);
  const [deletingPetId, setDeletingPetId] = useState(null);
  const [newPetInfo, setNewPetInfo] = useState({
    petName: "",
    pictureName: "",
    petGender: "",
    petType: "",
    petWeight: "",
    customerId: currentUser.userId,
  });
  const [imageFile, setImageFile] = useState(null);
  const [notification, setNotification] = useState(null); 

  useEffect(() => {
    if (!currentUser || !currentUser.accessToken) {
      setError("Bạn cần đăng nhập để xem thông tin vật nuôi.");
      return;
    }

    fetchPetData();
  }, [currentUser]);

  const fetchPetData = async () => {
    setIsLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${currentUser.accessToken}`,
        },
      };

      const response = await axios.get(
        "https://fpetspa.azurewebsites.net/api/Pet",
        config
      );

      const petInfo = response.data;
      const filteredPets = petInfo.filter(
        (pet) => pet.customerId === currentUser.userId
      );

      setPetData(filteredPets);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu vật nuôi:", error);
      setError("Không thể lấy thông tin vật nuôi.");
      setPetData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterPetInfo = () => {
    setShowPopup(true);
    setNewPetInfo({
      petName: "",
      pictureName: "",
      petGender: "",
      petType: "",
      petWeight: "",
      customerId: currentUser.userId,
    });
    setImageFile(null);
  };

  const handleSaveNewPetInfo = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${currentUser.accessToken}`,
          "Content-Type": "application/json",
        },
      };

      const response = await axios.post(
        "https://fpetspa.azurewebsites.net/api/Pet",
        newPetInfo,
        config
      );

      setShowPopup(false);
      fetchPetData();

      // Hiển thị thông báo thành công
      setNotification({
        message: "Đăng ký thông tin vật nuôi thành công!",
        type: "success",
      });
    } catch (error) {
      console.error("Lỗi khi đăng ký thông tin vật nuôi:", error);
      if (error.response) {
        console.error("Chi tiết lỗi:", error.response.data);
      }
    }
  };

  const handleCancel = () => {
    setShowPopup(false);
  };

  const handleUpdatePet = async (petId, updatedPetInfo) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${currentUser.accessToken}`,
          "Content-Type": "application/json",
        },
        timeout: 10000,
      };

      await axios.put(
        `https://fpetspa.azurewebsites.net/api/Pet/${petId}`,
        updatedPetInfo,
        config
      );

      fetchPetData();
      setEditingPetId(null);
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin vật nuôi:", error);
      if (error.response) {
        console.error("Chi tiết lỗi:", error.response.data);
      } else {
        console.error("Có thể là lỗi mạng hoặc lỗi kết nối.");
      }
    }
  };

  const handleDeletePet = async (petId) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${currentUser.accessToken}`,
          "Content-Type": "application/json",
        },
      };
  
      console.log("Trying to delete pet with ID:", petId);
  
      const response = await axios.delete(
        `https://fpetspa.azurewebsites.net/api/Pet/${petId}`,
        config
      );
  
      console.log("Pet deleted successfully:", response);
  
      setDeletingPetId(null);
      fetchPetData();
    } catch (error) {
      console.error("Error deleting pet:", error);
      if (error.response) {
        console.error("Error details:", error.response.data);
        // Có thể thêm xử lý dựa trên lỗi trả về cụ thể ở đây
      }
    }
  };
  
  

  const handleEditPet = (petId) => {
    setEditingPetId(petId);
  };

  const handleCancelUpdate = () => {
    setEditingPetId(null);
  };

  const handleCancelDelete = () => {
    setDeletingPetId(null);
  };

  const closeNotification = () => {
    setNotification(null);
  };

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        closeNotification();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [notification]);

  if (!currentUser || !currentUser.accessToken) {
    return <div>Bạn cần đăng nhập để xem thông tin vật nuôi.</div>;
  }

  if (error) {
    return <div>Lỗi: {error}</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-semibold">Thông tin vật nuôi</h2>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
          onClick={handleRegisterPetInfo}
        >
          + Đăng ký thông tin vật nuôi
        </button>
      </div>

      {isLoading ? (
        <Loading/>
      ) : (
        <>
          <div className="mb-6">
            <p className="text-lg font-semibold mb-2">
              Số lượng pet có: {petData.length}
            </p>
          </div>

          <ul>
            {petData.map((pet, index) => (
              <li key={index} className="mb-6 p-4 border rounded-md">
                {editingPetId === pet.petId ? (
                  <UpdatePet
                    pet={pet}
                    handleUpdatePet={handleUpdatePet}
                    handleCancelUpdate={handleCancelUpdate}
                  />
                ) : (
                  <>
                    <h3 className="text-xl font-semibold mb-2">
                      Vật nuôi #{index + 1}
                    </h3>
                    <div className="flex items-center mb-2">
                      <span className="font-semibold mr-2">Tên vật nuôi:</span>
                      <span>{pet.petName}</span>
                    </div>
                    <div className="flex items-center mb-2">
                      <span className="font-semibold mr-2">Giới tính vật nuôi:</span>
                      <span>{pet.petGender}</span>
                    </div>
                    <div className="flex items-center mb-2">
                      <span className="font-semibold mr-2">Loại vật nuôi:</span>
                      <span>{pet.petType}</span>
                    </div>
                    <div className="flex items-center mb-2">
                      <span className="font-semibold mr-2">Cân nặng vật nuôi:</span>
                      <span>{pet.petWeight}</span>
                    </div>
                    <button
                      className="px-4 py-2 bg-blue-700 text-white rounded-md mr-2"
                      onClick={() => handleEditPet(pet.petId)}
                    >
                      Chỉnh sửa
                    </button>
                    <button
                      className="px-4 py-2 bg-red-700 text-white rounded-md"
                      onClick={() => setDeletingPetId(pet.petId)}
                    >
                      Xóa
                    </button>
                  </>
                )}

                {deletingPetId === pet.petId && (
                  <DeletePet
                    petId={pet.petId}
                    handleDeletePet={handleDeletePet}
                    handleCancelDelete={handleCancelDelete}
                  />
                )}
              </li>
            ))}
          </ul>
        </>
      )}

      {showPopup && (
        <AddNewPet
          newPetInfo={newPetInfo}
          setNewPetInfo={setNewPetInfo}
          handleSaveNewPetInfo={handleSaveNewPetInfo}
          handleCancel={handleCancel}
          imageFile={imageFile}
          setImageFile={setImageFile}
        />
      )}

      {notification && (
        <div
          className={`fixed top-4 right-4 p-4 rounded shadow-md ${
            notification.type === "success" ? "bg-green-500" : "bg-red-500"
          } text-white`}
        >
          <p>{notification.message}</p>
          <button className="ml-4 text-sm underline" onClick={closeNotification}>
            Đóng
          </button>
        </div>
      )}
    </div>
  );
};

export default PetProfile;
