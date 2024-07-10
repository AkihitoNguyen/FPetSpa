// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState, useContext } from 'react';
import { getAllProduct, getProductsByCategory } from '../../api/apiService';
import { ShopContext } from '../Context/ShopContext';
import { Link } from 'react-router-dom';
import '../PageProduct/ProductList.css';

const ProductList = () => {
  const [productList, setProductList] = useState([]);
  const [sortedProductList, setSortedProductList] = useState([]);
  const { addToCart } = useContext(ShopContext) || { addToCart: () => {} };
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortTitle, setSortTitle] = useState('Sort Options');
  
  
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 9;
  
  
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  useEffect(() => {
    const sortedList = [...productList];
    sortedList.sort((a, b) => a.price - b.price);
    sortDefault();
    setSortedProductList(sortedList);
  }, [productList]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let response;
        if (selectedCategories.length === 0) {
          response = await getAllProduct(); 
        } else {
          const promises = selectedCategories.map(category => getProductsByCategory({ category }));
          response = await Promise.all(promises).then(responses => responses.flat());
        }
        setProductList(response);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts(); 
  }, [selectedCategories]);
  

  const sortAscending = () => {
    const sortedList = [...sortedProductList];
    sortedList.sort((a, b) => a.price - b.price);
    setSortedProductList(sortedList);
    setSortTitle('Sort By Price: Low to High');
    resetPagination();
  };

  const sortDescending = () => {
    const sortedList = [...sortedProductList];
    sortedList.sort((a, b) => b.price - a.price);
    setSortedProductList(sortedList);
    setSortTitle('Sort By Price: High to Low');
    resetPagination();
  };

  const sortDefault = () => {
    setSortedProductList([...productList]);
    setSortTitle('Default Sorting');
    resetPagination();
  };

  const resetPagination = () => {
    setCurrentPage(1);
  };

  // Tính chỉ số sản phẩm hiển thị trên mỗi trang
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = sortedProductList.slice(indexOfFirstProduct, indexOfLastProduct);

  // Logic chuyển trang
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className=" mx-auto p-4">
      <div className="w-full mb-4">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Categories</label>
          <div className="relative mt-1">
            <button
              type="button"
              className="relative w-full cursor-default rounded-md border border-gray-300 bg-white pl-3 pr-10 py-2 text-left focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              {selectedCategories.length > 0 ? selectedCategories.join(', ') : 'Select Categories'}
            </button>
            {dropdownOpen && (
              <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {['Dog Food', 'Cat Food', 'Balo', 'Toy', 'Cat Shampoo', 'Dog Shampoo'].map((item, index) => (
                  <li
                    key={index}
                    className="cursor-default select-none relative py-2 pl-10 pr-4"
                    onClick={() => {
                      if (selectedCategories.includes(item)) {
                        setSelectedCategories(selectedCategories.filter(category => category !== item));
                      } else {
                        setSelectedCategories([...selectedCategories, item]);
                      }
                    }}
                  >
                    <span className={`block truncate ${selectedCategories.includes(item) ? 'font-medium' : 'font-normal'}`}>
                      {item}
                    </span>
                    {selectedCategories.includes(item) && (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <svg className="h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L7 13.586l-2.293-2.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l9-9a1 1 0 000-1.414z" clipRule="evenodd" />
                        </svg>
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="mt-4">
            <div className="flex items-center">
              <label className="mr-2">Sort:</label>
              <div className="relative">
                <button
                  type="button"
                  className="relative w-full cursor-default rounded-md border border-gray-300 bg-white pl-3 pr-10 py-2 text-left focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                >
                  {sortTitle}
                </button>
                {sortDropdownOpen && (
                  <ul className="absolute z-10 mt-1 w-full rounded-md bg-white py-1 text-base ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    <li className="cursor-default select-none relative py-2 pl-3 pr-9" onClick={sortDefault}>
                      Default Sort
                    </li>
                    <li className="cursor-default select-none relative py-2 pl-3 pr-9" onClick={sortDescending}>
                      Sort By Price: High to Low
                    </li>
                    <li className="cursor-default select-none relative py-2 pl-3 pr-9" onClick={sortAscending}>
                      Sort By Price: Low to High
                    </li>
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {currentProducts.length > 0 ? (
          currentProducts.map((product) => (
            <div key={product.productId} className="shadow-md rounded-lg overflow-hidden h-full flex flex-col">
              <div className="relative pb-5/4">
                <Link to={`/productdisplay/${product.productName}`}>
                  <img
                    src={product.pictureName}
                    alt={product.productName}
                    className="w-full h-full object-cover"
                  />
                </Link>
              </div>
              <div className="p-4 flex flex-col flex-grow justify-between">
                <div>
                  <h3 className="text-base font-bold text-gray-800">{product.productName}</h3>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-title">${product.price}</span>
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                    onClick={() => addToCart(product.productId, 1)}
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M17.72,5.011H8.026c-0.271,0-0.49,0.219-0.49,0.489c0,0.271,0.219,0.489,0.49,0.489h8.962l-1.979,4.773H6.763L4.935,5.343C4.926,5.316,4.897,5.309,4.884,5.286c-0.011-0.024,0-0.051-0.017-0.074C4.833,5.166,4.025,4.081,2.33,3.908C2.068,3.883,1.822,4.075,1.795,4.344C1.767,4.612,1.962,4.853,2.231,4.88c1.143,0.118,1.703,0.738,1.808,0.866l1.91,5.661c0.066,0.199,0.252,0.333,0.463,0.333h8.924c0.116,0,0.22-0.053,0.308-0.128c0.027-0.023,0.042-0.048,0.063-0.076c0.026-0.034,0.063-0.058,0.08-0.099l2.384-5.75c0.062-0.151,0.046-0.323-0.045-0.458C18.036,5.092,17.883,5.011,17.72,5.011z"></path>
                      <path d="M8.251,12.386c-1.023,0-1.856,0.834-1.856,1.856s0.833,1.853,1.856,1.853c1.021,0,1.853-0.83,1.853-1.853S9.273,12.386,8.251,12.386z M8.251,15.116c-0.484,0-0.877-0.393-0.877-0.874c0-0.484,0.394-0.878,0.877-0.878c0.482,0,0.875,0.394,0.875,0.878C9.126,14.724,8.733,15.116,8.251,15.116z"></path>
                      <path d="M13.972,12.386c-1.022,0-1.855,0.834-1.855,1.856s0.833,1.853,1.855,1.853s1.854-0.83,1.854-1.853S14.994,12.386,13.972,12.386z M13.972,15.116c-0.484,0-0.878-0.393-0.878-0.874c0-0.484,0.394-0.878,0.878-0.878c0.482,0,0.875,0.394,0.875,0.878C14.847,14.724,14.454,15.116,13.972,15.116z"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="w-full flex justify-center items-center">
            <div className="w-64">
              <div className="animate-pulse">
                <div className="h-32 bg-gray-200 rounded-md"></div>
                <div className="mt-2 h-6 bg-gray-200 rounded-md"></div>
                <div className="mt-2 h-6 bg-gray-200 rounded-md"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-center mt-6">
        <nav className="relative z-0 inline-flex shadow-sm -space-x-px" aria-label="Pagination">
          {Array.from({ length: Math.ceil(sortedProductList.length / productsPerPage) }, (_, i) => (
            <button
              key={i}
              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                currentPage === i + 1 ? 'bg-indigo-50 border-indigo-500 text-indigo-600' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
              }`}
              onClick={() => paginate(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default ProductList;
