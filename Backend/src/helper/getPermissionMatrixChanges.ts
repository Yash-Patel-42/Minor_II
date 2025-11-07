interface PermissionSet {
  [permission: string]: boolean;
}

interface PermissionMatrix {
  [role: string]: PermissionSet;
}
interface MatrixChanges {
  [role: string]: {
    [permission: string]: {
      old: boolean | undefined;
      new: boolean | undefined;
    };
  };
}

function getPermissionMatrixChanges(
  oldPermissionMatrix: PermissionMatrix,
  newPermissionMatrix: PermissionMatrix
) {
  const changes: MatrixChanges = {};
  const allRoleKeys = new Set([
    ...Object.keys(oldPermissionMatrix),
    ...Object.keys(newPermissionMatrix),
  ]);

  for (const roleKey of allRoleKeys) {
    const oldRole = oldPermissionMatrix[roleKey] || {};
    const newRole = newPermissionMatrix[roleKey] || {};
    const roleChanges: MatrixChanges[string] = {};

    const allPermissionKeys = new Set([...Object.keys(oldRole), ...Object.keys(newRole)]);

    for (const permission of allPermissionKeys) {
      const oldValue = oldRole[permission];
      const newValue = newRole[permission];

      if (oldValue !== newValue) {
        roleChanges[permission] = { old: oldValue, new: newValue };
      }
      if (Object.keys(roleChanges).length > 0) {
        changes[roleKey] = roleChanges;
      }
    }
  }
  return changes;
}
export default getPermissionMatrixChanges;
