import React from 'react'
import { useUser } from '@auth0/nextjs-auth0/client';
const Dashboard = () => {
  const { user, error, isLoading } = useUser();
  return (
        <div className='bg-white w-full m-5 rounded-lg ml-0 p-5'>
          <div className='flex justify-between text-blue-900'>
            <p>
              Hello, <b>{user.name}</b>
            </p>
            <div className='flex gap-2 bg-gray-300 pr-2 rounded-lg overflow-hidden text-black'>
              <b>{user.name}</b>
            </div>
          </div>
        </div>
  )
}

export default Dashboard;