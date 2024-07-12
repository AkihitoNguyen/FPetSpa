import React, { useState } from "react";
import axios from "axios";
import { assets } from "../../../assets/assets";

const AddService = () => {
  const [serviceName, setServiceName] = useState("");
  const [price, setPrice] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailUrl, setThumbnailUrl] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setThumbnail(file);

    // Create a URL for the selected file
    const imageUrl = URL.createObjectURL(file);
    setThumbnailUrl(imageUrl);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!serviceName || !price || !thumbnail) {
      console.error("Please fill out all required fields.");
      return;
    }

    console.log("Submitting with values:", {
      SerName: serviceName,
      Price: price,
      File: thumbnail,
    });

    const formData = new FormData();
    formData.append("File", thumbnail);

    try {
      const response = await axios.post(
        `https://fpetspa.azurewebsites.net/api/services?SerName=${encodeURIComponent(serviceName)}&Price=${encodeURIComponent(price)}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Service added successfully!", response.data);
      setSuccessMessage("Service added successfully!");

      // Reset form fields after successful submission if needed
      setServiceName("");
      setPrice("");
      setThumbnail(null);
      setThumbnailUrl(null);

    } catch (error) {
      console.error("Error adding service:", error);
      // Add error handling here
    }
  };

  return (
    <div className="bg-[#FCFCFC]">
      <div>
        <h1 className="text-[17.55px] font-semibold">Service Form</h1>
      </div>

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Success!</strong>
          <span className="block sm:inline"> {successMessage}</span>
          <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
            <svg onClick={() => setSuccessMessage("")} className="fill-current h-6 w-6 text-green-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 1 1-1.697 1.697l-3.651-3.651-3.65 3.65a1.2 1.2 0 1 1-1.697-1.697l3.651-3.65-3.65-3.651a1.2 1.2 0 1 1 1.697-1.697l3.65 3.651 3.651-3.65a1.2 1.2 0 1 1 1.697 1.697l-3.65 3.65 3.65 3.651z"/></svg>
          </span>
        </div>
      )}

      <div className="flex ">
        <div className="flex flex-col gap-7 lg:gap-10 w-[300px] mr-[32.500px] mb-[22.750px]">
          <div className="bg-[#FFFFFF] w-[298.4px] h-[340.425px] border-[0.8px] rounded-md shadow-sm">
            <div className="px-[29.250px]">
              <div className="flex items-center w-[99.725px] h-[57px] my-[6.5px] mr-[6.5px]">
                <h2 className="m-0 text-[19.5px] font-semibold">Thumbnail</h2>
              </div>
            </div>
            <div className="px-[29.250px] pb-[26px] flex flex-col items-center justify-center">
              <div>
                <div className="flex items-center justify-center">
                  <input
                    type="file"
                    accept=".png, .jpg, .jpeg"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-input"
                  />
                  <label htmlFor="file-input">
                    <img
                      src={thumbnailUrl || assets.avatar} // Use thumbnailUrl if available, otherwise fallback to assets.avatar
                      alt=""
                      className="image-input-wrapper w-40 h-40 border-[0.4px] rounded-md shadow-xl cursor-pointer"
                    />
                  </label>
                </div>
              </div>
              <div className="block text-[12.35px] text-center font-normal leading-[18.525px] text-[#99A1B7]">
                Set the product thumbnail image. Only *.png, *.jpg and *.jpeg image files are accepted
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#FFFFFF] w-[860.100px] h-[340.425px] border-[0.8px] rounded-md shadow-sm">
          <form onSubmit={handleSubmit}>
            <div className="flex justify-between items-center flex-wrap min-h-[70px] px-[29.250px]">
              <div className="flex justify-between items-center h-[57px] my-[6.5px] mr-[6.5px]">
                <h2 className="block m-0 text-[19.5px] font-semibold">General</h2>
              </div>
            </div>

            <div className="flex flex-col px-[29.250px] pb-[26px]">
              <label htmlFor="service-name" className="text-[13.65px] mb-[6.5px] font-medium">
                Service Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="service-name"
                id="service-name"
                placeholder="Service Name"
                className="w-full block my-[6.500px] py-[10.075px] px-[13px] border rounded-[0.475rem]"
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                required
              />
              <div className="text-[12.35px] text-[#99A1B7] font-normal">
                A service name is required and recommended to be unique.
              </div>
            </div>

            <div className="flex flex-col px-[29.250px] pb-[26px]">
              <label htmlFor="service-price" className="text-[13.65px] mb-[6.5px] font-medium">
                Price <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="service-price"
                id="service-price"
                placeholder="Price"
                className="w-full block my-[6.500px] py-[10.075px] px-[13px] border rounded-[0.475rem]"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
              <div className="text-[12.35px] text-[#99A1B7] font-normal">Set the service price.</div>
            </div>

            <div className="flex justify-end w-[860.100px] mt-4">
              <button
                type="submit"
                className="flex items-center justify-end px-[20.5px] py-[11.075px] text-[13.2px] font-medium text-white bg-[#1B84FF] rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddService;
