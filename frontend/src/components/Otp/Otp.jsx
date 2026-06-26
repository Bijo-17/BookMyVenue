
import { useState, useRef, useEffect } from "react";
import { ShieldCheck, Clock3, RotateCcw } from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import Loader from "../Loader/Loader";
import axios from "axios";
import { BASE_URL } from "../../utils/constants";

const OTP_LENGTH = 6;
const TIMER_SECONDS = 300; // 5 minutes

const Otp = () => {

  const navigate = useNavigate();

  const location = useLocation();

  const { tempUserId, email } = location.state || {};
  
  const [otp, setOtp] = useState(
    Array(OTP_LENGTH).fill("")
  );

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  const [resendLoading, setResendLoading] = useState(false);

  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);

  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef([]);

  const [toast,setToast] = useState({ state: false, message: '' });

  /*
      Redirect if temp user does not exist
  */

  useEffect(() => {
    if (!tempUserId) {
      navigate('/signup');
    }
  }, [tempUserId, navigate]);

 

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  /*
      Countdown Timer
  */

  useEffect(() => {
    if (timeLeft <= 0) {
      setCanResend(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);


  const formatTime = () => {
    const minutes = String(
      Math.floor(timeLeft / 60)
    ).padStart(2, "0");

    const seconds = String(
      timeLeft % 60
    ).padStart(2, "0");

    return `${minutes}:${seconds}`;
  };


  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const updated = [...otp];

    updated[index] = value;

    setOtp(updated);

    setError("");

    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };


  const handleKeyDown = (e, index) => {
    if (
      e.key === "Backspace" &&
      otp[index] === "" &&
      index > 0
    ) {
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (
      e.key === "ArrowRight" &&
      index < OTP_LENGTH - 1
    ) {
      inputRefs.current[index + 1]?.focus();
    }

    if (
    e.key === "Enter" &&
     otp.join("").length === OTP_LENGTH && !loading
   ) {
    handleVerify();
   }

  };


  const handlePaste = (e) => {
    e.preventDefault();

    const pasted = e.clipboardData
      .getData("text")
      .trim();

    if (!/^\d{6}$/.test(pasted)) return;

    const values = pasted.split("");

    setOtp(values);

    values.forEach((digit, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = digit;
      }
    });

    inputRefs.current[5]?.focus();
  };


  const handleVerify = async () => {
    const enteredOtp = otp.join("");

    if (enteredOtp.length !== 6) {
      setError("Please enter the complete OTP.");
      return;
    }

    try {
      setLoading(true);

         const res = await axios.post(BASE_URL+"/api/auth/verifyOtp",{

                tempUserId,
                otp: enteredOtp

          }, { withCredentials: true });


         if(res.data.success){
         
             setToast({state:true,message:res.data.message})

            setTimeout(()=>{              
                setToast({state:false, message:''});
                navigate("/login");
            },1200);
         }


    } catch (err) {
      console.error(err);

      setError(
        err?.response?.data ||
          "Invalid OTP."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
      Resend OTP
  */

  const handleResend = async () => {
    try {
     setError('');
      setResendLoading(true);

        const res = await axios.post(BASE_URL+"/api/auth/resendOtp",{
                tempUserId
          }, { withCredentials: true });

      if(res.data.success){

             setToast({state: true, message:res.data.message});
             setTimeout(()=>{
                setToast({state:false,message:''});
             })
             
             console.log("OTP Resent");
             
             setOtp(Array(OTP_LENGTH).fill(""));
             
             inputRefs.current.forEach((input) => {
                 if (input) input.value = "";
                });
                
                setTimeLeft(TIMER_SECONDS);
                
                setCanResend(false);
                
                inputRefs.current[0]?.focus();
        } else {
            setError('Failed to send OTP');
        }

    } catch (err) {
      console.log(err);
       setError(err.response.data || "Failed to send OTP.");
    } finally {
      setResendLoading(false);
    }
  };

    return (
    <>
      <Loader
        show={loading || resendLoading}
        text={ loading ? "Verifying OTP..." : "Sending new OTP..." }
      />

      <main className="flex min-h-screen items-center justify-center bg-[#EBE2E0] px-4 py-10">

        {/* Decorative Background */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-[#990302]/10 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-[#2D3436]/10 blur-3xl" />
        </div>

        {/* OTP Card */}
        <section className="relative w-full max-w-md rounded-[28px] border border-white/40 bg-white/65 p-8 shadow-[0_20px_60px_rgba(45,52,54,0.15)] backdrop-blur-xl">

          {/* Icon */}
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#990302]/10">

            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#990302] text-white shadow-lg">
              <ShieldCheck size={28} />
            </div>

          </div>

          {/* Heading */}
          <h1 className="mt-6 text-center text-3xl font-bold text-[#2D3436]">
            Verify OTP
          </h1>

          <p className="mt-3 text-center text-sm leading-6 text-[#2D3436]/70">

            We've sent a verification code to

            <br />

            <span className="font-semibold text-[#990302]">
              {email}
            </span>

          </p>

          {/* OTP Boxes */}

          <div
            className="mt-8 flex justify-center gap-2 sm:gap-3"
            onPaste={handlePaste}
          >

            {otp.map((digit, index) => (

              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                value={digit}
                onChange={(e) =>
                  handleChange(e.target.value, index)
                }
                onKeyDown={(e) =>
                  handleKeyDown(e, index)
                }
                maxLength={1}
                inputMode="numeric"
                autoComplete={index === 0 ? "one-time-code" : "off" }
                spellCheck={false}
                autoCorrect="off"
                autoCapitalize="off"
                className="
                    h-14
                    w-12
                    rounded-xl
                    border-2
                    border-[#2D3436]/15
                    bg-white
                    text-center
                    text-2xl
                    font-bold
                    text-[#2D3436]
                    outline-none
                    transition-all
                    duration-200
                    focus:border-[#990302]
                    focus:ring-4
                    focus:ring-[#990302]/20
                  "
              />

            ))}

          </div>

          {/* Error */}

          {error && (

            <p className="mt-4 text-center text-sm font-medium text-red-600">

              {error}

            </p>

          )}

          {/* Timer */}

          <div className="mt-8 flex items-center justify-center gap-2 text-[#2D3436]/70">

            <Clock3
              size={18}
              className="text-[#990302]"
            />

            <span className="font-medium">

              {canResend
                ? "OTP Expired"
                : `Expires in ${formatTime()}`}

            </span>

          </div>

          {/* Verify Button */}

          <button
            onClick={handleVerify}
            disabled={
              loading ||
              resendLoading ||
              otp.join("").length !== 6
            }
            className="
                mt-8
                w-full
                rounded-xl
                bg-[#990302]
                py-3.5
                text-base
                font-semibold
                text-white
                shadow-lg
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:bg-[#7D0202]
                disabled:cursor-not-allowed
                disabled:bg-[#990302]/40
              "
          >

            {loading
              ? "Verifying..."
              : "Verify OTP"}

          </button>

          {/* Resend */}

          {canResend && (

            <button
              onClick={handleResend}
              disabled={resendLoading}
              className="
                  mt-5
                  flex
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  border
                  border-[#990302]
                  py-3
                  font-semibold
                  text-[#990302]
                  transition-all
                  duration-300
                  hover:bg-[#990302]
                  hover:text-white
                  disabled:opacity-60
                "
            >

              <RotateCcw
                size={18}
              />

              {resendLoading
                ? "Sending OTP..."
                : "Resend OTP"}

            </button>

          )}

        </section>

      </main>

      { toast.state && ( <div className="toast toast-top toast-center my-20">
       <div className="alert alert-success" >
         <span>{toast.message}</span> 
       </div>
   </div> ) }
    </>
  );

};

export default Otp;