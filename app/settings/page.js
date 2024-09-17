"use client"
import React from 'react'
import LayoutV2 from '@/components/auth/LayoutV2'
import Nav from '@/components/Web site/navBar/Nav'
import SettingsContent from '@/components/Web site/main/SettingsContent'
const Settings = () => {
    return(
      <LayoutV2>
        <div className='flex'>
          <Nav/>
          <SettingsContent/>
        </div>
      </LayoutV2>
    )
}

export default Settings;