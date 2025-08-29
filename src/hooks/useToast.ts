import { useContext } from "react";
import { ToastContext } from "@/components/ui/Toast";

export default function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error("ToastProvider missing");
    return ctx;
  }
  