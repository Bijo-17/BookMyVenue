

import React, { useState } from 'react';
import { Home, Building, Calendar, Lock, BarChart3, Activity, User, LogOut, Settings, Bell } from 'lucide-react';
import Overview from './Overview';
import MyVenues from './MyVenues';
// import Bookings from './Bookings';
// import Availability from './Availability';
// import ActivityLog from './Activity';
// import Profile from './Profile';

const VenueOwnerDashboard = () => {
    
  const [activeSection, setActiveSection] = useState('overview');

  const user = {
    name: 'Aarav Sharma',
    status: 'Verified Host',
    avatar: 'AS'
  };

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'venues', label: 'My Venues', icon: Building },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'availability', label: 'Availability', icon: Lock },
    { id: 'payments', label: 'Payments', icon: BarChart3 },
    { id: 'activity', label: 'Activity', icon: Activity },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return <Overview />;
      case 'venues':
        return <MyVenues />;
      case 'bookings':
        return <Bookings />;
      case 'availability':
        return <Availability />;
      case 'payments':
        return <PaymentsSection />;
      case 'activity':
        return <ActivityLog />;
      case 'profile':
        return <Profile />;
      default:
        return <Overview />;
    }
  };

  return (

    <div className="min-h-screen bg-[#EBE2E0]">
      <div className="flex items-start md:py-10 md:px-20">
        {/* Sidebar */}
        <div className="hidden md:block w-65  self-start bg-white shadow-lg h-164 m-6 rounded-2xl">
          {/* User Profile Card */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-[#990302] text-white flex items-center justify-center font-bold text-lg">
                {user.avatar}
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{user.name}</h3>
                <p className="text-gray-500 text-sm">{user.status}</p>
                <p className="text-gray-400 text-xs mt-1">· {user.venues} Venues</p>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl transition ${
                    activeSection === item.id
                      ? 'bg-linear-[135deg,#990302,#c61f1d] text-white'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-semibold text-brand-accent text-sm">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Notifications and Settings */}
          <div className="p-4 space-y-2 border-t border-gray-100">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition">
              <Bell size={20} />
              <span className="font-medium">Notifications</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition">
              <Settings size={20} />
              <span className="font-medium">Settings</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition">
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>

        {/* Main Content */} 
        <div className="flex-1 min-w-0 md:pr-6 py-12 md:py-6 p-6 md:p-0 overflow-y-auto"> 
          {renderContent()}
        </div>
      </div>
    </div>

        )
   }


   export default VenueOwnerDashboard;
