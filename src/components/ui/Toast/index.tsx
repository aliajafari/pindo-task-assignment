import { createContext, ReactNode, useMemo, useState } from "react";
import styles from "./styles.module.css";

type Toast = { id: number; kind: "success" | "error"; text: string };

type ToastType = {
  success: (text: string, ms?: number) => void;
  error: (text: string, ms?: number) => void;
};

export const ToastContext = createContext<ToastType | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Toast[]>([]);

  const api = useMemo<ToastType>(
    () => ({
      success: (text, ms = 2200) => {
        const id = Date.now() + Math.random();
        setItems((it) => [...it, { id, kind: "success", text }]);
        setTimeout(() => setItems((it) => it.filter((t) => t.id !== id)), ms);
      },
      error: (text, ms = 2600) => {
        const id = Date.now() + Math.random();
        setItems((it) => [...it, { id, kind: "error", text }]);
        setTimeout(() => setItems((it) => it.filter((t) => t.id !== id)), ms);
      },
    }),
    []
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className={styles.toastWrap}>
        {items.map((t) => (
          <div
            key={t.id}
            className={`${styles.toast} ${
              t.kind === "success" ? styles.toastSuccess : styles.toastError
            }`}
          >
            {t.text}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}