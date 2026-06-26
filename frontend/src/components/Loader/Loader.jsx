

import { LoaderCircle } from "lucide-react";

const Loader = ({ show, text = "Loading..." }) => {

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center">
      {/* Background */}
  
      <div className="absolute inset-0 bg-[#2D3436]/35 backdrop-blur-md" />

      {/* Card */}
      
      <div className="relative flex w-72 flex-col items-center rounded-3xl border border-white/40 bg-[#EBE2E0]/90 px-10 py-8 shadow-[0_20px_60px_rgba(45,52,54,0.18)] backdrop-blur-xl">

        {/* Animated Loader */}

        <div className="relative flex items-center justify-center">

          {/* Pulse Ring */}
         
          <div className="absolute h-20 w-20 animate-ping rounded-full bg-[#990302]/20" />

          {/* Outer Ring */}
       
          <div className="absolute h-16 w-16 rounded-full border-4 border-[#990302]/25" />

          {/* Spinner */}
       

           <LoaderCircle
               className="h-10 w-10 animate-spin text-[#990302]"
               strokeWidth={2.5}
            />


        </div>

        {/* Text */}
     
          <h3 className="mt-8 text-lg font-bold text-[#2D3436]">
          {text}
        </h3>

        <p className="mt-2 text-center text-sm text-[#2D3436]/65">
          Please wait while we prepare everything.
        </p>
      </div>
    </div>
  );
};

export default Loader;