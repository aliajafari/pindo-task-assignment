import { BAD_CHARS, REMOVE_DOT } from "@/constants";

export const isEmpty = (s: string | undefined | null) => !s || !String(s).trim();
export const invalid = (s: string | undefined | null) => isEmpty(s) || BAD_CHARS.test(String(s));

export const normalizeName = (s: string) => String(s).trim().toLowerCase();
export const normalizeExt = (s: string) => String(s).replace(REMOVE_DOT, "").trim().toLowerCase();

export const buildFileKey = (name: string, ext: string) => `${normalizeName(name)}.${normalizeExt(ext)}`;

export const hasFolderByName = (folderIndex: Record<string, string> | undefined, name: string) => {
  if (!folderIndex) return false;
  const key = normalizeName(name);
  return Object.prototype.hasOwnProperty.call(folderIndex, key);
};

export const hasFileByKey = (
  fileIndex: Record<string, string> | undefined,
  name: string,
  ext: string
) => {
  if (!fileIndex) return false;
  const key = buildFileKey(name, ext);
  return Object.prototype.hasOwnProperty.call(fileIndex, key);
};