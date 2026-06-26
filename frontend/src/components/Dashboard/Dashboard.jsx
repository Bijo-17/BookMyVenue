

import { useState } from "react"
import { Menu } from "lucide-react"

import Sidebar from "./Sidebar.jsx"
import Account from "./Account.jsx"
import Bookings from "./Bookings.jsx"
import Wishlist from "./Wishlist.jsx"

// import Payments from "./Payments.jsx"
// import Notifications from "./Notifications.jsx"
// import Settings from "./Settings.jsx"


const SECTION_TITLES = {
  account: "Account",
  bookings: "Bookings",
  wishlist: "Wishlist",
//   payments: "Payments",
//   notifications: "Notifications",
//   settings: "Settings",
}

const Dashboard = ()=> {

  const [active, setActive] = useState("account")
  const [drawerOpen, setDrawerOpen] = useState(false)

  const closeDrawer = () => setDrawerOpen(false)

  const handleSelect = (key) => {

    setActive(key)
    closeDrawer() 
  }

  const renderSection = () => {
   
    try{
    switch (active) {
      case "account":
        return <Account />
      case "bookings":
        return <Bookings />
      case "wishlist":
        return <Wishlist />
      case "payments":
        return <Payments />
      case "notifications":
        return <Notifications />
      case "settings":
        return <Settings />
      default:
        return <Account />
    }
} catch(error){
    console.error("render ER: "+error)
} 
  }

  return (
  
    <div className="drawer pt-20 min-h-screen bg-[#EBE2E0] lg:drawer-open">
      <input
        id="nav-drawer"
        type="checkbox"
        className="drawer-toggle"
        checked={drawerOpen}
        onChange={(e) => setDrawerOpen(e.target.checked)}
      />

      <div className="drawer-content ">

         <div className="py-1 lg:hidden sticky top-20 z-20 mb-10 flex items-center justify-between rounded-2xl border border-white/40 bg-white/70 p-4 shadow-lg backdrop-blur-lg">


      <button
            onClick={() => setDrawerOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#2D3436]/15 bg-white/60 transition hover:bg-white"
         >
           <Menu size={22} className="text-[#2D3436]" />
      </button>

           <h2 className="text-lg font-bold text-[#2D3436]">
               {SECTION_TITLES[active]}
          </h2>

         <div className="w-8" />

          </div>

      </div>

        <div className="drawer-content rounded-3xl bg-[#EBE2E0] mx-5">
             {renderSection()}
        </div>

      <div className="drawer-side z-40 ">
        <label htmlFor="nav-drawer" aria-label="Close menu" className="drawer-overlay"></label>
        <Sidebar active={active} onSelect={handleSelect} />
      </div>
    </div>
 
  )
}


export default Dashboard;