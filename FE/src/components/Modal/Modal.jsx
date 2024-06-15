import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { ShopContext } from '../Context/ShopContext';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';

const Modal = ({ isOpen = false, onClose }) => {
  const { cartItems, products, removeFromCart, getTotalCartAmount, addToCart } = useContext(ShopContext);

  if (!isOpen) return null;

  return (
    <Transition show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        {/* Overlay */}
        <Transition.Child
          as={React.Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        {/* Modal Content */}
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={React.Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto relative w-screen max-w-md">
                  {/* Close Button */}
                  <Transition.Child
                    as={React.Fragment}
                    enter="ease-in-out duration-500"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-500"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute left-0 top-0 -ml-8 flex pr-2 pt-4 sm:-ml-10 sm:pr-4">
                      <button
                        type="button"
                        className="relative rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                        onClick={onClose}
                      >
                        <span className="absolute -inset-2.5" />
                        <span className="sr-only">Close panel</span>
                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>
                  </Transition.Child>

                  {/* Modal Content */}
                  <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                    <div className="px-4 sm:px-6">
                      <Dialog.Title className="text-base font-semibold leading-6 text-gray-900 border-spacing-4">Your Cart</Dialog.Title>
                    </div>

                    {/* Cart Items or No Products Message */}
                    {Object.keys(cartItems).length === 0 ? (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-gray-600">No products in the cart.</p>
                      </div>
                    ) : (
                      <div>
                        {/* List of Cart Items */}
                        <ul className="cart-items mt-4 space-y-4">
                          {Object.keys(cartItems).map((productId) => {
                            const product = products.find((p) => p.productId === parseInt(productId));
                            return (
                              <li key={productId} className="cart-item flex items-center justify-between">
                                <div className="item-details flex items-center space-x-4">
                                  <img
                                    width="80"
                                    height="80"
                                    src={product.picture}
                                    className="item-image"
                                    alt={product.productName}
                                  />
                                  <div className="item-info">
                                    <h6 className="item-title">
                                      <a href={product.url} className="text-sm font-medium text-gray-700">
                                        {product.productName}
                                      </a>
                                    </h6>
                                  </div>
                                </div>

                                {/* Quantity Adjustment */}
                                <div className="item-quantity flex items-center space-x-2 bg-white">
                                  <button
                                    className="quantity-button text-lg"
                                    onClick={() => addToCart(product.productId, -1)}
                                    disabled={cartItems[product.productId] <= 1}
                                  >
                                    −
                                  </button>
                                  <span>{cartItems[product.productId]}</span>
                                  <button
                                    className="quantity-button text-lg"
                                    onClick={() => addToCart(product.productId, 1)}
                                  >
                                    +
                                  </button>
                                </div>

                                {/* Item Price */}
                                <div className="item-price ml-2 text-sm font-semibold">${product.price}</div>

                                {/* Delete Button */}
                                <DeleteIcon className="cursor-pointer" onClick={() => removeFromCart(productId)} />
                              </li>
                            );
                          })}
                        </ul>

                        {/* Cart Totals */}
                        <div className="cart-totals mt-6">
                          <div className="totals-row flex justify-between text-sm text-gray-600">
                            <span>Subtotal</span>
                            <span className="font-semibold">${getTotalCartAmount()}</span>
                          </div>
                        </div>

                        {/* Footer */}
                        <footer className="modal-footer p-4 border-t">
                          <div className="footer-buttons flex space-x-4">
                            <Link
                              to="./cart"
                              className="view-cart-button text-sm px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                              onClick={onClose}
                            >
                              View Cart
                            </Link>
                          </div>
                        </footer>
                      </div>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
};

export default Modal;
