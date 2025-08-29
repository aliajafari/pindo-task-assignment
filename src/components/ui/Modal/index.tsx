import { ReactNode } from "react";
import { createPortal } from "react-dom";
import styles from "./styles.module.css";

type Props = {
  open: boolean;
  header?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  onClose: () => void;
};

export function ModalHeader({ children }: { children: ReactNode }) {
  return <div className={styles.header}>{children}</div>;
}

export function ModalBody({ children }: { children: ReactNode }) {
  return <div className={styles.body}>{children}</div>;
}

export function ModalFooter({ children }: { children: ReactNode }) {
  return <div className={styles.footer}>{children}</div>;
}

export function Modal({ open, header, children, footer, onClose }: Props) {
  if (!open) return null;

  return createPortal(
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    document.body
  );
}


export default Object.assign(Modal, { Header: ModalHeader, Body: ModalBody, Footer: ModalFooter });