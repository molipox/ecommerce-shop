import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProductsContent = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Added loading state

  const apiUrl = '/api/products'; // Ensure this URL is correct

  useEffect(() => {
    // Fetch products from API
    axios.get(apiUrl)
      .then(response => {
        setProducts(response.data); // Update state with fetched products
        setLoading(false); // Set loading to false after data is fetched
      })
      .catch(error => {
        setError(error.message); // Set error message if something goes wrong
        setLoading(false); // Set loading to false on error
        console.error('Error:', error);
      });
  }, [apiUrl]); // Empty dependency array means this effect runs once on mount

  return (
    <div className='bg-white w-full m-5 rounded-lg ml-0 p-5'>
      <Link href={"/products/new"} className='text-white bg-blue-900 rounded-md px-2 py-1'>
        Add New Product
      </Link>
      <div>
        {loading ? (
          <p>Loading...</p> // Display loading state
        ) : error ? (
          <p className='text-red-500'>{error}</p> // Display error message if any
        ) : products.length > 0 ? (
          <ul>
            {products.map((product, index) => (
              <li key={index}>
                {/* Replace these fields with the actual fields of your product */}
                <h2>{product.title}</h2>
                <p>{product.description}</p>
                {/* Add other product details here */}
              </li>
            ))}
          </ul>
        ) : (
          <p>No products found</p>
        )}
      </div>
    </div>
  );
}

export default ProductsContent;
