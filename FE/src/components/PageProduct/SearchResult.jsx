// SearchResult.jsx
import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import Loading from '../Loading';

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const SearchResult = () => {
  const query = useQuery().get('query');
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      const response = await fetch(`https://localhost:7055/api/products?pageSize=100`);
      const data = await response.json();
      const filteredProducts = data.filter(product =>
        product.productName.toLowerCase().includes(query.toLowerCase())
      );
      setProducts(filteredProducts);
      setIsLoading(false);
    };

    if (query) {
      fetchProducts();
    } else {
      setIsLoading(false);
    }
  }, [query]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Search Results</h1>
      {isLoading ? (
        <Loading />
      ) : (
        products.length ? (
          <ul className="space-y-6">
            {products.map(product => (
              <li key={product.productId} className="flex items-center bg-white shadow-md rounded-lg p-4">
                <Link to={`/productdisplay/${product.productId}`}>
                  <img
                    src={product.pictureName}
                    alt={product.productName}
                    className="w-32 h-32 object-cover rounded-lg mr-6"
                  />
                </Link>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold mb-2">{product.productName}</h2>
                  <p className="text-gray-700 mb-2">{product.productDescription}</p>
                  <p className="text-gray-500 mb-2">Category: {product.categoryName}</p>
                  <p className="text-lg font-bold text-green-600">Price: ${product.price}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-lg text-gray-500">No products found</p>
        )
      )}
    </div>
  );
};

export default SearchResult;