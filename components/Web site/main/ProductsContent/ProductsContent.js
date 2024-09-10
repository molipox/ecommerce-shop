import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const ProductsContent = () => {
  return (
    <div className='bg-white w-full m-5 rounded-lg ml-0 p-5'>
        <Link href={"/products/new"} className='text-white bg-blue-900 rounded-md px-2 py-1'>
          Add New Product
        </Link>
    </div>
    
  )
}

export default ProductsContent