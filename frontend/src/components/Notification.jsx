
import React from 'react'

const Notification = ({message , type = 'error'}) => {

   
    if(!message) return null;

  return (
    
       <div className="toast toast-top toast-center mt-20 z-50">
          <div className={ `alert alert-${type}` } >
             <span>{message}</span> 
          </div>
       </div>    
  )

}

export default Notification
