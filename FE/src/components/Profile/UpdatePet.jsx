import React, { useState } from 'react';

const UpdatePet = ({ pet, handleUpdatePet, handleCancelUpdate }) => {
  const [updatedPetInfo, setUpdatedPetInfo] = useState({
    customerId: pet.customerId,
    petName: pet.petName,
    pictureName: pet.pictureName,
    petGender: pet.petGender,
    petType: pet.petType,
    petWeight: pet.petWeight,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedPetInfo({ ...updatedPetInfo, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await handleUpdatePet(pet.petId, updatedPetInfo);
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin vật nuôi:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Cập nhật thông tin vật nuôi</h2>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-y-4">
            <label className="text-sm font-normal">Tên vật nuôi:</label>
            <input
              type="text"
              name="petName"
              value={updatedPetInfo.petName}
              onChange={handleChange}
              className="border border-gray-300 rounded px-2 py-1"
            />

            <label className="text-sm font-normal">Giới tính vật nuôi:</label>
            <input
              type="text"
              name="petGender"
              value={updatedPetInfo.petGender}
              onChange={handleChange}
              className="border border-gray-300 rounded px-2 py-1"
            />

            <label className="text-sm font-normal">Loại vật nuôi:</label>
            <input
              type="text"
              name="petType"
              value={updatedPetInfo.petType}
              onChange={handleChange}
              className="border border-gray-300 rounded px-2 py-1"
            />

            <label className="text-sm font-normal">Cân nặng vật nuôi:</label>
            <input
              type="text"
              name="petWeight"
              value={updatedPetInfo.petWeight}
              onChange={handleChange}
              className="border border-gray-300 rounded px-2 py-1"
            />
          </div>
          <div className="flex justify-end mt-4">
            <button
              type="submit"
              className="mr-2 px-4 py-1.5 bg-blue-700 text-white rounded"
            >
              Lưu
            </button>
            <button
              type="button"
              className="px-4 py-1.5 bg-gray-300 text-gray-700 rounded"
              onClick={handleCancelUpdate}
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdatePet;


