import React, { useState } from 'react';

const AddNewPet = ({ newPetInfo, setNewPetInfo, imageFile, setImageFile, handleSaveNewPetInfo, handleCancel }) => {
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPetInfo({
      ...newPetInfo,
      [name]: value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
  };

  const validate = () => {
    let formErrors = {};
    
    const nameTypeRegex = /^[a-zA-ZÀ-ỹ\s]+$/;

    if (!newPetInfo.petName || newPetInfo.petName.trim() === "") {
      formErrors.petName = "Tên vật nuôi là bắt buộc.";
    } else if (!nameTypeRegex.test(newPetInfo.petName)) {
      formErrors.petName = "Tên vật nuôi chỉ được chứa chữ cái và khoảng trắng.";
    }

    if (!newPetInfo.petType || newPetInfo.petType.trim() === "") {
      formErrors.petType = "Loại vật nuôi là bắt buộc.";
    } else if (!nameTypeRegex.test(newPetInfo.petType)) {
      formErrors.petType = "Loại vật nuôi chỉ được chứa chữ cái.";
    }

    if (!newPetInfo.petGender || !["Male", "Female"].includes(newPetInfo.petGender)) {
      formErrors.petGender = "Giới tính vật nuôi là bắt buộc.";
    }

    if (!newPetInfo.petWeight || newPetInfo.petWeight.trim() === "") {
      formErrors.petWeight = "Cân nặng vật nuôi là bắt buộc.";
    } else if (isNaN(newPetInfo.petWeight) || Number(newPetInfo.petWeight) < 0) {
      formErrors.petWeight = "Cân nặng vật nuôi phải là một số nguyên.";
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      handleSaveNewPetInfo();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Đăng kí thông tin vật nuôi</h2>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-y-4">
            <label className="text-sm font-normal">Tên vật nuôi:</label>
            <input
              type="text"
              name="petName"
              value={newPetInfo.petName}
              onChange={handleChange}
              className={`border ${errors.petName ? 'border-red-500' : 'border-gray-300'} rounded px-2 py-1`}
            />
            {errors.petName && <p className="text-red-500 text-xs">{errors.petName}</p>}

            <label className="text-sm font-normal">Giới tính vật nuôi:</label>
            <select
              name="petGender"
              value={newPetInfo.petGender}
              onChange={handleChange}
              className={`border ${errors.petGender ? 'border-red-500' : 'border-gray-300'} rounded px-2 py-1`}
            >
              <option value="">Chọn giới tính</option>
              <option value="Male">Đực</option>
              <option value="Female">Cái</option>
            </select>
            {errors.petGender && <p className="text-red-500 text-xs">{errors.petGender}</p>}

            <label className="text-sm font-normal">Loại vật nuôi:</label>
            <input
              type="text"
              name="petType"
              value={newPetInfo.petType}
              onChange={handleChange}
              className={`border ${errors.petType ? 'border-red-500' : 'border-gray-300'} rounded px-2 py-1`}
            />
            {errors.petType && <p className="text-red-500 text-xs">{errors.petType}</p>}

            <label className="text-sm font-normal">Cân nặng vật nuôi:</label>
            <input
              type="text"
              name="petWeight"
              value={newPetInfo.petWeight}
              onChange={handleChange}
              className={`border ${errors.petWeight ? 'border-red-500' : 'border-gray-300'} rounded px-2 py-1`}
            />
            {errors.petWeight && <p className="text-red-500 text-xs">{errors.petWeight}</p>}
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
              onClick={handleCancel}
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewPet;
