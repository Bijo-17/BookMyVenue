import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  X,
} from "lucide-react";

import "../styles/toast.css";
import { useToast } from "../context/ToastContext";

const styles = {
  success: {
    icon: <CheckCircle2 size={20} />,
    iconBg: "bg-[#E8F7EF]",
    iconColor: "text-green-600",
    progress: "bg-green-500",
  },

  error: {
    icon: <XCircle size={20} />,
    iconBg: "bg-[#FDECEC]",
    iconColor: "text-red-600",
    progress: "bg-red-500",
  },

  warning: {
    icon: <AlertTriangle size={20} />,
    iconBg: "bg-[#FFF3E6]",
    iconColor: "text-orange-500",
    progress: "bg-orange-500",
  },

  info: {
    icon: <Info size={20} />,
    iconBg: "bg-[#EAF6FD]",
    iconColor: "text-sky-600",
    progress: "bg-sky-500",
  },
};

export default function Notification() {
  const { toast, closeToast } = useToast();

  if (!toast.show) return null;

  const current = styles[toast.type];

  return (
   
      <div
            className="
               fixed
               top-5
               right-0
               left-0
               z-9999
               flex
               justify-center
               px-4
               md:left-auto
               md:right-6
               md:justify-end
               md:px-0
               pointer-events-none"
          >

      <div className="toast-card animate-toast pointer-events-auto">

        {/* Luxury accent */}

        <div className="toast-accent"/>

        {/* Gold glow */}

        <div className="toast-light"/>

        <div className="relative flex items-center gap-3 px-4 py-3">

          <div
            className={`
            h-10
            w-10
            rounded-xl
            flex
            items-center
            justify-center
            shadow-md
            ${current.iconBg}
            ${current.iconColor}
            `}
          >
            {current.icon}
          </div>

          <div className="flex-1 min-w-0">

            <h3 className="font-semibold text-sm tracking-wide text-[#2D3436]">

              {toast.title}

            </h3>

            <p className="mt-1 text-xs leading-5 text-[#5C5C5C]">

              {toast.message}

            </p>

          </div>

          <button
            onClick={closeToast}
            className="rounded-full p-2 transition hover:bg-[#F3ECEA]"
          >
            <X
              size={17}
              className="text-[#777]"
            />
          </button>

        </div>

        <div className="h-[3px] w-full bg-[#E9DFDD]">

          <div
            className={`animate-progress h-full ${current.progress}`}
          />

        </div>

      </div>

    </div>
  );
}