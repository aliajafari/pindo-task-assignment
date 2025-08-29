import { useState, memo } from "react";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import { deleteNode, renameNode } from "@/features/tree/treeSlice";
import styles from "./styles.module.css";
import useToast from "@/hooks/useToast";
import PromptDialog from "@/components/ui/PromptDialog";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { ERRORS } from "@/constants";

type ModalType = "addExt" | "addName" | "delete" | null;

function FileNode({ id }: { id: string }) {
  const node = useAppSelector((s) => s.tree.byId[id]);
  const dispatch = useAppDispatch();
  const toast = useToast();

  const [nameDraft, setNameDraft] = useState("");
  const [extDraft, setExtDraft] = useState("");

  const [openModal, setOpenModal] = useState<ModalType>(null);

  if (!node || node.type !== "file") return null;
  const meta = node.meta as { name: string; ext: string };

  const closeModal = () => setOpenModal(null);
  const openAddName = () => setOpenModal("addName");
  const openAddExt = () => setOpenModal("addExt");
  const openDelete = () => setOpenModal("delete");

  function handleRenameClick() {
    setNameDraft(meta.name);
    setExtDraft(meta.ext);
    openAddName();
  }

  function handleSubmitName(val?: string) {
    if (!val) return;
    setNameDraft(val);
    openAddExt();
  }

  function handleSubmitExt(extVal?: string) {
    if (!extVal) return;
    try {
      dispatch(renameNode({ id, name: nameDraft, ext: extVal }));
      toast.success("Renamed");
      closeModal();
    } catch (e: any) {
      if(e.message === ERRORS.duplicate || e.message === ERRORS.invalid) openAddName();
      toast.error(e.message || "Error");
    }
  }

  function handleConfirmDelete() {
    try {
      dispatch(deleteNode({ id }));
      toast.success("Deleted");
    } catch (e: any) {
      toast.error(e.message || "Error");
    } finally {
      closeModal();
    }
  }

  return (
    <div className={styles.row}>
      <span className={`${styles.name} ${styles.mono}`}>📄 {meta.name}.{meta.ext}</span>
      <div className={styles.actions}>
        <button className={styles.btn} title="Rename" onClick={handleRenameClick} aria-label="Rename">✎</button>
        <button className={styles.btn} title="Delete" onClick={openDelete} aria-label="Delete">❌</button>
      </div>

      <PromptDialog
        open={openModal === "addName"}
        title="Rename file"
        label="File name"
        initial={nameDraft}
        placeholder="name"
        submitText="Next"
        onSubmit={handleSubmitName}
        onClose={closeModal}
      />

      <PromptDialog
        open={openModal === "addExt"}
        title="Extension"
        label="Extension"
        initial={extDraft}
        placeholder="e.g. txt"
        submitText="Save"
        onSubmit={handleSubmitExt}
        onClose={closeModal}
      />

      <ConfirmDialog
        open={openModal === "delete"}
        title="Delete file"
        message={`Delete ${meta.name}.${meta.ext}?`}
        onConfirm={handleConfirmDelete}
        onClose={closeModal}
      />
    </div>
  );
}

export default memo(FileNode);