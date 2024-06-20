// eslint-disable-next-line no-unused-vars
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProductList from './ProductList';
import { ShopContext } from '../Context/ShopContext';
import { getAllProduct } from '../../api/apiService';

jest.mock('../../api/apiService');

// Mock the ShopContext
const mockAddToCart = jest.fn();

const renderComponent = (contextValue = {}) => {
  return render(
    <ShopContext.Provider value={{ addToCart: mockAddToCart, ...contextValue }}>
      <ProductList />
    </ShopContext.Provider>
  );
};

describe('ProductList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing and fetches default products', async () => {
    getAllProduct.mockResolvedValue([
      { productId: 1, productName: 'Product 1', price: 10, pictureName: 'img1.jpg' },
      { productId: 2, productName: 'Product 2', price: 20, pictureName: 'img2.jpg' },
    ]);

    renderComponent();

    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Product 1')).toBeInTheDocument();
      expect(screen.getByText('Product 2')).toBeInTheDocument();
    });
  });

  it('sorts products by price ascending', async () => {
    getAllProduct.mockResolvedValue([
      { productId: 1, productName: 'Product 1', price: 20, pictureName: 'img1.jpg' },
      { productId: 2, productName: 'Product 2', price: 10, pictureName: 'img2.jpg' },
    ]);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Product 1')).toBeInTheDocument();
      expect(screen.getByText('Product 2')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/sort options/i));
    fireEvent.click(screen.getByText(/sort by price: low to high/i));

    await waitFor(() => {
      const productNames = screen.getAllByText(/product/i).map((el) => el.textContent);
      expect(productNames).toEqual(['Product 2', 'Product 1']);
    });
  });

  it('adds product to cart', async () => {
    getAllProduct.mockResolvedValue([
      { productId: 1, productName: 'Product 1', price: 10, pictureName: 'img1.jpg' },
    ]);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Product 1')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /add to cart/i }));

    expect(mockAddToCart).toHaveBeenCalledWith(1, 1);
  });
});
