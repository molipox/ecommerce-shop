import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { OrbitProgress } from 'react-loading-indicators';
const ProductsContent = () => {
  console.log("i rendered");
  const [products, setProducts] = useState([]);
  const [fetched,setFetched] = useState(false);
  const[hidden,setHidden] = useState("");
  useEffect(() => {
    axios("/api/ProductsGet")
    .then((response) => {
      setProducts(response.data);
      console.log(response.data);
      setFetched(true);
      setHidden("hidden");
    })
    .catch((error) => {
      console.error('Error fetching products:', error);
    });
  }, [])
      
  return (
    <div className='bg-white w-full m-5 rounded-lg ml-0 p-5'>
      <Link href={"/products/new"} className='text-white bg-blue-900 rounded-md px-2 py-1'>
        Add New Product
      </Link>
      <p className='mt-8 py-3 px-2 rounded-t-lg bg-blue-300'>Products Name</p>
      <div className={`flex mt-52 justify-center ${hidden}`}>
        {fetched === false ? (
                  <OrbitProgress color="#1e3a8a" size="medium" text="" textColor="" />
        ):(
          <div></div>
        )}
        
      
        
      </div>
        <div>
          { products.map((product) =>
                (
                 <div key={product._id} className='border flex justify-between py-2 px-2'>
                  <p>{product.title}</p>
                  <div className='text-white text-[15px] flex gap-3'>
                    <Link href={`/products/edit/${product._id}`} className='flex py-1 px-3 rounded-lg items-center gap-1 bg-blue-900'>
                    <i class='bx bxs-pencil'></i>
                    <p>Edit</p>
                    </Link>
                    <Link href={{pathname:`/products/delete/${product._id}/${product.title}`}} className='flex py-1 px-2 rounded-lg items-center gap-1 bg-blue-900'>
                    <i class='bx bxs-trash'></i>
                    <p>Delete</p>
                    </Link>
                  </div>
                 </div>
                )
          )}
        </div>
    </div>
  );
}

export default ProductsContent;
