import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import { addDir, addFile, deleteNode } from "@/features/tree/treeSlice";
import styles from "./styles.module.css";
import useToast from "@/hooks/useToast";
import PromptDialog from "@/components/ui/PromptDialog";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import Node from "@/components/tree/Node";

type ModalType = "addFolder" | "addFile" | "addExt" | "delete" | null;

export default function DirNode({ id }: { id: string }) {
  const dispatch = useAppDispatch();
  const toast = useToast();

  const node = useAppSelector((s) => s.tree.byId[id]);
  if (!node || node.type !== "dir") return null;

  const isRoot = node.parentId === null;
  const meta = node.meta as { name: string };
  const children = node.children ?? [];

  const [openModal, setOpenModal] = useState<ModalType>(null);
  const [nameDraft, setNameDraft] = useState("");

  const closeModal = () => setOpenModal(null);
  const openAddFolder = () => setOpenModal("addFolder");

  const openAddFile = () => setOpenModal("addFile");
  const openDelete = () => setOpenModal("delete");

  function submitAddFolder(val?: string) {
    const name = (val || "").trim();
    if (!name) return;
    dispatch(addDir({ parentId: id, name }));
    toast.success("Folder created");
    closeModal();
  }

  function submitAddFileName(val?: string) {
    const name = (val || "").trim();
    if (!name) return;
    setNameDraft(name);
    setOpenModal("addExt");
  }

  function submitAddFileExt(extVal?: string) {
    const ext = (extVal || "").trim();
    if (!ext) return;
    try {
      dispatch(addFile({ parentId: id, name: nameDraft, ext }));
      toast.success("File created");
    } catch (e: any) {
      toast.error(e?.message || "Error");
    } finally {
      closeModal();
      setNameDraft("");
    }
  }

  function confirmDelete() {
    try {
      dispatch(deleteNode({ id }));
      toast.success("Folder deleted");
    } catch (e: any) {
      toast.error(e?.message || "Error");
    } finally {
      closeModal();
    }
  }

  return (
    <div >
      <div className={styles.row}>
        <span className={styles.name}>📂 {meta.name}</span>
        <div className={styles.actions}>
          <button
            className={styles.btn}
            title="Add folder"
            onClick={openAddFolder}
            aria-label="Add folder"
          >
            📂
          </button>
          <button
            className={styles.btn}
            title="Add file"
            onClick={openAddFile}
            aria-label="Add file"
          >
            📄
          </button>
          {!isRoot && (
            <button
              className={styles.btn}
              title="Delete folder"
              onClick={openDelete}
              aria-label="Delete folder"
            >
              ❌
            </button>
          )}
        </div>
      </div>

      <div className={styles.children}>
        {children.map((childId) => (
          <Node key={childId} id={childId} />
        ))}
      </div>

      <PromptDialog
        name="folderName"
        open={openModal === "addFolder"}
        title="New folder"
        label="Folder Name"
        placeholder="Folder Name"
        submitText="Create New Folder"
        onSubmit={submitAddFolder}
        onClose={closeModal}
      />

      <PromptDialog
        name="fileName"
        open={openModal === "addFile"}
        title="New file"
        label="File Name"
        placeholder="File Name"
        submitText="Next"
        onSubmit={submitAddFileName}
        onClose={closeModal}
      />

      <PromptDialog
        name="fileExt"
        open={openModal === "addExt"}
        title="Extension"
        label="Extension"
        placeholder="e.g. txt"
        submitText="Create New File"
        onSubmit={submitAddFileExt}
        onClose={closeModal}
      />

      <ConfirmDialog
        open={openModal === "delete"}
        title="Delete folder"
        message={`Delete ${meta.name} and all its contents?`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        onClose={closeModal}
      />
    </div>
  );
}
