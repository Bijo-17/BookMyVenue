

import {useState} from "react"
import axios from "axios"
import { useNavigate } from "react-router"
import { BASE_URL } from "../../utils/constants"
import { useDispatch } from "react-redux"
import { addUser } from "../../utils/userSlice"


const Login = ()=> {
  const [email, setEmail] = useState("elon@gmail.com");
  const [password, setPassword] = useState("Elon@123");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [touched, setTouched] = useState({ email: false, password: false });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const emailError = touched.email && !emailValid;
  const passwordError = touched.password && password.length === 0;

  const submitForm = async (e) => {
    e.preventDefault()
    setTouched({ email: true, password: true })
    if (!emailValid || password.length === 0) return
  
    try {
    const res = await axios.post(
               BASE_URL+"/api/auth/login",
               { 
                   email,
                   password
                },
                { withCredentials:true}
          );

          dispatch(addUser(res.data));
          return navigate("/profile");

        } catch(err){
            console.log(err);
        }
    console.log("[v0] sign in", { email, remember })
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#EBE2E0] px-4 py-10">
      <form
        onSubmit={submitForm}
        noValidate
        className="card w-full max-w-md bg-white shadow-xl rounded-2xl"
      >
        <div className="card-body p-7 sm:p-9">
          {/* Brand */}
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#990302] text-white text-xs font-bold tracking-tight">
              BMV
            </div>
            <span className="text-lg font-bold text-[#2D3436]">
              Book<span className="text-[#990302]">My</span>Venue
            </span>
          </div>

          {/* Heading */}
          <h2 className="text-3xl font-bold text-[#2D3436]">Welcome back</h2>
          <p className="mt-1 text-sm text-[#2D3436]/60">
            Sign in to manage and book your perfect venue.
          </p>

          {/* Google */}
          <button
            type="button"
            onClick={() => console.log("[v0] continue with google")}
            className="btn mt-6 h-12 min-h-12 w-full rounded-xl border border-[#2D3436]/15 bg-white font-semibold text-[#2D3436] normal-case shadow-none hover:bg-[#EBE2E0]/40 hover:border-[#2D3436]/25"
          >
            <svg className="h-5 w-5" viewBox="0 0 48 48" aria-hidden="true">
              <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8a12 12 0 1 1 0-24c3 0 5.8 1.1 7.9 3l5.7-5.7A20 20 0 1 0 24 44a20 20 0 0 0 19.6-23.5z" />
              <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8A12 12 0 0 1 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7A20 20 0 0 0 6.3 14.7z" />
              <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2A12 12 0 0 1 12.7 28l-6.6 5.1A20 20 0 0 0 24 44z" />
              <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3a12 12 0 0 1-4.1 5.6l6.2 5.2C39.9 35.7 44 30.4 44 24c0-1.2-.1-2.4-.4-3.5z" />
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-[#2D3436]/12" />
            <span className="text-xs font-medium text-[#2D3436]/45">OR</span>
            <div className="h-px flex-1 bg-[#2D3436]/12" />
          </div>

          {/* Email */}
          <fieldset className="fieldset p-0">
            <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-[#2D3436]">
              Email
            </label>
            <div
              className={`flex items-center gap-2 rounded-xl border bg-white px-3 transition-colors focus-within:ring-2 ${
                emailError
                  ? "border-[#990302] focus-within:ring-[#990302]/20"
                  : "border-[#2D3436]/15 focus-within:border-[#990302] focus-within:ring-[#990302]/15"
              }`}
            >
              <svg className="h-5 w-5 shrink-0 text-[#2D3436]/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="m3 7 9 6 9-6" />
              </svg>
              <input
                id="email"
                type="email"
                value={email}
                placeholder="you@example.com"
                aria-invalid={emailError}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                className="h-12 w-full bg-transparent text-[#2D3436] placeholder:text-[#2D3436]/35 focus:outline-none"
              />
            </div>
            {emailError && (
              <span className="mt-1.5 text-sm font-semibold text-[#990302]">
                Enter a valid email address
              </span>
            )}
          </fieldset>

          {/* Password */}
          <fieldset className="fieldset mt-4 p-0">
            <label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-[#2D3436]">
              Password
            </label>
            <div
              className={`flex items-center gap-2 rounded-xl border bg-white px-3 transition-colors focus-within:ring-2 ${
                passwordError
                  ? "border-[#990302] focus-within:ring-[#990302]/20"
                  : "border-[#2D3436]/15 focus-within:border-[#990302] focus-within:ring-[#990302]/15"
              }`}
            >
              <svg className="h-5 w-5 shrink-0 text-[#2D3436]/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <rect x="4" y="11" width="16" height="10" rx="2" />
                <path d="M8 11V7a4 4 0 0 1 8 0v4" />
              </svg>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                placeholder="Enter your password"
                aria-invalid={passwordError}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                className="h-12 w-full bg-transparent text-[#2D3436] placeholder:text-[#2D3436]/35 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="shrink-0 text-[#2D3436]/45 hover:text-[#2D3436]"
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
            {passwordError && (
              <span className="mt-1.5 text-sm font-semibold text-[#990302]">
                Password is required
              </span>
            )}
          </fieldset>

          {/* Remember / Forgot */}
          <div className="mt-4 flex items-center justify-between">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-[#2D3436]">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="checkbox checkbox-sm border-[#2D3436]/30 [--chkbg:#990302] [--chkfg:white]"
              />
              Remember me
            </label>
            <a href="#" className="text-sm font-semibold text-[#990302] hover:underline">
              Forgot password?
            </a>
          </div>

          {/* Sign in */}
          <button
            type="submit"
            className="btn mt-6 h-12 min-h-12 w-full rounded-xl border-none bg-[#990302] text-base font-semibold text-white normal-case shadow-none hover:bg-[#7d0202]"
          >
            Sign in
          </button>

          {/* Guest */}
          <button
            type="button"
            onClick={() => console.log("[v0] continue as guest")}
            className="btn mt-3 h-12 min-h-12 w-full rounded-xl border border-[#2D3436]/15 bg-white font-semibold text-[#2D3436] normal-case shadow-none hover:bg-[#EBE2E0]/40 hover:border-[#2D3436]/25"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21a8 8 0 0 1 16 0" />
            </svg>
            Continue as guest
          </button>

          {/* Register */}
          <p className="mt-6 text-center text-sm text-[#2D3436]/60">
            Don&apos;t have an account?{" "}
            <a href="#" className="font-bold text-[#990302] hover:underline">
              Register now
            </a>
          </p>
        </div>
      </form>
    </div>
  )
}

export default Login;