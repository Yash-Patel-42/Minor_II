export type Role = "owner" | "admin" | "manager" | "editor" | "viewer";

export const GLOBAL_PERMISSIONS = {
  invite: ["owner", "admin", "manager"],
  remove: ["owner", "admin"],
  changeRole: ["owner", "admin"],
  upload: ["owner", "admin", "manager", "editor"],
  editVideo: ["owner", "admin", "manager", "editor"],
  approve: ["owner", "admin"],
  view: ["owner", "admin", "manager", "editor", "viewer"],
  transferOwnership: ["owner"],
  changePermission: ["owner"],
} as const;

export type PermissionKey = keyof typeof GLOBAL_PERMISSIONS;
