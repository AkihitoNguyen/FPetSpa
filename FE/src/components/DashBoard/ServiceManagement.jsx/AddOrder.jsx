import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const AddOrder = () => {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]); // State để lưu các sản phẩm đã chọn
  const [totalCost, setTotalCost] = useState(0); // State để lưu tổng giá của các sản phẩm đã chọn
  const { orderId } = useParams();

  useEffect(() => {
    // Fetch products or any necessary data based on orderId
    axios.get(`https://fpetspa.azurewebsites.net/api/Order/OrderSearch`, {
      params: {
        orderId: orderId
      }
    })
    .then(response => {
      // Handle response and set products
      // Adjust this part based on the actual response structure
      setProducts(response.data.products || []); // Assuming response.data.products contains the list of products
    })
    .catch(error => {
      // Handle error
      console.error('Error fetching products:', error);
    });
  }, [orderId]);
  

  // Hàm fetch dữ liệu sản phẩm từ API
  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://fpetspa.azurewebsites.net/api/products?pageSize=100"
      );
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Gọi hàm fetchData khi component được mount lần đầu
  useEffect(() => {
    fetchData();
  }, []);

  const handleCheckboxChange = (productId) => {
    const index = selectedProducts.indexOf(productId);
    if (index === -1) {
      setSelectedProducts([...selectedProducts, productId]);
    } else {
      setSelectedProducts(selectedProducts.filter((id) => id !== productId));
    }
  };

  useEffect(() => {
    let total = 0;
    selectedProducts.forEach((productId) => {
      const selectedProduct = products.find(
        (item) => item.productId === productId
      );
      if (selectedProduct) {
        total += selectedProduct.price;
      }
    });
    setTotalCost(total);
  }, [selectedProducts, products]);

  const handleSaveChanges = async () => {
    try {
      const payload = {
        orderId: orderId, // This will be used in the URL
        products: Array.from(selectedProducts).map((productId) => ({
          productId: productId,
          quantity: 1,
          discount: 0.0,
        })),
      };
  
      const productList = payload.products.map((product) => ({
        ...product,
        quantity: Number(product.quantity),
        discount: Number(product.discount),
      }));
  
      const response = await axios.post(
        `https://fpetspa.azurewebsites.net/api/Order/AddMANYProductToServicesBooking?orderId=${payload.orderId}`,
        productList,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      console.log("Response from server:", response.data);
      const paymentUrl = response.data;

      if (paymentUrl) {
        window.location.href = paymentUrl;  
      } else {
        console.error("Không tìm thấy URL thanh toán trong phản hồi");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error saving data:", error);
      if (error.response) {
        console.error("Server Response:", error.response.data);
      } else if (error.request) {
        console.error("Request Data:", error.request);
      } else {
        console.error("Error Message:", error.message);
      }
    }
  };

  return (
    <div className="">
      {/* Header */}


      {/* Main Content */}
      <div className="pl-[80px] mt-6 ">
        <div className="flex gap-9">
          {/* Right Panel */}
          <div className="flex w-[1000px] border py-4 rounded-md shadow-md">
            <div className="w-[925px] px-[29.250px]">
              <div className="my-[6.5px] h-[57px]">
                <h2 className="text-[19.5px] font-semibold">Select Products</h2>
              </div>
              <div className="block">
                <label htmlFor="" className="text-[13.65px] font-medium">
                  Add products to this order
                </label>
                <br />
                {/* Hiển thị danh sách sản phẩm đã chọn */}

                {selectedProducts.length > 0 ? (
                  <div className="flex flex-wrap gap-4 pb-[3.250px] mb-[16.250px]">
                    {selectedProducts.map((productId) => {
                      const selectedProduct = products.find(
                        (item) => item.productId === productId
                      );
                      return (
                        <div key={productId} className="flex">
                          <img
                            src={selectedProduct.pictureName}
                            alt={selectedProduct.productName}
                            className="w-12 bg-[#f9f9f9]"
                          />
                          <div className="ml-[16.25px]">
                            <div className="text-sm font-semibold">
                              {selectedProduct.productName}
                            </div>
                            <div className="text-[12.35px] text-[#071437] font-medium">
                              Price: ${selectedProduct.price}
                            </div>
                            <div className="text-[12.35px] text-[#78829D] font-medium">
                              SKU: {orderId}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="mx-[-9.75px] mb-[16.250px] px-[6.500px] pt-[9.750px] pb-[3.250px]">
                    <span className="text-[13px] text-[#99A1B7] font-normal">
                      Select one or more products from the list below by ticking
                      the checkbox.
                    </span>
                  </div>
                )}

                <div className="text-[16.25px] font-semibold">
                  Total Cost: ${totalCost.toFixed(2)}
                </div>
              </div>
              <hr className="bg-stone-50 w-[865px]" />

              {/* Search Products */}
              <div>
                <input
                  type="text"
                  placeholder="Search Products"
                  className="inline-flex items-center justify-between w-[400.5px] h-[41.57px] px-[39px] py-[10.075px] rounded-md text-[#99A1B7] outline-none bg-[#F9F9F9] text-sm font-medium hover:bg-[#F1F1F4]"
                />
              </div>

              {/* Products List */}
              <div className="w-full">
                <table className="w-full">
                  {/* Table Header */}
                  <thead>
                    <tr>
                      <th className="w-[20.141px] h-[10px] py-[16.25px] pr-[9.75px]"></th>
                      <th className="min-w-[250px] text-left text-[12.35px] font-semibold text-[#99A1B7] py-[16.25px]">
                        PRODUCT
                      </th>
                      <th className="min-w-[100px] text-right text-[12.35px] font-semibold text-[#99A1B7] px-[9.75px] py-[16.25px]">
                        QTY REMAINING
                      </th>
                    </tr>
                  </thead>
                </table>
                <div className=" overflow-y-auto custom-scrollbar">
                  <style jsx>{`
                    .custom-scrollbar::-webkit-scrollbar {
                      width: 7px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb {
                      background-color: #f1f1f4;
                      border-radius: 1px;
                    }
                  `}</style>
                  <table className="w-full">
                    {/* Table Body */}
                    <tbody>
                      {products.map((item) => (
                        <tr key={item.productId}>
                          <td className="w-[20.141px] py-[16.25px] pr-[9.75px]">
                            <input
                              type="checkbox"
                              className="form-checkbox h-5 w-5 bg-[#f1f1f4]"
                              onChange={() =>
                                handleCheckboxChange(item.productId)
                              } // Gọi hàm xử lý khi thay đổi checkbox
                            />
                          </td>
                          <td className="text-[14.95px] text-[#252f4a] font-semibold py-[16.25px] px-[9.75px]">
                            <div className="flex items-center">
                              <div className="">
                                <a href="#" className="cursor-pointer">
                                  <span>
                                    <img
                                      src={item.pictureName}
                                      alt={item.productName}
                                      className="w-12 bg-[#f9f9f9]"
                                    />
                                  </span>
                                </a>
                              </div>
                              <div className="ml-[16.25px]">
                                <a href="" className="text-[14.95px]">
                                  {item.productName}
                                </a>
                                <div>
                                  <span className="text-[12.35px] text-[#78829D] font-medium">
                                    Price: ${item.price}
                                  </span>
                                </div>
                                <div className="text-[12.35px] text-[#78829D] font-medium">
                                  SKU: {item.productId}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="text-right text-[14.95px] text-[#77829D] py-2 pr-3">
                            {item.productQuantity}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-start mt-4">
          <button
            className="flex items-center justify-center h-[40.3906px] px-[20.5px] py-[11.075px] text-[13.2px] font-medium text-white bg-[#1B84FF] rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={handleSaveChanges} // Gọi hàm xử lý khi nhấn nút "Save Changes"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddOrder;
