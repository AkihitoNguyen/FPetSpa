import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import Loading from "../Loading";

const PetProfile = () => {
  const currentUser = useSelector((state) => state.auth.login.currentUser);
  const [petData, setPetData] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [petToEdit, setPetToEdit] = useState(null);
  const [newPetInfo, setNewPetInfo] = useState({
    petName: "",
    petType: "",
    petWeight: ""
  });
  const [imageFile, setImageFile] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if (!currentUser || !currentUser.accessToken) {
      setError("You need to log in to view pet information.");
      return;
    }
    fetchPetData();
  }, [currentUser]);

  const fetchPetData = async () => {
    setIsLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${currentUser.accessToken}`
        }
      };
      const response = await axios.get(
        "https://localhost:7055/api/PET",
        config
      );
      const petInfo = response.data;
      const filteredPets = petInfo.filter(
        (pet) => pet.customerId === currentUser.userId
      );
      setPetData(filteredPets);
    } catch (error) {
      console.error("Error fetching pet data:", error);
      setError("Cannot fetch pet information.");
      setPetData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const postPetInfo = async (formData, queryParams, config) => {
    await axios.post(
      `https://localhost:7055/api/Pet?${queryParams}`,
      formData,
      config
    );
    setNotification({
      message: "Pet information registered successfully!",
      type: "success"
    });
  };

  const putPetInfo = async (petId, formData, config) => {
    await axios.put(
      `https://localhost:7055/api/Pet/${petId}`,
      formData,
      config
    );
    setNotification({
      message: "Pet information updated successfully!",
      type: "success"
    });
  };

  const deletePetInfo = async (petId) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${currentUser.accessToken}`
        }
      };
      await axios.delete(`https://localhost:7055/api/Pet/${petId}`, config);
      setNotification({
        message: "Pet information deleted successfully!",
        type: "success"
      });
      fetchPetData();
    } catch (error) {
      console.error("Error deleting pet information:", error);
      setNotification({
        message: "Cannot delete pet information.",
        type: "error"
      });
    }
  };

  const handleRegisterPetInfo = () => {
    setPetToEdit(null); // Set petToEdit to null when adding new
    setShowPopup(true);
    setNewPetInfo({
      petName: "",
      petType: "",
      petWeight: ""
    });
    setImageFile(null);
  };

  const handleEditPet = (pet) => {
    setPetToEdit(pet.petId);
    setNewPetInfo({
      petName: pet.petName,
      petType: pet.petType,
      petWeight: pet.petWeight
    });
    setImageFile(null); // Or keep the old image if necessary
    setShowPopup(true);
  };

  const handleSavePetInfo = async () => {
    const formData = new FormData();
    if (imageFile) {
      formData.append("file", imageFile);
    }
    formData.append("petName", newPetInfo.petName);
    formData.append("petType", newPetInfo.petType);
    formData.append("petWeight", newPetInfo.petWeight);

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${currentUser.accessToken}`,
          "Content-Type": "multipart/form-data"
        }
      };

      if (petToEdit) {
        // Update pet information
        await putPetInfo(petToEdit, formData, config);
      } else {
        // Add new pet information
        const queryParams = new URLSearchParams({
          CustomerId: currentUser.userId,
          PetName: newPetInfo.petName,
          PetType: newPetInfo.petType,
          PetWeight: newPetInfo.petWeight
        }).toString();
        await postPetInfo(formData, queryParams, config);
      }

      setShowPopup(false);
      fetchPetData();
    } catch (error) {
      console.error("Error registering or updating pet information:", error);
      if (error.response) {
        console.error("Error details:", error.response.data);
      }
    }
  };

  const handleCancel = () => {
    setShowPopup(false);
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
    return <div>You need to log in to view pet information.</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-semibold">Pet Information</h2>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
          onClick={handleRegisterPetInfo}
        >
          + Add Pet
        </button>
      </div>

      {isLoading ? (
        <Loading />
      ) : (
        <>
          <div className="mb-6">
            <p className="text-lg font-semibold mb-2">
              Number of pets: {petData.length}
            </p>
          </div>

          <ul>
            {petData.map((pet, index) => (
              <li key={pet.petId} className="mb-6 p-4 border rounded-md">
                <h3 className="text-xl font-semibold mb-2">
                  Pet #{index + 1}
                </h3>
                <div className="flex items-center mb-2">
                  <span className="font-semibold mr-2">ID :</span>
                  <span>{pet.petId}</span>
                </div>
                <div className="flex items-center mb-2">
                  <span className="font-semibold mr-2">Name :</span>
                  <span>{pet.petName}</span>
                </div>
                <div className="flex items-center mb-2">
                  <span className="font-semibold mr-2">Type :</span>
                  <span>{pet.petType}</span>
                </div>
                <div className="flex items-center mb-2">
                  <span className="font-semibold mr-2">Weight :</span>
                  <span>{pet.petWeight} kg</span>
                </div>
                <div className="flex items-center mb-2">
                  <span className="font-semibold mr-2">Image :</span>
                  {pet.pictureName ? (
                    <img
                      src={pet.pictureName}
                      alt={pet.petName}
                      className="w-16 h-16 rounded-full"
                    />
                  ) : (
                    <span>No image available</span>
                  )}
                </div>
                <div className="flex space-x-4">
                  <button
                    className="px-4 py-2 bg-yellow-500 text-white rounded-md"
                    onClick={() => handleEditPet(pet)}
                  >
                    Update
                  </button>
                  <button
                    className="px-4 py-2 bg-red-500 text-white rounded-md"
                    onClick={() => deletePetInfo(pet.petId)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">
              {petToEdit ? "Update Pet Information" : "Add Pet Information"}
            </h3>
            <div className="mb-4">
              <label className="block font-semibold mb-2" htmlFor="petName">
                Pet Name
              </label>
              <input
                type="text"
                id="petName"
                className="w-full px-4 py-2 border rounded-md"
                value={newPetInfo.petName}
                onChange={(e) =>
                  setNewPetInfo({ ...newPetInfo, petName: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-2" htmlFor="petType">
                Pet Type
              </label>
              <input
                type="text"
                id="petType"
                className="w-full px-4 py-2 border rounded-md"
                value={newPetInfo.petType}
                onChange={(e) =>
                  setNewPetInfo({ ...newPetInfo, petType: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-2" htmlFor="petWeight">
                Pet Weight (kg)
              </label>
              <input
                type="number"
                id="petWeight"
                className="w-full px-4 py-2 border rounded-md"
                value={newPetInfo.petWeight}
                onChange={(e) =>
                  setNewPetInfo({ ...newPetInfo, petWeight: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-2" htmlFor="image">
                Image
              </label>
              <input
                type="file"
                id="image"
                className="w-full"
                onChange={(e) => setImageFile(e.target.files[0])}
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded-md"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
                onClick={handleSavePetInfo}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {notification && (
        <div className={`fixed top-4 right-4 p-4 rounded-md shadow-md ${notification.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
          {notification.message}
        </div>
      )}
    </div>
  );
};

export default PetProfile;
