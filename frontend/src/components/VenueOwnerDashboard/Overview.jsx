

import React from 'react';
import { Eye, ArrowUp, ArrowDown } from 'lucide-react';

const Overview = () => {
  const stats = [
    { label: 'TOTAL REVENUE', value: '₹40.4L', trend: '+12.4%', positive: true, icon: '$' },
    { label: 'BOOKINGS', value: '85', trend: '+8.1%', positive: true, icon: '📅' },
    { label: 'ACTIVE VENUES', value: '2', trend: '0%', positive: false, icon: '🏛️' },
    { label: 'AVG RATING', value: '4.7', trend: '-0.1 vs last month', positive: false, icon: '⭐' }
  ];

  const upcomingBookings = [
    { id: 1, guest: 'Priya Mehta', type: 'Wedding Reception', venue: 'The Royal Orchid Ballroom', date: '15 Jul 2026', amount: '₹2,45,000', status: 'Confirmed' },
    { id: 2, guest: 'Rahul Verma', type: 'Corporate Mixer', venue: 'Skyline Rooftop Lounge', date: '4 Jul 2026', amount: '₹64,000', status: 'Pending' },
    { id: 3, guest: 'Aisha Khan', type: 'Engagement', venue: 'The Royal Orchid Ballroom', date: '22 Jul 2026', amount: '₹1,38,000', status: 'Confirmed' }
  ];

  const recentActivity = [
    { id: 1, type: 'booking', title: 'New booking from Priya Mehta', venue: 'The Royal Orchid Ballroom', time: '12 min ago', icon: '📅' },
    { id: 2, type: 'payment', title: 'Payment of ₹2,45,000 received for booking #B1042', venue: '', time: '1 hour ago', icon: '💰' },
    { id: 3, type: 'review', title: 'Vikram S. left a 5-star review on Heritage Garden Lawn', venue: '', time: '3 hours ago', icon: '⭐' },
    { id: 4, type: 'wishlist', title: 'Skyline Rooftop Lounge added to 14 wishlists today', venue: '', time: '5 hours ago', icon: '❤️' }
  ];

  const StatCard = ({ label, value, trend, positive, icon }) => (
    <div className="bg-white rounded-2xl md:p-6 shadow-sm border border-gray-100 p-2">
      <div className="flex items-start justify-around mb-4 ">
        <div>
          <p className="text-gray-500 text-sm font-medium">{label}</p>
          <h3 className="text-2xl font-extrabold text-gray-900 mt-2">{value}</h3>
        </div>
        <div className="text-3xl text-black">{icon}</div>
      </div>
      <div className="flex items-center gap-1">
        {positive ? <ArrowUp size={16} className="text-green-600" /> : <ArrowDown size={16} className="text-gray-400" />}
        <span className={positive ? 'text-green-600 text-sm font-medium' : 'text-gray-500 text-sm'}>{trend}</span>
      </div>
    </div>
  );

  return (

    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <StatCard key={idx} {...stat} />
        ))}
      </div>

      {/* Upcoming Bookings Table */}
      <div className='grid grid-cols-1 lg:grid-cols-[1fr_268px] gap-5'> 

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Upcoming bookings</h2> 
            <p className="text-gray-500 text-sm mt-1">Next events at your venues</p>
          </div>
          <button className="text-red-600 font-medium text-sm hover:text-red-700 cursor-pointer">View all</button>
        </div>
        <div className="overflow-x-auto bg-white">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200"> 
                <th className="text-left py-3 px-4 text-[#6b6b6b] font-bold text-xs">GUEST</th>
                <th className="text-left py-3 px-4 text-[#6b6b6b] font-bold text-xs">VENUE</th>
                <th className="text-left py-3 px-4 text-[#6b6b6b] font-bold text-xs">DATE</th>
                <th className="text-left py-3 px-4 text-[#6b6b6b] font-bold text-xs">AMOUNT</th>
                <th className="text-left py-3 px-4 text-[#6b6b6b] font-bold text-xs">STATUS</th>
               
              </tr>
            </thead>
            <tbody>
              {upcomingBookings.map((booking) => (
                <tr key={booking.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full ${booking.guest.charAt(0) === 'P' ? 'bg-red-600' : booking.guest.charAt(0) === 'R' ? 'bg-orange-600' : 'bg-red-700'} text-white flex items-center justify-center font-bold text-sm`}>
                        {booking.guest.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-medium text-[13px] text-[#2D3436] whitespace-nowrap">{booking.guest}</p>
                        <p className="text-gray-500 text-[11px] whitespace-nowrap">{booking.type}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-[#2D3436] text-[13px] whitespace-nowrap">{booking.venue}</td>
                  <td className="py-4 px-4 text-[#2D3436] text-[13px] whitespace-nowrap">{booking.date}</td>
                  <td className="py-4 px-4 font-bold text-[#2D3436] text-[13px] whitespace-nowrap">{booking.amount}</td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${booking.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {booking.status}
                    </span>
                  </td>
              
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-6"> */}
        {/* Recent Activity */}
        <div className=" bg-white rounded-2xl p-6 shadow-sm border border-gray-120 h-122 overflow-y-auto">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent activity</h2>
            <p className="text-gray-500 text-xs mt-1">Real-time updates from your venues</p>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="pb-4 border-b border-gray-100 last:border-0 flex gap-4">
                <div className="text-2xl shrink-0">{activity.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-[13px]">{activity.title}</p>
                  {activity.venue && <p className="text-gray-500 text-xs mt-1">{activity.venue}</p>}
                  <p className="text-gray-400 text-xs mt-2">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
    </div>



      </div>
    
  );
};

export default Overview;

