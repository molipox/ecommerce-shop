"use client"
import React from 'react'
import LayoutV2 from '@/components/auth/LayoutV2'
import Nav from '@/components/Web site/navBar/Nav'
import EditContent from '@/components/Web site/main/ProductsContent/EditContent'
const page = () => {
  return (
    <LayoutV2>
      <div className="flex">
        <Nav/>
        <EditContent/>
      </div>
    </LayoutV2>
  )
}

export default page