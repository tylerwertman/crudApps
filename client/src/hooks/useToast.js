import { toast } from "react-toastify";
import { useAppContext } from "../context/main";

export const useToast = () => {
  const { mode } = useAppContext;

  const createToast = ({ variant, message }) =>
    toast[variant](message, { theme: mode });
  return { createToast };
};
