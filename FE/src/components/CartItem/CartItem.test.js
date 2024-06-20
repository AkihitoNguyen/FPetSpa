// CartItems.test.js
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ShopContext } from '../Context/ShopContext';
import CartItems from '../CartItem/CartItem';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

const mockProducts = [
  {
    productId: 1,
    productName: 'Product 1',
    price: 10,
    pictureName: 'product1.jpg',
  },
  {
    productId: 2,
    productName: 'Product 2',
    price: 20,
    pictureName: 'product2.jpg',
  },
];

const mockCartItems = {
  1: 2,
  2: 1,
};

const mockContextValue = {
  getTotalCartAmount: jest.fn(() => 40),
  products: mockProducts,
  cartItems: mockCartItems,
  removeFromCart: jest.fn(),
  addToCart: jest.fn(),
};

describe('CartItems Component', () => {
  beforeEach(() => {
    useSelector.mockImplementation((callback) =>
      callback({ auth: { login: { currentUser: true } } })
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders CartItems component', () => {
    render(
      <ShopContext.Provider value={mockContextValue}>
        <BrowserRouter>
          <CartItems />
        </BrowserRouter>
      </ShopContext.Provider>
    );

    expect(screen.getByText('Shopping Cart')).toBeInTheDocument();
  });

  test('renders products in the cart', () => {
    render(
      <ShopContext.Provider value={mockContextValue}>
        <BrowserRouter>
          <CartItems />
        </BrowserRouter>
      </ShopContext.Provider>
    );

    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.getByText('Product 2')).toBeInTheDocument();
  });

  test('addToCart function when increment button is clicked', () => {
    render(
      <ShopContext.Provider value={mockContextValue}>
        <BrowserRouter>
          <CartItems />
        </BrowserRouter>
      </ShopContext.Provider>
    );

    const incrementButton = screen.getAllByText('+')[0];
    fireEvent.click(incrementButton);

    expect(mockContextValue.addToCart).toHaveBeenCalledWith(1, 1);
  });

  test('removeFromCart function when delete icon is clicked', () => {
    render(
      <ShopContext.Provider value={mockContextValue}>
        <BrowserRouter>
          <CartItems />
        </BrowserRouter>
      </ShopContext.Provider>
    );

    const deleteIcon = screen.getAllByTestId('DeleteIcon')[0];
    fireEvent.click(deleteIcon);

    expect(mockContextValue.removeFromCart).toHaveBeenCalledWith(1);
  });

  test('displays login prompt when user is not logged in', () => {
    useSelector.mockImplementation((callback) =>
      callback({ auth: { login: { currentUser: false } } })
    );

    render(
      <ShopContext.Provider value={mockContextValue}>
        <BrowserRouter>
          <CartItems />
        </BrowserRouter>
      </ShopContext.Provider>
    );

    expect(screen.getByText('Please Login to proceed with payment.')).toBeInTheDocument();
  });
});
