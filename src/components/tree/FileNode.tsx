import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import { deleteNode, renameNode } from "@/features/tree/treeSlice";
import styles from "./styles.module.css";
import useToast from "@/hooks/useToast";
import PromptDialog from "@/components/ui/PromptDialog";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

export default function FileNode({ id }: { id: string }) {
  const node = useAppSelector((s) => s.tree.byId[id]);
  const dispatch = useAppDispatch();
  const toast = useToast();

  const [openName, setOpenName] = useState(false);
  const [openExt, setOpenExt] = useState(false);
  const [nameDraft, setNameDraft] = useState("");
  const [extDraft, setExtDraft] = useState("");
  const [openDelete, setOpenDelete] = useState(false);

  if (!node || node.type !== "file") return null;
  const meta = node.meta as { name: string; ext: string };

  function handleRenameClick() {
    setNameDraft(meta.name);
    setExtDraft(meta.ext);
    setOpenName(true);
  }

  function handleSubmitName(val?: string) {
    if (!val) return;
    setNameDraft(val);
    setOpenName(false);
    setOpenExt(true);
  }

  function handleSubmitExt(extVal?: string) {
    if (!extVal) return;
    try {
      dispatch(renameNode({ id, name: nameDraft, ext: extVal }));
      toast.success("Renamed");
    } catch (e: any) {
      toast.error(e.message || "Error");
    } finally {
      setOpenExt(false);
    }
  }

  function handleConfirmDelete() {
    try {
      dispatch(deleteNode({ id }));
      toast.success("Deleted");
    } catch (e: any) {
      toast.error(e.message || "Error");
    } finally {
      setOpenDelete(false);
    }
  }

  return (
    <div className={styles.row}>
      <span className={`${styles.name} ${styles.mono}`}>📄 {meta.name}.{meta.ext}</span>
      <div className={styles.actions}>
        <button className={styles.btn} title="Rename" onClick={handleRenameClick} aria-label="Rename">✎</button>
        <button className={styles.btn} title="Delete" onClick={() => setOpenDelete(true)} aria-label="Delete">❌</button>
      </div>

      <PromptDialog
        open={openName}
        title="Rename file"
        label="File name"
        initial={nameDraft}
        placeholder="name"
        submitText="Next"
        onSubmit={handleSubmitName}
        onClose={() => setOpenName(false)}
      />

      <PromptDialog
        open={openExt}
        title="Extension"
        label="Extension"
        initial={extDraft}
        placeholder="e.g. txt"
        submitText="Save"
        onSubmit={handleSubmitExt}
        onClose={() => setOpenExt(false)}
      />

      <ConfirmDialog
        open={openDelete}
        title="Delete file"
        message={`Delete ${meta.name}.${meta.ext}?`}
        onConfirm={handleConfirmDelete}
        onClose={() => setOpenDelete(false)}
      />
    </div>
  );
}
