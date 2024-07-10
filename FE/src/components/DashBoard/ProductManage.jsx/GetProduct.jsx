import React, {  useEffect, useState } from "react";
import axios from "axios";
import { LazyLoadImage } from "react-lazy-load-image-component";
import UpdateProduct from "./UpdateProduct";
import "react-lazy-load-image-component/src/effects/blur.css";

const GetProduct = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const productsPerPage = 3;

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://fpetspa.azurewebsites.net/api/products?pageSize=100"
      );
      setProducts(response.data);
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

  const handleRemove = (productId) => {
    alert(`Remove product ${productId}`);
  };

  const closeModal = () => {
    setSelectedProduct(null);
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
      <h2 className="text-2xl font-bold mb-4">Danh sách sản phẩm</h2>
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
        <div>
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ảnh
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tên sản phẩm
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Loại
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mô tả
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Số lượng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Giá
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hành động
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.categoryName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {product.productDescription}
                  </td>
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
                      Cập nhật
                    </button>
                    <button
                      onClick={() => handleRemove(product.productId)}
                      className="ml-2 text-red-600 hover:text-red-900">
                      Xóa
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
      
      {showModal && selectedProduct && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true">
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <UpdateProduct
                  product={selectedProduct}
                  closeModal={closeModal}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GetProduct;
