
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet, useNavigate } from 'react-router'
import { BASE_URL } from '../utils/constants';
import axios from 'axios';
import Navbar from './Navbar';
import { addUser } from '../utils/userSlice';
import Footer from './Footer';

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((store)=> store.user);

  const fetchUser = async ()=> {
  try{ 
       const res = await axios.get(
          BASE_URL+'/api/auth/profile/view', 
       {
           withCredentials: true
        } 
      );
 
        dispatch(addUser(res.data));

} catch(err){
  if(err.status === 401 ){
     navigate('/login');
  } else {
     navigate('/error');
    console.error(err);
  }
 
}

}

 useEffect(()=>{
   if(!userData){
    fetchUser();
   } 
 },[])

  return (
    <div>
        <Navbar/>
           <Outlet/>
       
    </div>
  )
}

export default Body
