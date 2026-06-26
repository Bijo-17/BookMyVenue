
import axios from "axios"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { BASE_URL } from "../../utils/constants"


function Field({ label, ...props }) {
  return (
    <label className="form-control w-full">
      <span className="h-12 w-full rounded-xl 
                        px-2
                      text-[#2D3436]
                      outline-none
                      transition-all
                      duration-200
                    focus:border-[#990302]
                      focus:ring-4
                    focus:ring-[#990302]/20
        " >
           {label}
      </span>
      <input
        className="input input-bordered h-12 w-full rounded-xl bg-base-100/50 focus-visible:bg-[#990302]"
        {...props}
      />
    </label>
  )
}

function Card({ title, description, children }) {
  return (
    <section className="rounded-2xl border border-white/40 bg-white p-6 shadow-lg backdrop-blur-lg sm:p-8">
      <h2 className="text-2xl font-bold tracking-tight text-[#2D3436]">{title}</h2>
      {description ? <p className="mt-1 text-sm text-[#2D3436]/60">{description}</p> : null}
      <div className="mt-6">{children}</div>
    </section>
  )
}


const Account = ()=> {

    const userData = useSelector((store)=>store.user);

    const [toast,setToast] = useState({ state: false, alert: '' , message: '' });

  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    location: '',
  })

  const [password , setPassword] = useState({
      password: '',
      newPassword: '',
      confirmPassword: ''
  })

  useEffect(() => {
  if(userData){
      setProfile({
          firstName:userData.firstName || "",
          lastName:userData.lastName || "",
          phone:userData.phoneNumber || "",
          location:userData.location || "",
      })
  }
}, [userData]);

  const set = (key) => (e) => setProfile((p) => ({ ...p, [key]: e.target.value }));

  const setPass =(key)=> (e) => setPassword((p)=> ({ ...p , [key]: e.target.value }));

  const updateProfile = async ()=>{
    try {

         const res = await axios.patch(BASE_URL+'/api/auth/profile/edit',
            { firstName: profile.firstName ,
                lastName: profile.lastName,
                phoneNumber: profile.phone,
                location: profile.location
            },
            { withCredentials: true }
         )

         if(res.data.success){
           
            setToast({ state : true, alert : 'success', message : res.data.message });
            setTimeout(()=>{
               setToast({state : false, alert:'', message:''});
            },3000)
           
         }
        
    } catch (error) {
      setToast({ state : true, alert : 'danger', message : error.response.data });
      setTimeout(()=>{
           setToast({state : false, alert:'', message:''});
          },3000)
    }
  }

   const changePassword = async ()=>{
       try {
       
         const res = await axios.patch(BASE_URL+'/api/auth/profile/editPassword',{
            enteredPassword: password.password , 
            newPassword: password.newPassword,
            confirmPassword : password.confirmPassword
         }, {withCredentials: true} );
       
           setToast({state : true, alert : 'success', message : res.data });
           setTimeout(()=>{
           setToast({state : false, alert:'', message:''});
          },3000)

       } catch (error) {

           setToast({ state : true, alert: error, message : error.response.data });
            setTimeout(()=>{
                setToast({state : false, alert:'', message:''});
            },3000)
       } 
   }

  return (
    <>
    <div className="flex flex-col gap-6 my-10 ">
      {/* Part 1 — Profile details */}
      <Card title="Profile details" description="This information will appear on your bookings and host messages.">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="First name" value={profile.firstName} onChange={set("firstName")} />
          <Field label="Last name" value={profile.lastName} onChange={set("lastName")} />
          <Field label="Phone number" value={profile.phone} onChange={set("phone")} />
          <Field label="Location" value={profile.location} onChange={set("location")} />
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" className="
                                            rounded-xl
                                            border
                                            border-[#2D3436]/15
                                            bg-white/60
                                            px-6
                                            py-3
                                            font-semibold
                                            text-[#2D3436]
                                            transition-all
                                            hover:bg-white
                                            ">
                Cancel
          </button>
          <button type="button"  onClick={updateProfile} className="
                                                                      rounded-xl
                                                                      bg-[#990302]
                                                                      px-6
                                                                      py-3
                                                                      font-semibold
                                                                      text-white
                                                                      shadow-lg
                                                                      transition-all
                                                                      duration-300
                                                                      hover:bg-[#7D0202]
                                                                      ">
            Save changes  
          </button>
        </div>
      </Card>

      {/* Part 2 — Email address */}
      <Card title="Email address" description="We'll send a verification link to confirm changes.">
        <Field label="Email" type="email" defaultValue={userData?.email} />
        <div className="mt-6 flex justify-end">
          <button type="button" className="
                                            rounded-xl
                                            bg-[#990302]
                                            px-6
                                            py-3
                                            font-semibold
                                            text-white
                                            shadow-lg
                                            transition-all
                                            duration-300
                                            hover:bg-[#7D0202]
                                            ">
             Update email
          </button>
        </div>
      </Card>

      {/* Part 3 — Password */}
      <Card title="Password" description="Choose a strong password you don't use elsewhere.">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Current password" type="password" placeholder="••••••••" onChange={setPass("password")} />
          <div className="hidden sm:block" />
          <Field label="New password" type="password" placeholder="••••••••" onChange={setPass("newPassword")} />
          <Field label="Confirm new password" type="password" placeholder="••••••••" onChange={setPass("confirmPassword")} />
        </div>
  
        <div className="mt-6 flex justify-end">
          <button type="button" onClick={changePassword} className="
                                                                      rounded-xl
                                                                      bg-[#990302]
                                                                      px-6
                                                                      py-3
                                                                      font-semibold
                                                                      text-white
                                                                      shadow-lg
                                                                      transition-all
                                                                      duration-300
                                                                      hover:bg-[#7D0202]
                                                                      ">
            Update password
          </button>
        </div>
      </Card>
    </div>
     
   { toast.state && ( <div className="toast toast-top toast-center my-20">
       <div className={`alert ${toast.alert === 'success' ? 'alert-success' : 'alert-error'}`} >
         <span>{toast.message}</span> 
       </div>
   </div> ) }
  
</>
  )
}


export default Account;