
import React from 'react'
import { useSelector } from 'react-redux'

const Profile = () => {
    const userData = useSelector((store)=>store.user)
  return (
    <div>
        <h3>Profile section</h3>   
    { userData ? ( 
         <h3>{userData.firstName }</h3>
)
          : ( <p>'NO data available' </p>)
    }
    </div>
  )
}

export default Profile