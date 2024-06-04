import React, { useState } from 'react'

export default function useFetchAPI(baseUrl) {
  const [products, setProducts] = useState([])

  React.useEffect(() => {
    fetchData()
    window.scrollTo({ top: 0, behavior: 'smooth' });
}, [baseUrl])

const fetchData = () => {
  fetch(baseUrl)
    .then(response => response.json())
    .then((data) => {
      setProducts(data)
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
};

  return { products }
}
