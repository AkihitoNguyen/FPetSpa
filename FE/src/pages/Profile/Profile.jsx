import React, { useState } from 'react'
import SidebarProfile from '../../components/Profile/SidebarProfile'
import UserProfile from '../../components/Profile/UserProfile';
import PetInfor from '../../components/Profile/PetInfor';

const Profile = () => {

  const [activeSection, setActiveSection] = useState('account-info');


  return (
    <div className="flex">
    <SidebarProfile  setActiveSection={setActiveSection}/>
    <div className="flex-1 p-8">
        {activeSection === 'account-info' && (
          <UserProfile/>
        )}
        {activeSection === 'pet-info' && (
          <PetInfor/>
        )}
        {activeSection === 'order-management' && (
          <div>
            <h1 className="text-2xl font-bold">Quản lý đơn hàng</h1>
            <p className="mt-4">Chi tiết về đơn hàng...</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile