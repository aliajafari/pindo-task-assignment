import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { TreeState, DirMeta, FileMeta } from "./types";
import { invalid, buildFileKey, hasDirByName, hasFileByKey, normalizeExt, errors } from "./validators";

const initialState: TreeState = {
  rootId: "root",
  byId: {
    root: {
      id: "root",
      type: "dir",
      parentId: null,
      meta: { name: "Root" },
      children: [],
      fileIndex: {},
      dirIndex: {},
    },
  },
};

const treeSlice = createSlice({
  name: "tree",
  initialState,
  reducers: {
    hydrateFromStorage: (_state, action: PayloadAction<TreeState>) => action.payload,

    addDir: (state, action: PayloadAction<{ parentId: string; name: string }>) => {
      const { parentId, name } = action.payload;
      const parent = state.byId[parentId];
      if (!parent) throw new Error("parent-not-found");
      if (parent.type !== "dir") throw new Error("invalid-parent");
      if (invalid(name)) throw new Error(errors.invalid);
      if (hasDirByName(parent.dirIndex, name)) throw new Error(errors.duplicate);

      const id = crypto.randomUUID();
      state.byId[id] = {
        id,
        type: "dir",
        parentId,
        meta: { name },
        children: [],
        fileIndex: {},
        dirIndex: {},
      };
      parent.children!.push(id);
      parent.dirIndex![name] = id;
    },

    addFile: (state, action: PayloadAction<{ parentId: string; name: string; ext: string }>) => {
      const { parentId, name, ext } = action.payload;
      const parent = state.byId[parentId];
      if (!parent) throw new Error("parent-not-found");
      if (parent.type !== "dir") throw new Error("invalid-parent");
      if (invalid(name) || invalid(ext)) throw new Error(errors.invalid);
      const key = buildFileKey(name, ext);
      if (hasFileByKey(parent.fileIndex, name, ext)) throw new Error(errors.duplicate);

      const id = crypto.randomUUID();
      state.byId[id] = { id, type: "file", parentId, meta: { name, ext: normalizeExt(ext) } };
      parent.children!.push(id);
      parent.fileIndex![key] = id;
    },

    renameNode: (state, action: PayloadAction<{ id: string; name: string; ext?: string }>) => {
      const { id, name, ext } = action.payload;
      const node = state.byId[id];
      if (!node) return;
      if (node.parentId === null) throw new Error("protected-root");
      const parent = state.byId[node.parentId!];
      if (!parent) throw new Error("parent-not-found");

      if (node.type === "dir") {
        if (invalid(name)) throw new Error(errors.invalid);
        if (hasDirByName(parent.dirIndex, name)) throw new Error(errors.duplicate);
        const prevName = (node.meta as DirMeta).name;
        delete parent.dirIndex![prevName];
        parent.dirIndex![name] = id;
        (node.meta as DirMeta).name = name;
      } else {
        const nextExt = normalizeExt(ext ?? (node.meta as FileMeta).ext);
        if (invalid(name) || invalid(nextExt)) throw new Error(errors.invalid);
        const prev = node.meta as FileMeta;
        const prevKey = buildFileKey(prev.name, prev.ext);
        const nextKey = buildFileKey(name, nextExt);
        if (prevKey !== nextKey && hasFileByKey(parent.fileIndex, name, nextExt)) throw new Error(errors.duplicate);
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
      if (node.parentId === null) throw new Error(errors.protectedRoot);
      const parent = state.byId[node.parentId!];
      if (!parent) throw new Error(errors.parentNotFound);

      const stack = [id];
      const toDelete: string[] = [];
      while (stack.length) {
        const cur = stack.pop()!;
        const n = state.byId[cur];
        if (!n) continue;
        toDelete.push(cur);
        if (n.type === "dir") stack.push(...(n.children ?? []));
      }

      if (node.type === "dir") {
        const name = (node.meta as DirMeta).name;
        delete parent.dirIndex![name];
      } else {
        const f = node.meta as FileMeta;
        delete parent.fileIndex![`${f.name}.${f.ext}`];
      }
      parent.children = parent.children!.filter((x) => x !== id);

      for (const nid of toDelete) delete state.byId[nid];
    },
  },
});

export const { addDir, addFile, renameNode, deleteNode, hydrateFromStorage } = treeSlice.actions;
export default treeSlice.reducer;
