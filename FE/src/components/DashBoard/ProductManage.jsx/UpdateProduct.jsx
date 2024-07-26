import React, { useState } from 'react';
import axios from 'axios';
import { assets } from '../../../assets/assets';
import { toast, ToastContainer } from 'react-toastify';

const UpdateProduct = ({ product, closeModal, onUpdate }) => {
  const [updatedProduct, setUpdatedProduct] = useState({
    productId: product.productId,
    productQuantity: product.productQuantity,
    price: product.price,
    pictureName: product.pictureName,
    productName: product.productName,
    productDescription: product.productDescription,
    categoryName: product.categoryName,
  });

  const [thumbnailUrl, setThumbnailUrl] = useState(product.pictureName || assets.avatar);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProduct((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    validateField(name, value);
  };

  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case 'productQuantity':
        if (!/^\d+$/.test(value)) {
          newErrors.productQuantity = 'Product Quantity should be a valid integer number';
        } else {
          newErrors.productQuantity = null;
        }
        break;
      case 'price':
        if (!/^\d+(\.\d{1,2})?$/.test(value)) {
          newErrors.price = 'Price should be a valid number with up to two decimal places';
        } else {
          newErrors.price = null;
        }
        break;
      default:
        break;
    }

    setErrors(newErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const formData = new FormData();
    formData.append('productQuantity', updatedProduct.productQuantity);
    formData.append('price', updatedProduct.price);

    try {
      await axios.put(`https://localhost:7055/api/products/${product.productId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Product updated successfully!');
      onUpdate(updatedProduct);
      closeModal();
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product.');
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!/^\d+$/.test(updatedProduct.productQuantity)) {
      newErrors.productQuantity = 'Product Quantity should be a valid integer number';
    }

    if (!/^\d+(\.\d{1,2})?$/.test(updatedProduct.price)) {
      newErrors.price = 'Price should be a valid number with up to two decimal places';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div className="bg-[#FCFCFC] p-4 md:p-6 lg:p-8">
      <h1 className="text-[17.55px] font-semibold mb-4">Update Product</h1>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex flex-col gap-4 w-full lg:w-1/3 mb-4">
          <div className="bg-white p-4 border rounded-md shadow-sm">
            <h2 className="text-lg font-semibold mb-2">Thumbnail</h2>
            <div className="flex flex-col items-center">
              <img
                src={thumbnailUrl}
                alt="Thumbnail"
                className="w-40 h-40 border rounded-md shadow-sm"
              />
              <p className="text-sm text-gray-500 mt-2 text-center">
                Product thumbnail image. Only *.png, *.jpg and *.jpeg image files are accepted.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 border rounded-md shadow-sm w-full lg:w-2/3">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="productName">
                Product Name
              </label>
              <input
                type="text"
                name="productName"
                id="productName"
                className="w-full border rounded-md shadow-sm p-2"
                value={updatedProduct.productName}
                disabled
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="productDescription">
                Product Description
              </label>
              <textarea
                name="productDescription"
                id="productDescription"
                className="w-full border rounded-md shadow-sm p-2"
                value={updatedProduct.productDescription}
                disabled
              ></textarea>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="productQuantity">
                Product Quantity <span className="text-red-500">*</span>
              </label>
              <input
                
                name="productQuantity"
                id="productQuantity"
                placeholder="Product Quantity"
                className="w-full border rounded-md shadow-sm p-2"
                value={updatedProduct.productQuantity}
                onChange={handleChange}
                required
              />
              <p className="text-xs text-gray-500 mt-1">Set the product quantity.</p>
              {errors.productQuantity && (
                <div className="text-red-500 text-sm mt-2">
                  {errors.productQuantity}
                </div>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="price">
                Price <span className="text-red-500">*</span>
              </label>
              <input
                
                step="0.01"
                name="price"
                id="price"
                placeholder="Price"
                className="w-full border rounded-md shadow-sm p-2"
                value={updatedProduct.price}
                onChange={handleChange}
                required
              />
              <p className="text-xs text-gray-500 mt-1">Set the product price.</p>
              {errors.price && (
                <div className="text-red-500 text-sm mt-2">
                  {errors.price}
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default UpdateProduct;
