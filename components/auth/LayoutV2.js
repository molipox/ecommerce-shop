"use client"
import Image from "next/image";
import { useSession, signIn, signOut } from "next-auth/react";
export default function LayoutV2({children}) {
  const { data: session} = useSession();
  if(!session){
    return (
    
      <main className="bg-white h-screen flex justify-center items-center">
        <div>
          <button className="bg-black text-white px-12 py-3 rounded-2xl" onClick={() => {signIn("google")}}>
            sign in
          </button>
        </div>
      </main>
      
    );
  }
  return (
  
    <main className="bg-blue-900">
          {children}
    </main>
  )
  
}