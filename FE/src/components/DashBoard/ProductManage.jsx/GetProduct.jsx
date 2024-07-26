import axios from "axios";
import { LazyLoadImage } from "react-lazy-load-image-component";
import UpdateProduct from "./UpdateProduct";
import "react-lazy-load-image-component/src/effects/blur.css";
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DeleteIcon from '@mui/icons-material/Delete';
import UpdateIcon from '@mui/icons-material/Update';
import ViewIcon from '@mui/icons-material/Visibility';

const GetProduct = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const productsPerPage = 4;

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://localhost:7055/api/products?pageSize=100"
      );

      const sortedProducts = response.data.sort((a, b) => {
        const aNumber = parseInt(a.productId.replace(/[^\d]/g, ''), 10);
        const bNumber = parseInt(b.productId.replace(/[^\d]/g, ''), 10);
        return aNumber - bNumber;
      });

      setProducts(sortedProducts);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdate = (productId) => {
    const productToUpdate = products.find(
      (product) => product.productId === productId
    );
    setSelectedProduct(productToUpdate);
    setShowModal(true);
  };

  const handleRemove = async (productId) => {
    const confirmed = window.confirm("Are you sure you want to delete this product?");
    if (!confirmed) return;

    try {
      await axios.delete(`https://localhost:7055/api/products/${productId}`);
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.productId !== productId)
      );
      toast.success('Product removed successfully!');
    } catch (error) {
      console.error("Error removing product:", error);
      toast.error('Failed to remove product.');
    }
  };

  const handleViewDetail = (productId) => {
    const productToView = products.find(
      (product) => product.productId === productId
    );
    setSelectedProduct(productToView);
    setShowDetailModal(true);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setShowModal(false);
    setShowDetailModal(false);
  };

  const handleProductUpdate = (updatedProduct) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.productId === updatedProduct.productId ? updatedProduct : product
      )
    );
    setShowModal(false);
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">List Product</h2>
      </div>
      {loading ? (
        <div className="bg-white rounded shadow p-6 w-full max-w-xl mx-auto">
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-gray-200 h-16 w-16"></div>
            <div className="flex-1 space-y-4 py-1">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Picture 
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product 
                </th>
                {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th> */}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.map((product) => (
                <tr key={product.productId} className="border-b border-gray-200">
                  <td className="px-6 py-4">
                    <div className="h-16 w-16 rounded-full overflow-hidden">
                      <LazyLoadImage
                        src={product.pictureName}
                        alt={product.productName}
                        effect="blur"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {product.productName}
                  </td>
                  {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.categoryName}
                  </td> */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.productQuantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${product.price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleUpdate(product.productId)}
                      className="text-indigo-600 hover:text-indigo-900">
                      <UpdateIcon/> /
                    </button>
                    <button
                      onClick={() => handleRemove(product.productId)}
                      className="ml-2 text-red-600 hover:text-red-900">
                      <DeleteIcon/> /
                    </button>
                    <button
                      onClick={() => handleViewDetail(product.productId)}
                      className="ml-2 text-blue-600 hover:text-blue-900">
                      <ViewIcon />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-center mt-6">
            <nav
              className="relative z-0 inline-flex shadow-sm -space-x-px"
              aria-label="Pagination">
              {Array.from(
                { length: Math.ceil(products.length / productsPerPage) },
                (_, i) => (
                  <button
                    key={i}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      currentPage === i + 1
                        ? "bg-indigo-50 border-indigo-500 text-indigo-600"
                        : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                    }`}
                    onClick={() => paginate(i + 1)}>
                    {i + 1}
                  </button>
                )
              )}
            </nav>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

            <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all max-w-6xl w-full mx-auto">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">            
                    <UpdateProduct
                      product={selectedProduct}
                      closeModal={closeModal}
                      onUpdate={handleProductUpdate}
                    />
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={closeModal}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDetailModal && selectedProduct && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

            <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all max-w-6xl w-full mx-auto">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Product Details
                    </h3>
                    <div className="mt-2">
                    <div className="mt-4">
                        <img src={selectedProduct.pictureName} alt={selectedProduct.productName} className="w-64 h-64 object-cover ml-96 " />
                      </div>
                      <p><strong>Product Name:</strong> {selectedProduct.productName}</p>
                      <p><strong>Category:</strong> {selectedProduct.categoryName}</p>
                      <p><strong>Quantity:</strong> {selectedProduct.productQuantity}</p>
                      <p><strong>Price:</strong> ${selectedProduct.price}</p>
                      <p><strong>Description:</strong> {selectedProduct.productDescription}</p>
                      
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={closeModal}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default GetProduct;
