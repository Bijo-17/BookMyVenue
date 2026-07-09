
import { BrowserRouter, Route, Routes } from 'react-router'
import './App.css'
import Body from './components/Body'
import Login from './components/Login/Login'
import Signup from './components/Signup/Signup'
import { Provider } from 'react-redux'
import appStore from './utils/appStore'
import Profile from './components/profile/profile'
import Dashboard from './components/Dashboard/Dashboard'
import Account from './components/Dashboard/Account'
import Otp from './components/Otp/Otp'
import VenueOwnerSignup from './components/Venues/VenueOwnerSignup'
import AddVenue from './components/Venues/addVenue'
import VenueOwnerDashboard from './components/VenueOwnerDashboard/Dashboard'
import Toast from './components/Notification'

function App() {
  

  return (    
    <>
       <Provider store={appStore}>
        <BrowserRouter basename='/'> 
           <Toast/>
           <Routes>          
             <Route path="/" element={<Body/>}> 
                <Route path="/login" element={<Login/>}/>
                <Route path="/signup" element= {<Signup/>} />
                <Route path="/test" element={<div>TEST PAGE</div>} />
                <Route path="/profile" element={<Dashboard/>} />
                <Route path="/account" element={<Account/>} />
                <Route path="/verify-otp" element={<Otp/>} /> 
                <Route path="/venue_owner-registeration" element={<VenueOwnerSignup/>} />
                <Route path="/add-venue" element={<AddVenue/>} />
                <Route path='venue-owner-dashboard' element={<VenueOwnerDashboard/>} />
             </Route>       
           </Routes>      
        </BrowserRouter>
       </Provider>
    </>
  )
}

export default App
