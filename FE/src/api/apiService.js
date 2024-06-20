import axios from '../utils/axiosClient';

export const getAllProduct = () => {
  return axios.get(`https://fpetspa.azurewebsites.net/api/products?pageSize=100`);
};

export const getSearchProduct = async ({ product = '' }) => {
  const response = await fetch(`https://666110b863e6a0189fe85550.mockapi.io/Product?productName=${product}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const getProductsByCategory = async ({ category = '' }) => {
  const response = await fetch(`https://fpetspa.azurewebsites.net/api/products?pageSize=100&categoryName=${category}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const getProductById = async (id = '') => {
  const url = id 
    ? `https://fpetspa.azurewebsites.net/api/products/${id}` 
    : 'https://fpetspa.azurewebsites.net/api/products?pageSize=100';
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return response.json();
};

export const getProductName = async ({ productName = '' }) => {
  const response = await fetch(`https://fpetspa.azurewebsites.net/api/products?productName=${productName}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};
