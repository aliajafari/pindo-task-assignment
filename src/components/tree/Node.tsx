import { memo } from "react";
import FolderNode from "@/components/tree/FolderNode";
import FileNode from "@/components/tree/FileNode";
import { useAppSelector } from "@/state/hooks";

function Node({ id }: { id: string }) {
  const type = useAppSelector((s) => s.tree.byId[id]?.type);
  if (!type) return null;
  return type === "folder" ? <FolderNode id={id} /> : <FileNode id={id} />;
}

export default memo(Node);
