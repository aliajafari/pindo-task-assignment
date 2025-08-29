import { useContext } from "react";
import { ToastContext } from "@/components/ui/Toast";

export default function useToast() {
    const context = useContext(ToastContext);
    if (!context) throw new Error("ToastProvider missing");
    return context;
  }
  