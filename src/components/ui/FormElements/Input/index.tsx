import { ChangeEvent, HTMLInputTypeAttribute, KeyboardEvent } from "react";
import styles from "./styles.module.css";

type Props = {
  name: string;
  type?: HTMLInputTypeAttribute;
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
};

export default function Input({
  name,
  type = "text",
  label,
  placeholder,
  value,
  onChange,
  onKeyDown,
}: Props) {
  return (
    <>
      {label && (
        <label className={styles.label} htmlFor={name}>
          {label}
        </label>
      )}
      <input
        id={name}
        className={styles.input}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        autoComplete="off"
      />
    </>
  );
}
