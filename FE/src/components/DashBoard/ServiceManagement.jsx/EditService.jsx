import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const EditService = () => {
  const { servicesId } = useParams();
  const [serviceName, setServiceName] = useState("");
  const [price, setPrice] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        const response = await axios.get(
          `https://fpetspa.azurewebsites.net/api/services/${servicesId}`
        );
        const { serviceName, price, pictureServices, description } = response.data;
        setServiceName(serviceName);
        setPrice(price);
        setThumbnail(pictureServices); 
        setDescription(description);
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết dịch vụ:", error);
      }
    };
  
    fetchServiceDetails();
  }, [servicesId]);
  
  

  const handleTextChange = (e) => {
    const { name, value } = e.target;
    if (name === "service-name") {
      setServiceName(value);
    } else if (name === "service-price") {
      setPrice(value);
    } else if (name === "service-description") {
      setDescription(value);
    }
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    // Handle file upload or display preview if needed
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `https://fpetspa.azurewebsites.net/api/services/${servicesId}`,
        {
          serviceName,
          price,
          pictureServices: thumbnail,
          description,
        }
      );
      alert("Service updated successfully!");
    } catch (error) {
      console.error("Error updating service:", error);
      alert("Failed to update service.");
    }
  };

  return (
    <div className="bg-[#FCFCFC]">
      <div>
        <h1 className="text-[17.55px] font-semibold">Service Form</h1>
      </div>
      <div className="flex">
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
                    onChange={handleThumbnailChange}
                    className="hidden"
                    id="file-input"
                  />
                  <label htmlFor="file-input">
                    <img
                      src={thumbnail}
                      alt="Thumbnail Preview"
                      className="image-input-wrapper w-40 h-40 border-[0.4px] rounded-md shadow-xl cursor-pointer"
                    />
                  </label>
                </div>
              </div>
              <div className="block text-[12.35px] text-center font-normal leading-[18.525px] text-[#99A1B7]">
                Set the product thumbnail image. Only *.png, *.jpg and *.jpeg
                image files are accepted.
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#FFFFFF] w-[860.100px] h-[480.425px] border-[0.8px] rounded-md shadow-sm">
          <form onSubmit={handleSubmit}>
            <div className="flex justify-between items-center flex-wrap min-h-[70px] px-[29.250px]">
              <div className="flex justify-between items-center h-[57px] my-[6.5px] mr-[6.5px]">
                <h2 className="block m-0 text-[19.5px] font-semibold">
                  General
                </h2>
              </div>
            </div>

            <div className="flex flex-col px-[29.250px] pb-[26px]">
              <label
                htmlFor="service-name"
                className="text-[13.65px] mb-[6.5px] font-medium">
                Service Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="service-name"
                id="service-name"
                placeholder="Service Name"
                className="w-full block my-[6.500px] py-[10.075px] px-[13px] border rounded-[0.475rem]"
                value={serviceName}
                onChange={handleTextChange}
                required
              />
              <div className="text-[12.35px] text-[#99A1B7] font-normal">
                A service name is required and recommended to be unique.
              </div>
            </div>

            <div className="flex flex-col px-[29.250px] pb-[26px]">
              <label
                htmlFor="service-description"
                className="text-[13.65px] mb-[6.5px] font-medium">
                Description
              </label>
              <textarea
                id="service-description"
                name="service-description"
                className="w-full block my-[6.500px] py-[10.075px] px-[13px] border rounded-[0.475rem]"
                placeholder="Enter Service Description"
                value={description}
                onChange={handleTextChange}
              />
              <div className="text-[12.35px] text-[#99A1B7] font-normal">
                Set a description to the product for better visibility.
              </div>
            </div>

            <div className="flex flex-col px-[29.250px] pb-[26px]">
              <label
                htmlFor="service-price"
                className="text-[13.65px] mb-[6.5px] font-medium">
                Price <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="service-price"
                id="service-price"
                placeholder="Price"
                className="w-full block my-[6.500px] py-[10.075px] px-[13px] border rounded-[0.475rem]"
                value={price}
                onChange={handleTextChange}
                required
              />
              <div className="text-[12.35px] text-[#99A1B7] font-normal">
                Set the service price.
              </div>
            </div>

            <div className="flex justify-end w-[860.100px] mt-4">
              <button
                type="submit"
                className="flex items-center justify-end px-[20.5px] py-[11.075px] text-[13.2px] font-medium text-white bg-[#1B84FF] rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditService;
