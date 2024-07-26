import axios from '../utils/axiosClient';

export const getAllProduct = () => {
  return axios.get(`/products?pageSize=100`);
};


export const getSearchProduct = async ({ product = '' }) => {
  const response = await fetch(`https://666110b863e6a0189fe85550.mockapi.io/Product?productName=${product}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const getProductsByCategory = async ({ category = '' }) => {
  const response = await axios.get(`https://localhost:7055/api/products?pageSize=100&categoryName=${category}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const getProductById = async ({ productId = '' }) => {
  const response = await fetch(`https://localhost:7055/api/products/SearchById?id=${productId}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};


// https://localhost:7055/api/products/SearchById?id=${id}
export const getProductName = async ({ productName = '' }) => {
  const response = await fetch(`https://localhost:7055/api/products?productName=${productName}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};



export const getCartById = async ({ cartId='', productId='' }) => {
  const response = await fetch(`https://localhost:7055/api/CartDetail/Getbyid?cartId=${cartId}&productId=${productId}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};



export const getCartByUserId = async (userId) => {
  const response = await fetch(`https://localhost:7055/api/CartDetail/GetById?userId=${userId}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};


export const getOrderSearch = async (customeriD)=>{
  const response = await fetch(`https://localhost:7055/api/Order/OrderSearch?CustomeriD=${customeriD}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};
