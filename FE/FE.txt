import React, { useState } from 'react';
import axios from 'axios';

const UpdateProduct = ({ product }) => {
  const [updatedProduct, setUpdatedProduct] = useState({
    pictureName: product.pictureName,
    productName: product.productName,
    productDescription: product.productDescription,
    productQuantity: product.productQuantity,
    price: product.price,
    categoryID: product.categoryID
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProduct(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`https://fpetspa.azurewebsites.net/api/products/${product.productId}`, updatedProduct);
      alert('Product updated successfully!');
      // Bạn có thể cập nhật danh sách sản phẩm sau khi cập nhật thành công
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product.');
    }
  };

  return (
    <div className="mt-4 p-4 bg-white shadow-md rounded-md">
    <h3 className="text-lg font-semibold mb-4">Update Product</h3>
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Picture Name</label>
        <input type="text" name="pictureName" value={updatedProduct.pictureName} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Product Name</label>
        <input type="text" name="productName" value={updatedProduct.productName} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea name="productDescription" value={updatedProduct.productDescription} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Quantity</label>
        <input type="number" name="productQuantity" value={updatedProduct.productQuantity} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Price</label>
        <input type="number" step="0.01" name="price" value={updatedProduct.price} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
      </div>
      <button type="submit" className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600">Update Product</button>
    </form>
  </div>
  );
}

export default UpdateProduct;
