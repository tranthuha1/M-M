import { useUserSession } from '@/store/userSession';

export function checkPermission(permission: string) {
  const userSession = useUserSession();
  return userSession.permissions.includes(permission);
}

/**
 * Check quyền theo một mảng quyền truyền vào
 * @param permissions Mảng quyền cần check
 * @param acceptAll true: phải có tất cả quyền trong mảng permissions, false: chỉ cần 1 quyền trong mảng permissions
 */
export function checkPermissions(permissions: Array<string>, acceptAll: false = false) {
  if (permissions !== undefined) {
    const userSession = useUserSession();
    let allow: boolean;
    if (acceptAll) {
      allow = true;
      permissions.forEach((item) => {
        if (!userSession.permissions.includes(item)) {
          allow = false;
        }
      });
    } else {
      allow = false;
      permissions.forEach((item) => {
        if (userSession.permissions.includes(item)) {
          allow = true;
        }
      });
    }
    return allow;
  }
  return true;
}
