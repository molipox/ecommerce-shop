"use client"
import React from 'react'
import LayoutV2 from '@/components/auth/LayoutV2'
import Nav from '@/components/Web site/navBar/Nav'
import OrdersContent from '@/components/Web site/main/OrdersContent'
const Orders = () => {
    return(
      <LayoutV2>
        <div className='flex'>
          <Nav/>
          <OrdersContent/>
        </div>
      </LayoutV2>
    )
}

export default Orders;