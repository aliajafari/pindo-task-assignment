import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/FormElements/Button";

type Props = {
  open: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onClose: () => void;
};

export default function ConfirmDialog({ open, title = "Confirm", message, confirmText = "Confirm", cancelText = "Cancel", onConfirm, onClose }: Props) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header><strong>{title}</strong></Modal.Header>
      <Modal.Body>
        <p>{message}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClose} variant="red">{cancelText}</Button>
        <Button onClick={handleConfirm} variant="green">{confirmText}</Button>
      </Modal.Footer>
    </Modal>
  );
}
