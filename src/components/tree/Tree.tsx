import { useAppSelector } from "@/state/hooks";
import DirNode from "@/components/tree/DirNode";

export default function Tree() {
  const rootId = useAppSelector((s) => s.tree.rootId);
  return <DirNode id={rootId} />;
}
