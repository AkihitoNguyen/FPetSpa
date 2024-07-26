import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { assets } from '../../../assets/assets';

const AddProduct = () => {
  const [newProduct, setNewProduct] = useState({
    productName: '',
    productDescription: '',
    productQuantity: '',
    price: '',
    categoryID: ''
  });

  const [categories, setCategories] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailUrl, setThumbnailUrl] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('https://localhost:7055/api/Categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setThumbnail(file);

    const imageUrl = URL.createObjectURL(file);
    setThumbnailUrl(imageUrl);
    setErrors(prevErrors => ({ ...prevErrors, thumbnail: null }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProduct(prevState => ({
      ...prevState,
      [name]: value
    }));
    validateField(name, value);
  };

  const validateField = (name, value) => {
    const newErrors = { ...errors };
    const textPattern = /^[a-zA-Z\s]*$/;
    const numberPattern = /^\d+$/;

    switch (name) {
      case 'productName':
        if (!value.trim()) {
          newErrors.productName = 'Product Name is required';
        } else if (!textPattern.test(value)) {
          newErrors.productName = 'Product Name should not contain special characters or numbers';
        } else {
          newErrors.productName = null;
        }
        break;

      case 'productDescription':
        if (!value.trim()) {
          newErrors.productDescription = 'Product Description is required';
        } else if (!textPattern.test(value)) {
          newErrors.productDescription = 'Product Description should not contain special characters or numbers';
        } else {
          newErrors.productDescription = null;
        }
        break;

      case 'productQuantity':
        if (!value) {
          newErrors.productQuantity = 'Product Quantity is required';
        } else if (!numberPattern.test(value)) {
          newErrors.productQuantity = 'Product Quantity should be a valid number';
        } else {
          newErrors.productQuantity = null;
        }
        break;

      case 'price':
        if (!value) {
          newErrors.price = 'Price is required';
        } else if(!numberPattern.test(value)) {
          newErrors.price = 'Price should be a valid number';
        }else{
          newErrors.price = null;
        }
        break;

      case 'categoryID':
        if (!value) {
          newErrors.categoryID = 'Category is required';
        } else {
          newErrors.categoryID = null;
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
  };

  const validateForm = () => {
    const newErrors = {};

    // Regular expressions for validation
    const textPattern = /^[a-zA-Z\s]*$/;
    const numberPattern = /^\d+$/;

    if (!newProduct.productName.trim()) {
      newErrors.productName = 'Product Name is required';
    } else if (!textPattern.test(newProduct.productName)) {
      newErrors.productName = 'Product Name should not contain special characters or numbers';
    }

    if (!newProduct.productDescription.trim()) {
      newErrors.productDescription = 'Product Description is required';
    } else if (!textPattern.test(newProduct.productDescription)) {
      newErrors.productDescription = 'Product Description should not contain special characters or numbers';
    }

    if (!newProduct.productQuantity) {
      newErrors.productQuantity = 'Product Quantity is required';
    } else if (!numberPattern.test(newProduct.productQuantity)) {
      newErrors.productQuantity = 'Product Quantity should be a valid number';
    }

    if (!newProduct.price) {
      newErrors.price = 'Price is required';
    } else if (!numberPattern.test(newProduct.price))

    if (!newProduct.categoryID) {
      newErrors.categoryID = 'Category is required';
    }

    if (!thumbnail) {
      newErrors.thumbnail = 'Product thumbnail is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const formData = new FormData();
    formData.append('file', thumbnail);
    formData.append('ProductName', newProduct.productName);
    formData.append('ProductDescription', newProduct.productDescription);
    formData.append('ProductQuantity', newProduct.productQuantity);
    formData.append('Price', newProduct.price);
    formData.append('CategoryID', newProduct.categoryID);

    try {
      const response = await axios.post('https://localhost:7055/api/products/Create-Product', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setSuccessMessage('Product added successfully!');
      console.log(response.data);

      // Reset the form
      setNewProduct({
        productName: '',
        productDescription: '',
        productQuantity: '',
        price: '',
        categoryID: ''
      });
      setThumbnail(null);
      setThumbnailUrl('');
      setErrors({});
    } catch (error) {
      console.error('Error adding product:', error.response.data);
      alert('Failed to add product.');
    }
  };

  return (
    <div className="bg-[#FCFCFC] p-4 md:p-6 lg:p-8">
      <div>
        <h1 className="text-[17.55px] font-semibold">Add Product</h1>
      </div>

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Success!</strong>
          <span className="block sm:inline"> {successMessage}</span>
          <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
            <svg onClick={() => setSuccessMessage('')} className="fill-current h-6 w-6 text-green-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 1 1-1.697 1.697l-3.651-3.651-3.65 3.65a1.2 1.2 0 1 1-1.697-1.697l3.651-3.65-3.65-3.651a1.2 1.2 0 1 1 1.697-1.697l3.65 3.651 3.651-3.65a1.2 1.2 0 1 1 1.697 1.697l-3.65 3.65 3.65 3.651z"/></svg>
          </span>
        </div>
      )}

      <div className="flex flex-col lg:flex-row">
        <div className="flex flex-col gap-7 lg:gap-10 w-full lg:w-[300px] mb-[22.750px] lg:mr-[32.500px]">
          <div className="bg-[#FFFFFF] w-full h-[340.425px] border-[0.8px] rounded-md shadow-sm">
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
                      src={thumbnailUrl || assets.avatar}
                      alt=""
                      className="image-input-wrapper w-40 h-40 border-[0.4px] rounded-md shadow-xl cursor-pointer"
                    />
                  </label>
                </div>
              </div>
              <div className="block text-[12.35px] text-center font-normal leading-[18.525px] text-[#99A1B7]">
                Set the product thumbnail image. Only *.png, *.jpg and *.jpeg image files are accepted.
              </div>
              {errors.thumbnail && (
                <div className="text-red-500 text-sm mt-2">
                  {errors.thumbnail}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6 lg:gap-7 w-full lg:w-[860.100px]">
          <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <div className="flex flex-col px-[29.250px] pb-[26px]">
              <label htmlFor="productName" className="text-[13.65px] mb-[6.5px] font-medium">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="productName"
                id="productName"
                placeholder="Product Name"
                className="w-full block my-[6.500px] py-[10.075px] px-[13px] border rounded-[0.475rem]"
                value={newProduct.productName}
                onChange={handleChange}
                required
              />
              <div className="text-[12.35px] text-[#99A1B7] font-normal">Set the product name.</div>
              {errors.productName && (
                <div className="text-red-500 text-sm mt-2">
                  {errors.productName}
                </div>
              )}
            </div>

            <div className="flex flex-col px-[29.250px] pb-[26px]">
              <label htmlFor="productDescription" className="text-[13.65px] mb-[6.5px] font-medium">
                Product Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="productDescription"
                id="productDescription"
                placeholder="Product Description"
                className="w-full block my-[6.500px] py-[10.075px] px-[13px] border rounded-[0.475rem]"
                value={newProduct.productDescription}
                onChange={handleChange}
                required
              />
              <div className="text-[12.35px] text-[#99A1B7] font-normal">Set the product description.</div>
              {errors.productDescription && (
                <div className="text-red-500 text-sm mt-2">
                  {errors.productDescription}
                </div>
              )}
            </div>

            <div className="flex flex-col px-[29.250px] pb-[26px]">
              <label htmlFor="productQuantity" className="text-[13.65px] mb-[6.5px] font-medium">
                Product Quantity <span className="text-red-500">*</span>
              </label>
              <input
                
                name="productQuantity"
                id="productQuantity"
                placeholder="Product Quantity"
                className="w-full block my-[6.500px] py-[10.075px] px-[13px] border rounded-[0.475rem]"
                value={newProduct.productQuantity}
                onChange={handleChange}
                required
              />
              <div className="text-[12.35px] text-[#99A1B7] font-normal">Set the product quantity.</div>
              {errors.productQuantity && (
                <div className="text-red-500 text-sm mt-2">
                  {errors.productQuantity}
                </div>
              )}
            </div>

            <div className="flex flex-col px-[29.250px] pb-[26px]">
              <label htmlFor="price" className="text-[13.65px] mb-[6.5px] font-medium">
                Price <span className="text-red-500">*</span>
              </label>
              <input
                
                step="0.01"
                name="price"
                id="price"
                placeholder="Price"
                className="w-full block my-[6.500px] py-[10.075px] px-[13px] border rounded-[0.475rem]"
                value={newProduct.price}
                onChange={handleChange}
                required
              />
              <div className="text-[12.35px] text-[#99A1B7] font-normal">Set the product price.</div>
              {errors.price && (
                <div className="text-red-500 text-sm mt-2">
                  {errors.price}
                </div>
              )}
            </div>

            <div className="flex flex-col px-[29.250px] pb-[26px]">
              <label htmlFor="categoryID" className="text-[13.65px] mb-[6.5px] font-medium">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="categoryID"
                id="categoryID"
                className="w-full block my-[6.500px] py-[10.075px] px-[13px] border rounded-[0.475rem]"
                value={newProduct.categoryID}
                onChange={handleChange}
                required
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category.categoryId} value={category.categoryId}>
                    {category.categoryName}
                  </option>
                ))}
              </select>
              <div className="text-[12.35px] text-[#99A1B7] font-normal">Select the product category.</div>
              {errors.categoryID && (
                <div className="text-red-500 text-sm mt-2">
                  {errors.categoryID}
                </div>
              )}
            </div>

            <div className="flex justify-end w-full lg:w-[860.100px] mt-4 mb-3 -ml-11">
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

export default AddProduct;
