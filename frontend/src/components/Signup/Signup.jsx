

import axios from "axios"
import { useState } from "react"
import { BASE_URL } from "../../utils/constants"
import { Link, useNavigate } from "react-router"
import Loader from "../Loader/Loader"

const Signup = ()=> {

  const [loading, setLoading] = useState(false);
   const [toast,setToast] = useState({ state: false, message: '' });

  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })
  const [touched, setTouched] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const setField = (key) => (e) =>
    setValues((v) => ({ ...v, [key]: e.target.value }))
  const blur = (key) => () => setTouched((t) => ({ ...t, [key]: true }))

  // Validators
  const firstNameValid = values.firstName.trim().length >= 3
  const lastNameValid = values.lastName.trim().length >= 2
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)
  // Indian phone: optional +91, starts 6-9, 10 digits total
  const phoneValid = /^(?:\+91[- ]?)?[6-9]\d{9}$/.test(values.phone.trim())
  // Strong: min 8, at least 1 lowercase, 1 uppercase, 1 number, 1 special
  const passwordValid =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(values.password)
  const confirmValid =
    values.confirmPassword.length > 0 &&
    values.confirmPassword === values.password

  const errors = {
    firstName: touched.firstName && !firstNameValid && "Enter your first name (min 3 characters)",
    lastName: touched.lastName && !lastNameValid && "Enter your last name (min 2 characters)",
    email: touched.email && !emailValid && "Enter a valid email address",
    phone: touched.phone && !phoneValid && "Enter a valid phone number",
    password:
      touched.password &&
      !passwordValid &&
      "Min 8 chars with uppercase, lowercase, number & symbol",
    confirmPassword:
      touched.confirmPassword && !confirmValid && "Passwords do not match",
  }

  const allValid =
    firstNameValid &&
    lastNameValid &&
    emailValid &&
    phoneValid &&
    passwordValid &&
    confirmValid

    const navigate = useNavigate();

  const submitForm = async (e) => {
    e.preventDefault()
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      password: true,
      confirmPassword: true,
    })
    if (!allValid) return

    try{ 
          setLoading(true);
    const res = await axios.post(BASE_URL+'/api/auth/signup',{
        firstName: values.firstName, 
        lastName : values.lastName,
        email: values.email,
        password: values.password,
        phoneNumber: values.phone
    } , { withCredentials: true });

     if(res.data.success){
        navigate('/verify-otp',{
          state: {
            tempUserId: res.data.tempUserId,
            email:values.email
          }
        });
     }


    } catch(error){
       setLoading(false);
       setToast({ state : true, message : error.response.data });
       setTimeout(()=>{
           setToast({state : false, message:''});
          },3000)
       console.log("err:" +error.response.data);
    }
  }

  const fieldWrapClass = (hasError) =>
    `flex items-center gap-2 rounded-xl border bg-white px-3 transition-colors focus-within:ring-2 ${
      hasError
        ? "border-[#990302] focus-within:ring-[#990302]/20"
        : "border-[#2D3436]/15 focus-within:border-[#990302] focus-within:ring-[#990302]/15"
    }`

  return (

    <> 
         <Loader
                show={loading}
          text="Creating your account..."
          />
  
    <div className="min-h-screen w-full flex items-center justify-center bg-brand-primary px-4 py-20">
      <form
        onSubmit={submitForm}
        noValidate
        className="card w-full max-w-md bg-white shadow-xl rounded-2xl"
      >
        <div className="card-body p-7 sm:p-9">
          {/* Brand */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-secondary text-white text-xs font-bold tracking-tight">
              BMV
            </div>
            <span className="text-lg font-bold text-brand-accent">
              Book<span className="text-brand-secondary">My</span>Venue
            </span>
          </div>

          {/* Heading */}
          <h2 className="text-3xl font-bold text-brand-accent">Create account</h2>
          <p className="mt-1 text-sm text-brand-accent/60">
            Sign up to start booking your perfect venue.
          </p>

          {/* Google */}
          <button
            type="button"
            onClick={() => console.log("[v0] sign up with google")}
            className="btn mt-6 h-12 min-h-12 w-full rounded-xl border border-brand-accent/15 bg-white font-semibold text-brand-accent normal-case shadow-none hover:bg-brand-primary/40 hover:border-brand-accent/25"
          >
            <svg className="h-5 w-5" viewBox="0 0 48 48" aria-hidden="true">
              <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8a12 12 0 1 1 0-24c3 0 5.8 1.1 7.9 3l5.7-5.7A20 20 0 1 0 24 44a20 20 0 0 0 19.6-23.5z" />
              <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8A12 12 0 0 1 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7A20 20 0 0 0 6.3 14.7z" />
              <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2A12 12 0 0 1 12.7 28l-6.6 5.1A20 20 0 0 0 24 44z" />
              <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3a12 12 0 0 1-4.1 5.6l6.2 5.2C39.9 35.7 44 30.4 44 24c0-1.2-.1-2.4-.4-3.5z" />
            </svg>
            Sign up with Google
          </button>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-brand-accent/12" />
            <span className="text-xs font-medium text-brand-accent/45">OR</span>
            <div className="h-px flex-1 bg-brand-accent/12" />
          </div>

          {/* First + Last name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <fieldset className="fieldset p-0">
              <label htmlFor="firstName" className="mb-1.5 block text-sm font-semibold text-brand-accent">
                First name
              </label>
              <div className={fieldWrapClass(!!errors.firstName)}>
                <svg className="h-5 w-5 shrink-0 text-brand-accent/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 21a8 8 0 0 1 16 0" />
                </svg>
                <input
                  id="firstName"
                  type="text"
                  value={values.firstName}
                  placeholder="John"
                  aria-invalid={!!errors.firstName}
                  onChange={setField("firstName")}
                  onBlur={blur("firstName")}
                  className="h-12 w-full bg-transparent text-brand-accent placeholder:text-brand-accent/35 focus:outline-none"
                />
              </div>
              {errors.firstName && (
                <span className="mt-1.5 text-sm font-semibold text-brand-secondary">{errors.firstName}</span>
              )}
            </fieldset>

            <fieldset className="fieldset p-0">
              <label htmlFor="lastName" className="mb-1.5 block text-sm font-semibold text-brand-accent">
                Last name
              </label>
              <div className={fieldWrapClass(!!errors.lastName)}>
                <svg className="h-5 w-5 shrink-0 text-brand-accent/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 21a8 8 0 0 1 16 0" />
                </svg>
                <input
                  id="lastName"
                  type="text"
                  value={values.lastName}
                  placeholder="Doe"
                  aria-invalid={!!errors.lastName}
                  onChange={setField("lastName")}
                  onBlur={blur("lastName")}
                  className="h-12 w-full bg-transparent text-brand-accent placeholder:text-brand-accent/35 focus:outline-none"
                />
              </div>
              {errors.lastName && (
                <span className="mt-1.5 text-sm font-semibold text-brand-secondary">{errors.lastName}</span>
              )}
            </fieldset>
          </div>

          {/* Email */}
          <fieldset className="fieldset mt-4 p-0">
            <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-brand-accent">
              Email
            </label>
            <div className={fieldWrapClass(!!errors.email)}>
              <svg className="h-5 w-5 shrink-0 text-brand-accent/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="m3 7 9 6 9-6" />
              </svg>
              <input
                id="email"
                type="email"
                value={values.email}
                placeholder="you@example.com"
                aria-invalid={!!errors.email}
                onChange={setField("email")}
                onBlur={blur("email")}
                className="h-12 w-full bg-transparent text-brand-accent placeholder:text-brand-accent/35 focus:outline-none"
              />
            </div>
            {errors.email && (
              <span className="mt-1.5 text-sm font-semibold text-brand-secondary">{errors.email}</span>
            )}
          </fieldset>

          {/* Phone */}
          <fieldset className="fieldset mt-4 p-0">
            <label htmlFor="phone" className="mb-1.5 block text-sm font-semibold text-brand-accent">
              Phone number
            </label>
            <div className={fieldWrapClass(!!errors.phone)}>
              <svg className="h-5 w-5 shrink-0 text-brand-accent/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.5 2.8.6a2 2 0 0 1 1.7 2z" />
              </svg>
              <span className="select-none text-sm font-medium text-brand-accent/50">+91</span>
              <input
                id="phone"
                type="tel"
                value={values.phone}
                placeholder="98765 43210"
                aria-invalid={!!errors.phone}
                onChange={setField("phone")}
                onBlur={blur("phone")}
                className="h-12 w-full bg-transparent text-brand-accent placeholder:text-brand-accent/35 focus:outline-none"
              />
            </div>
            {errors.phone && (
              <span className="mt-1.5 text-sm font-semibold text-brand-secondary">{errors.phone}</span>
            )}
          </fieldset>

          {/* Password */}
          <fieldset className="fieldset mt-4 p-0">
            <label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-brand-accent">
              Password
            </label>
            <div className={fieldWrapClass(!!errors.password)}>
              <svg className="h-5 w-5 shrink-0 text-brand-accent/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <rect x="4" y="11" width="16" height="10" rx="2" />
                <path d="M8 11V7a4 4 0 0 1 8 0v4" />
              </svg>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={values.password}
                placeholder="Create a strong password"
                aria-invalid={!!errors.password}
                onChange={setField("password")}
                onBlur={blur("password")}
                className="h-12 w-full bg-transparent text-brand-accent placeholder:text-brand-accent/35 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="shrink-0 text-brand-accent/45 hover:text-brand-accent"
              >
                {showPassword ? (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M9.9 4.2A10.9 10.9 0 0 1 12 4c6.5 0 10 7 10 7a17.3 17.3 0 0 1-3.2 4.1M6.6 6.6A17.3 17.3 0 0 0 2 11s3.5 7 10 7a10.9 10.9 0 0 0 4.1-.8M3 3l18 18" />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && (
              <span className="mt-1.5 text-sm font-semibold text-brand-secondary">{errors.password}</span>
            )}
          </fieldset>

          {/* Confirm password */}
          <fieldset className="fieldset mt-4 p-0">
            <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-semibold text-brand-accent">
              Confirm password
            </label>
            <div className={fieldWrapClass(!!errors.confirmPassword)}>
              <svg className="h-5 w-5 shrink-0 text-brand-accent/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <rect x="4" y="11" width="16" height="10" rx="2" />
                <path d="M8 11V7a4 4 0 0 1 8 0v4" />
              </svg>
              <input
                id="confirmPassword"
                type={showConfirm ? "text" : "password"}
                value={values.confirmPassword}
                placeholder="Re-enter your password"
                aria-invalid={!!errors.confirmPassword}
                onChange={setField("confirmPassword")}
                onBlur={blur("confirmPassword")}
                className="h-12 w-full bg-transparent text-brand-accent placeholder:text-brand-accent/35 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowConfirm((s) => !s)}
                aria-label={showConfirm ? "Hide password" : "Show password"}
                className="shrink-0 text-brand-accent/45 hover:text-brand-accent"
              >
                {showConfirm ? (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M9.9 4.2A10.9 10.9 0 0 1 12 4c6.5 0 10 7 10 7a17.3 17.3 0 0 1-3.2 4.1M6.6 6.6A17.3 17.3 0 0 0 2 11s3.5 7 10 7a10.9 10.9 0 0 0 4.1-.8M3 3l18 18" />
                  </svg>
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <span className="mt-1.5 text-sm font-semibold text-brand-secondary">{errors.confirmPassword}</span>
            )}
          </fieldset>

          {/* Submit */}
          <button
            type="submit"
            className="btn mt-6 h-12 min-h-12 w-full rounded-xl border-none bg-brand-secondary text-base font-semibold text-white normal-case shadow-none hover:bg-[#7d0202]"
          >
            Create account
          </button>

          {/* Sign in link */}
          <p className="mt-6 text-center text-sm text-brand-accent/60">
            Already have an account?{" "}
            <Link to="/login" className="font-bold text-brand-secondary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </div>

     { toast.state && ( <div className="toast toast-top toast-center my-20">
       <div className="alert alert-error" >
         <span>{toast.message}</span> 
       </div>
   </div> ) }

  </>
  )
}

export default Signup;