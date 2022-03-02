export function isAdmin(rowPermissions: string): boolean {
   return parsePermissions(rowPermissions).includes('admin');
}

export function checkPermission(
   rowPermissions: string,
   permission: string,
): boolean {
   if (isAdmin(rowPermissions)) return true;
   return parsePermissions(rowPermissions).includes(permission);
}

export function parsePermissions(permissions: string): string[] {
   return permissions.split(',');
}

export function appendPermissions(
   rowPermissions: string,
   permissions: string[],
): string {
   const parsedPermissions = parsePermissions(rowPermissions);
   parsedPermissions.push(...permissions);
   return parsedPermissions.join(',');
}

export function permissionsMap(rowPermissions: string): {
   [key: string]: boolean;
} {
   const permChecker = (permission: string) =>
      checkPermission(rowPermissions, permission);
   const perms = {
      admin: permChecker('admin'),
      manage_users: permChecker('manage_users'),
      manage_settings: permChecker('manage_settings'),
      manage_all_uploads: permChecker('manage_all_uploads'),
      upload: permChecker('upload'),
      shorter: permChecker('shorter'),
      haste: permChecker('haste'),
   };

   return perms;
}
