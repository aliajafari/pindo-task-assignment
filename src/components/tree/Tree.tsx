import { useAppSelector } from "@/state/hooks";
import FolderNode from "@/components/tree/FolderNode";

export default function Tree() {
  const rootId = useAppSelector((s) => s.tree.rootId);
  return <FolderNode id={rootId} />;
}
