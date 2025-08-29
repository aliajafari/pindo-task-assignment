import { BAD_CHARS, REMOVE_DOT } from "@/constants";

export const isEmpty = (s: string | undefined | null) => !s || !String(s).trim();
export const invalid = (s: string | undefined | null) => isEmpty(s) || BAD_CHARS.test(String(s));

export const normalizeName = (s: string) => String(s).trim();
export const normalizeExt = (s: string) => String(s).replace(REMOVE_DOT, "").trim().toLowerCase();

export const buildFileKey = (name: string, ext: string) => `${normalizeName(name)}.${normalizeExt(ext)}`;

export const hasDirByName = (dirIndex: Record<string, string> | undefined, name: string) => {
  if (!dirIndex) return false;
  const key = normalizeName(name);
  return Object.prototype.hasOwnProperty.call(dirIndex, key);
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

export const errors = {
  duplicate: "exists already Name",
  invalid: "Contains forbidden characters or empty",
  invalidParent: "Cannot add under a file",
  protectedRoot: "Root cannot be renamed or deleted",
} as const;
