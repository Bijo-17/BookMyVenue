

import React, { useEffect, useState } from 'react';
import { MapPin, Star, Plus, Eye, Edit2, AlertCircle, Layers, Calendar, Users, Tag, Trash2, Clock, X, Check} from 'lucide-react';
import axios from 'axios';
import { BASE_URL } from '../../utils/constants';
import EditVenue from './EditVenue';

import { useToast } from '../../context/ToastContext'; 

const MyVenues = () => {

    // let venues = [
    //   { id: 1, initials: 'TR', name: 'The Royal Orchid Ballroom', city: 'Mumbai', bookings: 42, capacity: 500, rating: 4.8, status: 'Active', image: 'bg-red-600' },
      
    // ];

    const [ venues, setVenues ] = useState([]);
    const [ loading, setLoading ] = useState(false);
    const [error, setError] = useState(null);
    const [editingVenue, setEditingVenue] = useState(null);
     const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
     useEffect(()=>{

        fetchVenues();

     },[]);

    //  const showToast = (message, type = 'success') => {
    //     setToast({ show: true, message, type });
    //     setTimeout(() => {
    //         setToast(prev => ({ ...prev, show: false }));
    //     }, 4000);
    // };

    const { showToast } = useToast();

    const fetchVenues = async ()=> { 
    try{

      setLoading(true);
      setError(null);
    const res = await axios.get(BASE_URL+'/api/venues/venue/viewVenue',
        {withCredentials: true } )

        if(res.data.success){
            
            setVenues(res.data.venues);

        }

    } catch(error) {
        if(error.response){
            console.log(error.response.data);
            setError(error.response.data);
        } else {
            console.log('something went wrong', error);
            setError('Something went wrong!');
        }
    } finally {
       setLoading(false);
    }
    
}

const handleDeleteVenue = async (venue) => {
    if (!window.confirm(`Are you sure you want to delete ${venue.venueName || venue.name}?`)) return;
    try {
    
      const venueId = venue._id;
      const res = await axios.delete(`${BASE_URL}/api/venues/venue/deleteVenue/${venueId}`, {
        withCredentials: true
      });

        if (res.status === 204) {
          showToast('Venue deleted successfully.', 'success');
           setVenues(prev => prev.filter(v => v._id !== venue._id ));
           showToast('Venue deleted Successfully', 'success');
        } else {
          throw new Error(res.data.message || 'Deletion failed');
        }

    } catch (err) {
    
      showToast('Error','Error in deleting venue: '+err.message, 'error');
    }

  };

const handleEditClick = (venue)=> {
  
       setEditingVenue(venue);

}

const handelVenueUpdate = (editedVenue)=>{

          setVenues((prev)=> 
                 prev.map((venue)=> venue._id === editedVenue._id ? editedVenue : venue ));
         
          setEditingVenue(null);

          showToast("Success","updated sucessfully", 'success');
 }



// loading skeltion
  if (loading) {
    return (
      <div className="space-y-8 p-4 md:p-8 animate-pulse">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <div className="h-10 w-48 bg-gray-200 rounded-lg"></div>
            <div className="h-4 w-72 bg-gray-200 rounded-lg"></div>
          </div> 
          <div className="h-12 w-36 bg-gray-200 rounded-xl"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white rounded-2xl border border-gray-100 overflow-hidden h-[420px] flex flex-col justify-between p-6">
              <div className="h-48 bg-gray-200 rounded-xl w-full mb-4"></div>
              <div className="space-y-3 flex-1">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-12 bg-gray-200 rounded-lg w-full mt-4"></div>
              </div>
              <div className="h-10 bg-gray-200 rounded-lg w-full mt-4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // rendering Edit form view
   if(editingVenue){
     return( 
        <EditVenue 
        formData={editingVenue} 
        onCancel={()=> setEditingVenue(null)} 
        onSaveSuccess={handelVenueUpdate}
        />
      );
   }

  return (

     <div className='space-y-8'> 


              {/* Toast Feedback Notification */}
                 {toast.show && (
                     <div className="fixed top-4 right-4 z-50 flex items-center gap-3 bg-[#FCFBF8] border border-[#2D3436]/10 px-5 py-3 rounded-2xl shadow-xl animate-fade-in transition-all">
                         {toast.type === 'success' ? (
                             <Check className="h-5 w-5 text-emerald-600 animate-bounce" />
                         ) : (
                             <AlertCircle className="h-5 w-5 text-[#990302] animate-pulse" />
                         )}
                         <span className="text-sm font-semibold text-[#2D3436]">{toast.message}</span>
                         <button onClick={() => setToast(prev => ({ ...prev, show: false }))}>
                             <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                         </button>
                     </div>
                 )}

     {error && (
          <div className="alert bg-red-50 border border-red-200 text-[#990302] rounded-2xl p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
            <div>
              <p className="font-bold text-sm">Could not load venues</p>
              <p className="text-xs opacity-90 mt-0.5">{error}</p>
            </div>
          </div>
        )}


     {venues.length === 0 && !error ? (

        <div className="text-center py-20 bg-white border border-[#2D3436]/10 rounded-2xl space-y-4">
          <Layers className="h-12 w-12 text-gray-300 mx-auto" />
          <h3 className="font-bold text-lg text-[#2D3436]">No Venues Listed</h3>
          <p className="text-[#2D3436]/60 text-sm max-w-sm mx-auto">Get started by listing your first event space on BookMyVenue.</p>
          <button
            onClick={() => window.location.href = '/add-venue'}
            className="btn bg-[#990302] text-white rounded-xl font-bold btn-sm border-0 hover:bg-[#800201]"
          >
            Add Venue
          </button>
        </div>

      ) : ( 

           <div className="space-y-6 bg-white rounded-2xl p-8">
           <div className="flex items-center justify-between">
           <div>
                 <h2 className="text-3xl font-extrabold text-brand-accent">My venues</h2>
                 <p className="text-gray-500 mt-1">Manage your venue listings, pricing and availability</p>
           </div>
        
          <button
          onClick={() => {
            // Forward to Add Venue page or trigger local modal
            window.location.href = '/add-venue';
          }}
          className="bg-[#990302] text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#800201] transition-all duration-300 shadow-sm flex items-center gap-2 self-start md:self-auto shrink-0 hover:shadow-md"
        >
          <Plus size={18} /> Add New Venue
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto">
        {venues.length && venues.map((venue) => (
          <div key={venue.id} className="bg-white rounded-2xl border border-[#2D3436]/10 overflow-hidden hover:shadow-lg transition-all duration-300 group flex flex-col h-full hover:-translate-y-0.5">

            {/* Venue Image Area */}
           <div className="relative h-48 w-full bg-[#EBE2E0] flex items-center justify-center overflow-hidden">
              
              <img 
                  src={`${BASE_URL}${venue?.images[0]?.url}`} 
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
              />
              <p className="text-white text-5xl font-bold opacity-80">{venue.initials}</p>
               
               {/* Rating Badge */}
                 <div className="absolute top-4 left-4 bg-white/95 backdrop-blur text-[#990302] font-semibold text-xs px-3 py-1 rounded-full border border-[#990302]/20 flex items-center gap-1 shadow-sm">
                    <Star size={13} className="fill-[#990302] text-[#990302]" />
                    <span>{venue.rating || '4.8'}</span>
                  </div>

                {/* Availability Badge */}
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur text-[#2D3436] font-semibold text-xs px-3 py-1 rounded-full border border-gray-200 flex items-center gap-1.5 shadow-sm">
                    <div className={`w-2 h-2 rounded-full ${venue.isAvailable ? 'bg-emerald-500 animate-pulse' : 'bg-[#FF9933]'}`}></div>
                    <span>{venue.isAvailable ? 'Active' : 'Paused'}</span>
                  </div>
          
            </div>

             {/* Status Luxury Ribbon Banner */}
                {(() => {
                  const currentStatus = (venue.status || 'pending').toLowerCase();
                  let bannerBg = "";
                  let foldColor = "";
                  let tailColor = "";
                  let label = "";
                  let IconComponent = null;

                  if (currentStatus === 'approved') {
                    bannerBg = "bg-gradient-to-r from-[#065F46] via-[#34D399] to-[#065F46] text-[#022C22] border-[#A7F3D0]/40 shadow-[0_4px_12px_rgba(52,211,153,0.35)]";
                    foldColor = "border-t-[#044331]";
                    tailColor = "from-[#044331] to-[#065F46]";
                    label = "Approved";
                    IconComponent = <Check size={11} className="stroke-[3]" />;
                  } else if (currentStatus === 'rejected') {
                    bannerBg = "bg-gradient-to-r from-[#991B1B] via-[#F87171] to-[#991B1B] text-white border-[#FEE2E2]/40 shadow-[0_4px_12px_rgba(248,113,113,0.35)]";
                    foldColor = "border-t-[#6B1111]";
                    tailColor = "from-[#6B1111] to-[#991B1B]";
                    label = "Rejected";
                    IconComponent = <X size={11} className="stroke-[3]" />;
                  } else {
                    // Golden luxury pending status
                    bannerBg = "bg-gradient-to-r from-[#8C6D1F] via-[#FBE5A2] to-[#8C6D1F] text-[#4A3705] border-[#FFF3CD]/40 shadow-[0_4px_12px_rgba(140,109,31,0.35)]";
                    foldColor = "border-t-[#594411]";
                    tailColor = "from-[#594411] to-[#8C6D1F]";
                    label = "Pending";
                    IconComponent = <Clock size={11} className="stroke-[3] animate-pulse" />;
                  }

                  return (
                    <div className="relative w-full h-0">
                      {/* Ribbon Wrapper positioned  */}
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-30">
                        <div className="relative  inline-flex justify-center">

                          {/* Left Curly Tail  */}
                          <div className={`absolute -left-2 -top-1.5 w-6 h-4.5 rounded-tl-xl rounded-br-xl bg-linear-to-r ${tailColor} border border-white/10 -rotate-12  shadow-sm`} />

                          {/* Right Curly Tail  */}
                          <div className={`absolute -right-2 -top-1.5 w-6 h-4.5 rounded-tr-xl rounded-bl-xl bg-linear-to-l ${tailColor} border border-white/10 rotate-12  shadow-sm`} />

                          {/* Main Ribbon Body */}
                          <div className={`relative inline-flex px-10 py-1.5 z-10 text-center text-[9px] font-extrabold uppercase tracking-widest  items-center justify-center gap-1 rounded-sm border ${bannerBg}`}>
                            {IconComponent}
                            <span>{label}</span>

                            {/* Left Fold triangle shadow */}
                            <div className={`absolute left-0 top-full w-0 h-0 border-t-[5px] border-r-8 ${foldColor} border-r-transparent`} />

                            {/* Right Fold triangle shadow */}
                            <div className={`absolute right-0 top-full w-0 h-0 border-t-[5px] border-l-8 ${foldColor} border-l-transparent`} />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}

            {/* Venue Info */}
            <div className="p-6 flex flex-col flex-1">

               <div className="mb-4">
                   <h3 className="font-bold text-xl text-[#2D3436] mb-1.5 group-hover:text-[#990302] transition-colors line-clamp-1">
                       {venue.venueName}
                   </h3>
                   <div className="flex items-center gap-1.5 text-[#2D3436]/60 text-sm">
                      <MapPin size={16} className="text-gray-400" />
                      <span className="line-clamp-1">{venue.city}</span>
                   </div>
                </div>

              {/* Stats Row */}
                 
              <div className="flex flex-col gap-2.5 mb-4 border-t border-[#2D3436]/10 pt-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1.5 text-[#2D3436]/60">
                        <Calendar size={16} className="text-gray-400" />
                        <span>{venue.bookings !== undefined ? venue.bookings : '0'} Bookings</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[#2D3436]/60">
                        <Users size={16} className="text-gray-400" />
                        <span>{venue.capacity || '0'} Capacity</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between ">
                      <div className="flex items-center gap-1.5 text-[#990302] font-semibold text-sm">
                        <Tag size={16} />
                        <span>₹{venue.pricePerDay?.toLocaleString() || '0'} / day</span>
                      </div>
                  
                      <div className="flex items-center gap-1.5 text-[#990302] font-semibold text-sm">
                        <Tag size={16} />
                        <span>{venue.pricePerHour?  `₹${venue.pricePerHour?.toLocaleString()} / Hour` : 'Hourly/NA' }</span>
                      </div>
                  
                    </div>
                  </div>

              {/* Action Buttons */}         

              <div className=" pt-4 border-t border-[#2D3436]/10 flex justify-between gap-3">
                    <button
                      onClick={() => handleEditClick(venue)}
                      className="flex-1 bg-[#990302] text-white py-2.5 rounded-xl font-bold text-sm hover:bg-[#800201] transition-all flex items-center justify-center gap-2 shadow-sm"
                    >
                      <Edit2 size={16} /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteVenue(venue)}
                      className="px-4 border border-[#2D3436]/20 text-[#2D3436]/60 hover:text-[#990302] hover:bg-[#990302]/5 py-2.5 rounded-xl transition-colors duration-200 flex items-center justify-center"
                    >
                      <Trash2 size={18} />
                    </button>
               </div>

           </div>
          </div>
        ))}
      </div>
     </div> 
     )}

    </div>
  );
  
};

export default MyVenues;