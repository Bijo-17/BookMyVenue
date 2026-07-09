
import {
  createContext,
  useContext,
  useRef,
  useState,
  useCallback
} from "react";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {

console.log("toast context mounted...")
  const timer = useRef();

  const [toast, setToast] = useState({

    show: false,

    title: "",

    message: "",

    type: "success"

  });

  const closeToast = useCallback(() => {

    clearTimeout(timer.current);

    setToast({

      show: false,

      title: "",

      message: "",

      type: "success"

    });

  }, []);

  const showToast = useCallback(

    (
      title,
      message,
      type = "success"
    ) => {

      clearTimeout(timer.current);

      setToast({

        show: true,

        title,

        message,

        type

      });

      timer.current = setTimeout(() => {

        closeToast();

      }, 3500);

    },

    [closeToast]

  );

  return (

    <ToastContext.Provider
      value={{

        toast,

        showToast,

        closeToast

      }}
    >

      {children}

    </ToastContext.Provider>

  );

};

export const useToast = () =>
  useContext(ToastContext);