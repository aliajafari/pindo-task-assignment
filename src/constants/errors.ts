export const ERRORS = {
    duplicate: "exists already Name",
    invalid: "Contains forbidden characters or empty",
    invalidParent: "Cannot add under a file",
    parentNotFound: "Parent not found",
    protectedRoot: "Root cannot be renamed or deleted",
} as const;  