export type TypeNode = "dir" | "file";

export type FileMeta = { name: string; ext: string };
export type DirMeta = { name: string };

export type Node = {
  id: string;
  type: TypeNode;
  parentId: string | null;
  meta: FileMeta | DirMeta;
  children?: string[];
  fileIndex?: Record<string, string>;
  dirIndex?: Record<string, string>;
};

export type TreeState = {
  rootId: string;
  byId: Record<string, Node>;
};
