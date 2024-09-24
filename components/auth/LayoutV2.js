"use client";
import { useUser } from '@auth0/nextjs-auth0/client';
import { TrophySpin } from 'react-loading-indicators';

export default function LayoutV2({ children }) {
  const { user, error, isLoading } = useUser();
  
  if (isLoading) return <div className='h-screen flex justify-center items-center '><TrophySpin color="#1e3a8a" size="medium" text="" textColor="" /></div>;
  if (error) return <div>{error.message}</div>;
  if (!user) {
    return (
      <main className="bg-white h-screen flex justify-center items-center">
        <div>
          <a
            href="/api/auth/login"
            className="bg-blue-900 text-white px-12 py-3 rounded-2xl"
          >
            Sign In
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-blue-900">
      <div>
      </div>
      {children}
    </main>
  );
}

