import React from 'react'
import { redirect, usePathname, useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
const DeleteContent = () => {
    const router = useRouter();
    const path = usePathname();
    const pathquery = path.split('/');
    const title = pathquery[4];
    const id = pathquery[3];
    async function handleYes(){
        await axios.delete(`/api/ProductDelete/${id}`);
        router.push("/products")
    }
    async function handleNo(){
        router.push("/products");
    }
  return (
    <div className=' flex-col flex gap-5 justify-center items-center bg-white w-full m-5 rounded-lg ml-0 p-5'>
      <p className='font-bold block text-blue-900 text-[30px]'>Are you sur you want to delete {title}</p>
      <div className='flex gap-2'>
        <button className='px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600'  onClick={handleYes}>Delete</button>
        <button className='px-4 py-2 ml-2 text-white bg-gray-500 rounded-md hover:bg-gray-600' onClick={handleNo}>Cancel</button>
      </div>
    </div>
  )
}

export default DeleteContent