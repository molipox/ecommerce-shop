"use client"
import React from 'react'
import LayoutV2 from '@/components/auth/LayoutV2'
import Nav from '@/components/Web site/navBar/Nav'
import NewContent from '@/components/Web site/main/ProductsContent/NewContent'
const page = () => {
  return (
    <LayoutV2>
      <div className="flex">
        <Nav/>
        <NewContent/>
      </div>
    </LayoutV2>
  )
}

export default page