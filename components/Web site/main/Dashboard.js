import React from 'react'
import { useSession } from 'next-auth/react'
const Dashboard = () => {
  const{data: session} = useSession()
  return (
        <div className='bg-white w-full m-5 rounded-lg ml-0 p-5'>
          <div className='flex justify-between text-blue-900'>
            <p>
              Hello, <b>{session?.user?.name}</b>
            </p>
            <div className='flex gap-2 bg-gray-300 pr-2 rounded-lg overflow-hidden text-black'>
              <b>{session?.user?.name}</b>
            </div>
          </div>
        </div>
  )
}

export default Dashboard;