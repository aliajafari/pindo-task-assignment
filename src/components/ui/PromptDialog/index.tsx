import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import Modal from "@/components/ui/Modal";
import Input from "../FormElements/Input";
import Button from "../FormElements/Button";

type Props = {
  open: boolean;
  name?: string;
  title?: string;
  label: string;
  initial?: string;
  placeholder?: string;
  submitText?: string;
  cancelText?: string;
  onSubmit: (value: string) => void;
  onClose: () => void;
};

export default function PromptDialog({
  name = "value",
  open,
  title = "Input",
  label,
  initial = "",
  placeholder,
  submitText = "Save",
  cancelText = "Cancel",
  onSubmit,
  onClose,
}: Props) {
  const [value, setValue] = useState(initial);
  const ref = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (open) setValue(initial);
  }, [open, initial]);

  useEffect(() => {
    if (open) ref.current?.focus();
  }, [open]);

  const handleSubmit = () => {
    onSubmit(value.trim());
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit();
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>
        <strong>{title}</strong>
      </Modal.Header>
      <Modal.Body>
        <Input
          name={name}
          label={label}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />  
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClose} variant="red">
          {cancelText}
        </Button>
        <Button onClick={handleSubmit} variant="green" disabled={!value.trim()}>
          {submitText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
