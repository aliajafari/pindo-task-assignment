import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { TreeState, FolderMeta, FileMeta } from "./types";
import { invalid, buildFileKey, hasFolderByName, hasFileByKey, normalizeExt, normalizeName } from "./validators";
import { ERRORS } from "@/constants";

const initialState: TreeState = {
  rootId: "root",
  byId: {
    root: {
      id: "root",
      type: "folder",
      parentId: null,
      meta: { name: "Root" },
      children: [],
      fileIndex: {},
      folderIndex: {},
    },
  },
};

const treeSlice = createSlice({
  name: "tree",
  initialState,
  reducers: {
    hydrateFromStorage: (_state, action: PayloadAction<TreeState>) => action.payload,

    addFolder: (state, action: PayloadAction<{ parentId: string; name: string }>) => {
      const { parentId, name } = action.payload;
      const parent = state.byId[parentId];
      if (!parent) throw new Error(ERRORS.parentNotFound);
      if (parent.type !== "folder") throw new Error(ERRORS.invalidParent);
      if (invalid(name)) throw new Error(ERRORS.invalid);
      if (hasFolderByName(parent.folderIndex, name)) throw new Error(ERRORS.duplicate);

      const id = crypto.randomUUID();
      state.byId[id] = {
        id,
        type: "folder",
        parentId,
        meta: { name },
        children: [],
        fileIndex: {},
        folderIndex: {},
      };
      parent.children!.push(id);
      parent.folderIndex![normalizeName(name)] = id;
    },

    addFile: (state, action: PayloadAction<{ parentId: string; name: string; ext: string }>) => {
      const { parentId, name, ext } = action.payload;
      const parent = state.byId[parentId];
      if (!parent) throw new Error(ERRORS.parentNotFound);
        if (parent.type !== "folder") throw new Error(ERRORS.invalidParent);
      if (invalid(name) || invalid(ext)) throw new Error(ERRORS.invalid);
      const key = buildFileKey(name, ext);
      if (hasFileByKey(parent.fileIndex, name, ext)) throw new Error(ERRORS.duplicate);

      const id = crypto.randomUUID();
      state.byId[id] = { id, type: "file", parentId, meta: { name, ext: normalizeExt(ext) } };
      parent.children!.push(id);
      parent.fileIndex![key] = id;
    },

    renameNode: (state, action: PayloadAction<{ id: string; name: string; ext?: string }>) => {
      const { id, name, ext } = action.payload;
      const node = state.byId[id];
      if (!node) return;
      if (node.parentId === null) throw new Error(ERRORS.protectedRoot);
      const parent = state.byId[node.parentId!];
      if (!parent) throw new Error(ERRORS.parentNotFound);

      if (node.type === "folder") {
        if (invalid(name)) throw new Error(ERRORS.invalid);
        const prevName = (node.meta as FolderMeta).name;
        const prevKey = normalizeName(prevName);
        const nextKey = normalizeName(name);
        if (prevKey !== nextKey && hasFolderByName(parent.folderIndex, name)) throw new Error(ERRORS.duplicate);
        delete parent.folderIndex![prevKey];
        parent.folderIndex![nextKey] = id;
        (node.meta as FolderMeta).name = name;
      } else {
        const nextExt = normalizeExt(ext ?? (node.meta as FileMeta).ext);
        if (invalid(name) || invalid(nextExt)) throw new Error(ERRORS.invalid);
        const prev = node.meta as FileMeta;
        const prevKey = buildFileKey(prev.name, prev.ext);
        const nextKey = buildFileKey(name, nextExt);
        if (prevKey !== nextKey && hasFileByKey(parent.fileIndex, name, nextExt)) throw new Error(ERRORS.duplicate);
        delete parent.fileIndex![prevKey];
        parent.fileIndex![nextKey] = id;
        prev.name = name;
        prev.ext = nextExt;
      }
    },

    deleteNode: (state, action: PayloadAction<{ id: string }>) => {
      const { id } = action.payload;
      const node = state.byId[id];
      if (!node) return;
      if (node.parentId === null) throw new Error(ERRORS.protectedRoot);
      const parent = state.byId[node.parentId!];
      if (!parent) throw new Error(ERRORS.parentNotFound);

      const stack = [id];
      const toDelete: string[] = [];
      while (stack.length) {
        const cur = stack.pop()!;
        const n = state.byId[cur];
        if (!n) continue;
        toDelete.push(cur);
        if (n.type === "folder") stack.push(...(n.children ?? []));
      }

      if (node.type === "folder") {
        const name = (node.meta as FolderMeta).name;
        delete parent.folderIndex![normalizeName(name)];
      } else {
        const f = node.meta as FileMeta;
        delete parent.fileIndex![buildFileKey(f.name, f.ext)];
      }
      parent.children = parent.children!.filter((x) => x !== id);

      for (const nid of toDelete) delete state.byId[nid];
    },
  },
});

export const { addFolder, addFile, renameNode, deleteNode, hydrateFromStorage } = treeSlice.actions;
export default treeSlice.reducer;
