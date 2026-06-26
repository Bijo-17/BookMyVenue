

import axios from "axios"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router"
import { BASE_URL } from "../utils/constants"
import { removeUser } from "../utils/userSlice"

const Navbar = ( )=> {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  // Toggle navbar appearance after scrolling past the hero fold
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Lock body scroll while the mobile sheet is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [menuOpen])

  const links = ["Venues", "Categories", "Cities"];
  const userData = useSelector((store)=> store.user);
  const dispatch = useDispatch();

  const handleLogout = async ()=>{
    try{ 
     const res = await axios.post(BASE_URL+'/api/auth/logout',
           { } , {withCredentials: true}
     )

    dispatch(removeUser());
     console.log('res' , res)
    } catch(error){
        console.log(error);
        // redirect to error page
    }
  }

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center">
      {/* Floating shell — slightly wider than the page content, never touching the screen edges */}
      <nav
        className={`pointer-events-auto mt-3 w-[calc(100%-1.5rem)] max-w-7xl rounded-2xl px-4 transition-all duration-300 sm:mt-4 sm:px-6 ${
          scrolled
            ? "border border-[#2D3436]/10 bg-[#EBE2E0]/85 shadow-[0_8px_30px_rgba(45,52,54,0.12)] backdrop-blur-xl"
            : "border border-white/15 bg-transparent"
        }`}
      >
        <div className="flex h-16 items-center justify-between gap-4 sm:h-17">
          {/* Left — logo + brand */}
          <a href="#" className="flex shrink-0 items-center gap-1.5 sm:gap-2.5">
            <span className="flex h-8 w-7  items-center justify-center rounded-xl bg-[#990302] text-white shadow-lg sm:h-10 sm:w-10 sm:rounded-xl">
              <svg className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2l2.4 5.2L20 8l-4 4 1 6-5-2.8L7 18l1-6-4-4 5.6-.8z" />
              </svg>
            </span>
            <span className="leading-tight">
              <span
                className={`block text-sm sm:text-2xl font-extrabold tracking-tight transition-colors ${
                  scrolled ? "text-[#2D3436]" : "text-white"
                }`}
              >
                BookMyVenue
              </span>
              <span
                className={`sm:text-[10px] block text-[6px] font-semibold tracking-[0.18em] transition-colors ${
                  scrolled ? "text-[#2D3436]/55" : "text-white/70"
                }`}
              >
                FIND · BOOK · CELEBRATE
              </span>
            </span>
          </a>

          {/* Center — menu (desktop only) */}
          <div className="hidden items-center gap-1 lg:flex">
            {links.map((link) => (
              <a
                key={link}
                href="#"
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  scrolled
                    ? "text-[#2D3436]/80 hover:bg-[#2D3436]/5 hover:text-[#990302]"
                    : "text-white/85 hover:bg-white/10 hover:text-white"
                }`}
              >
                {link}
              </a>
            ))}
          </div>

          {/* Right — location, auth, mobile trigger */}
          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            {/* Location selector — glass */}
            <button
              type="button"
              className={`flex items-center gap-1.5 rounded-full border px-2 py-1.5 md:px-3 md:py-2 text-xs md:text-sm font-semibold backdrop-blur-md transition-colors ${
                scrolled
                  ? "border-[#2D3436]/15 bg-white/60 text-[#2D3436] hover:bg-white"
                  : "border-white/25 bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M12 21s-7-6.1-7-11a7 7 0 1 1 14 0c0 4.9-7 11-7 11z" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
           
                <span className="md:hidden">
                    { userData && userData.location ? userData.location.slice(0,2)+'...' : 'loc...' }               
                </span>
                <span className="hidden md:inline">
                    { userData && userData.location ? userData.location : 'location' }
               </span>
              <svg className="h-3.5 w-3.5 shrink-0 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>

            {/* Auth state */}
            {userData ? (
              <div className="dropdown dropdown-end">
                <button
                  type="button"
                  tabIndex={0}
                  className={`flex items-center gap-1 rounded-full border py-0.5 pl-1.5 pr-1.5 md:py-1 md:pr-2.5 backdrop-blur-md transition-colors ${
                    scrolled
                      ? "border-[#2D3436]/15 bg-white/60 text-[#2D3436] hover:bg-white"
                      : "border-white/25 bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  <span className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-[#990302] text-xs font-bold text-white">
                     { userData.photoUrl ? (
                                      <img className="rounded-full" src={userData.photoUrl} alt="" /> 
                                       )
                                     : (  userData.firstName.slice(0,1))
                                     
                      }
                       
                  </span>
                  <span className="hidden text-sm font-semibold sm:inline">{userData.firstName}</span>
                  <svg className="hidden h-3.5 w-3.5 opacity-70 sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu z-60 mt-3 w-52 rounded-2xl border border-[#2D3436]/10 bg-white/90 p-2 text-[#2D3436] shadow-xl backdrop-blur-xl"
                >
                  <li><Link to={'/profile'} className="rounded-lg font-medium">My Profile</Link></li>
                  <li><a className="rounded-lg font-medium">My Bookings</a></li>
                  <li><a className="rounded-lg font-medium">Saved Venues</a></li>
                  <li><a onClick={handleLogout} className="rounded-lg font-medium text-[#990302]">Log out</a></li>
                </ul>
              </div>
            ) : (
              <Link
                type="button"
                to="/login"
                className="rounded-full bg-[#990302] px-4 py-1 md:px-5 md:py-2 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-[#7d0202] items-center"
              >
                Login
              </Link>
            )}

            {/* Mobile hamburger — glass */}
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              className={`flex h-8.5 w-9 md:h-10 md:w-10 items-center justify-center rounded-full border backdrop-blur-md transition-colors lg:hidden ${
                scrolled
                  ? "border-[#2D3436]/15 bg-white/60 text-[#2D3436] hover:bg-white"
                  : "border-white/25 bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile glass sheet */}
      <div
        className={`pointer-events-auto fixed inset-0 z-70 lg:hidden ${menuOpen ? "" : "pointer-events-none"}`}
        aria-hidden={!menuOpen}
      >
        {/* Backdrop */}
        <div
          onClick={() => setMenuOpen(false)}
          className={`absolute inset-0 bg-[#2D3436]/40 backdrop-blur-sm transition-opacity duration-300 ${
            menuOpen ? "opacity-100" : "opacity-0"
          }`}
        />
        {/* Panel */}
        <div
          className={`absolute right-3 top-3 w-[calc(100%-1rem)] max-w-sm rounded-3xl border border-white/30 bg-[#EBE2E0]/90 p-5 shadow-2xl backdrop-blur-2xl transition-all duration-300 ${
            menuOpen ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-base font-extrabold tracking-tight text-[#2D3436]">
              Book<span className="text-[#990302]">My</span>Venue
            </span>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#2D3436]/15 bg-white/60 text-[#2D3436] hover:bg-white"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
          </div>

          <nav className="mt-5 flex flex-col gap-1">
            {links.map((link) => (
              <a
                key={link}
                href="#"
                onClick={() => setMenuOpen(false)}
                className="rounded-xl px-4 py-3 text-base font-semibold text-[#2D3436] transition-colors hover:bg-white/70 hover:text-[#990302]"
              >
                {link}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Navbar;