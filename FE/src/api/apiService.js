import axios from '../utils/axiosClient';

// const getAllServices = () =>{
//     return axios.get('/api/services');
// }
export const getAllProduct = () => {
  return axios.get(`https://666110b863e6a0189fe85550.mockapi.io/Product`);
};

// const getProductsByCategory = (categoryName) => {
//   return axios.get(`https://666110b863e6a0189fe85550.mockapi.io/Product?categoryName=${categoryName}`);

// };


export const getSearchProduct = async ({ product = '' }) => {
  const response = await fetch(`hhttps://666110b863e6a0189fe85550.mockapi.io/Product?productName=${product}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const getProductsByCategory= async ({ category = '' }) => {
  const response = await fetch(`https://666110b863e6a0189fe85550.mockapi.io/Product?&categoryName=${category}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};
// export const getAllProduct= async () => {
//   const response = await fetch('https://666110b863e6a0189fe85550.mockapi.io/Product');
//   if (!response.ok) {
//     throw new Error('Network response was not ok');
//   }
//   return response.json();
// };

export const getProductById = async (productId = '') => {
  const url = productId 
    ? `https://666110b863e6a0189fe85550.mockapi.io/Product?productId=${productId}` 
    : 'https://666110b863e6a0189fe85550.mockapi.io/Product';
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const getProductName = async ({ productName = '' }) => {
  const response = await fetch(`https://666110b863e6a0189fe85550.mockapi.io/Product?productName=${productName}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

  




