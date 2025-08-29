export type TypeNode = "folder" | "file";

export type FileMeta = { name: string; ext: string };
export type FolderMeta = { name: string };

export type Node = {
  id: string;
  type: TypeNode;
  parentId: string | null;
  meta: FileMeta | FolderMeta;
  children?: string[];
  fileIndex?: Record<string, string>;
  folderIndex?: Record<string, string>;
};

export type TreeState = {
  rootId: string;
  byId: Record<string, Node>;
};
