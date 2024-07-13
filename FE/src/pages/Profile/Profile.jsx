// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react'
import SidebarProfile from '../../components/Profile/SidebarProfile'
import UserProfile from '../../components/Profile/UserProfile';
import PetInfor from '../../components/Profile/PetInfor';
import OrderManagement from '../../components/Profile/OrderManagement';

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
          <OrderManagement/>
        )}
      </div>
    </div>
  )
}

export default Profile