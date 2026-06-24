
import { BrowserRouter, Route, Routes } from 'react-router'
import './App.css'
import Body from './components/Body'
import Login from './components/Login/Login'
import Signup from './components/Signup/Signup'
import { Provider } from 'react-redux'
import appStore from './utils/appStore'


function App() {
  

  return (    
    <>
       <Provider store={appStore}>
        <BrowserRouter basename='/'> 
           <Routes>          
             <Route path="/" element={<Body/>}> 
                <Route path="/login" element={<Login/>}/>
                <Route path="/signup" element= {<Signup/>} />
                <Route path="/profile" element={<div>"This is a sample profile"</div>}/>
             </Route>       
           </Routes>      
        </BrowserRouter>
       </Provider>
    </>
  )
}

export default App
