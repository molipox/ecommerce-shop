"use client"
import React from 'react'
import LayoutV2 from '@/components/auth/LayoutV2'
import Nav from '@/components/Web site/navBar/Nav'
import DeleteContent from '@/components/Web site/main/ProductsContent/DeleteContent'
const page = () => {
  return (
    <LayoutV2>
      <div className="flex">
        <Nav/>
        <DeleteContent/>
      </div>
    </LayoutV2>
  )
}

export default page