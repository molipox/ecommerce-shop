"use client"
import LayoutV2 from "@/components/auth/LayoutV2";
import Nav from "@/components/Web site/navBar/Nav";
import Dashboard from "@/components/Web site/main/Dashboard";
export default function Home() {
  return(
    <LayoutV2>
      <div className="flex">
        <Nav/>
        <Dashboard/>
      </div>
    </LayoutV2>
  )
}
