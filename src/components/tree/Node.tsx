import DirNode from "@/components/tree/DirNode";
import FileNode from "@/components/tree/FileNode";
import { useAppSelector } from "@/state/hooks";


export default function Node({ id }: { id: string }) {
    const type = useAppSelector((s) => s.tree.byId[id]?.type);
    if (!type) return null;
    return type === "dir" ? <DirNode id={id} /> : <FileNode id={id} />;
  }
  