import styles from "./styles.module.css";

type Props = {
  children: React.ReactNode;
  onClick: () => void;
  variant?: "green" | "red" | "blue" | "default";
  disabled?: boolean;
};

export default function Button({ children, onClick, variant = "default", disabled = false }: Props) {
  const classes = [styles.btn, styles[variant]].filter(Boolean).join(" ");
  return <button type="button" className={classes} onClick={onClick} disabled={disabled}>{children}</button>;
}