import React from "react";

const DeletePet = ({ petId, handleDeletePet, handleCancelDelete }) => {
  const confirmDelete = () => {
    handleDeletePet(petId);
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-xl font-semibold mb-4">Xác nhận xóa vật nuôi</h2>
        <p>Bạn có chắc chắn muốn xóa vật nuôi này không?</p>
        <div className="flex justify-end mt-4">
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-md mr-2"
            onClick={confirmDelete}
          >
            Xóa
          </button>
          <button
            className="px-4 py-2 bg-gray-500 text-white rounded-md"
            onClick={handleCancelDelete}
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeletePet;
