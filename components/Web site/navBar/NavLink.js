import React from 'react'
import { usePathname } from 'next/navigation';
const NavLink = ({href , children , name}) => {
    const pathname = usePathname();
    let isActive;
    if (href === '/' ) {
      if( name === "")
        {
          isActive = pathname === href;
        }
    } else {
      isActive = pathname.startsWith(href);
    }
  return (
    <div
      className={isActive ? 'flex bg-white rounded-l-lg text-blue-900 font-bold ' : ''}
    >
      {children}
    </div>
  )
}

export default NavLink