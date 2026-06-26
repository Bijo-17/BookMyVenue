
import { User, CalendarCheck, Heart, CreditCard, Bell, Settings as SettingsIcon, LogOut } from "lucide-react"


const NAV_ITEMS = [
  { key: "account", label: "Account", icon: User },
  { key: "bookings", label: "Bookings", icon: CalendarCheck },
  { key: "wishlist", label: "Wishlist", icon: Heart },
  { key: "payments", label: "Payments", icon: CreditCard },
  { key: "notifications", label: "Notifications", icon: Bell },
  { key: "settings", label: "Settings", icon: SettingsIcon },
]

const Sidebar = ({ active, onSelect })=> {
  return (
    <aside className="pt-10 flex h-full w-72 flex-col gap-4 bg-[#EBE2E0] p-4">
      {/* Profile card */}
      <div className="rounded-2xl border border-white/40 bg-white p-6 shadow-lg">
       
        <div className="divider my-3" />

        {/* Navigation */}
        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map(({ key, label, icon: Icon }) => {
            const isActive = active === key
            return (
              <button
                key={key}
                type="button"
                onClick={() => onSelect(key)}
                aria-current={isActive ? "page" : undefined}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[#990302] text-white shadow-lg"
                    : "text-[#2D3436]/80 hover:bg-white/70 hover:text-[#990302]"
                }`}
              >
                <Icon className="size-5 shrink-0" />
                {label}
              </button>
            )
          })}
        </nav>

        <div className="divider my-3" />

        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors text-[#2D3436]/80 hover:bg-white/70 hover:text-[#990302] "
        >
          <LogOut className="size-5 shrink-0" />
          Logout
        </button>
      </div>

      <p className="px-2 text-xs  text-[#2D3436]/40">© {new Date().getFullYear()} bookmyvenue</p>
    </aside>
  )
}

export default Sidebar;