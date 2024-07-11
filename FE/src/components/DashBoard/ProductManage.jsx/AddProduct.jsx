import React, { useState } from 'react';
import axios from 'axios';

const AddProduct = () => {
  const [newProduct, setNewProduct] = useState({
    pictureName: '',
    productName: '',
    productDescription: '',
    productQuantity: 0,
    price: 0,
    categoryID: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProduct(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://fpetspa.azurewebsites.net/api/products', newProduct);
      alert('Product added successfully!');
      // Reset the form after successful submission
      setNewProduct({
        pictureName: '',
        productName: '',
        productDescription: '',
        productQuantity: 0,
        price: 0,
        categoryID: ''
      });
      // You can update the product list after adding the new product
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product.');
    }
  };

  return (
    <div className="mt-4 p-4 bg-white shadow-md rounded-md">
      <h3 className="text-lg font-semibold mb-4">Add Product</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Picture Name</label>
          <input type="text" name="pictureName" value={newProduct.pictureName} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Product Name</label>
          <input type="text" name="productName" value={newProduct.productName} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea name="productDescription" value={newProduct.productDescription} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Quantity</label>
          <input type="number" name="productQuantity" value={newProduct.productQuantity} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Price</label>
          <input type="number" step="0.01" name="price" value={newProduct.price} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>
        <button type="submit" className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600">Add Product</button>
      </form>
    </div>
  );
}

export default AddProduct;
