export type Role = "owner" | "admin" | "manager" | "editor" | "viewer";

export const permissions = {
  invite: ["owner", "admin", "manager"],
  remove: ["owner", "admin"],
  changeRole: ["owner", "admin"],
  upload: ["owner", "admin", "manager", "editor"],
  editVideo: ["owner", "admin", "manager", "editor"],
  approve: ["owner", "admin"],
  view: ["owner", "admin", "manager", "editor", "viewer"],
  transferOwnership: ["owner"],
  changePermission: ["owner"],
};

export function roleHasPermission (role:Role, permission: keyof typeof permissions) {
    return permissions[permission].includes(role);
}