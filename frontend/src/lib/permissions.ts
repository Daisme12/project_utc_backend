export type UserRole = "ADMIN" | "CASHIER" | "CUSTOMER";

export interface AppUser {
  id?: number;
  username?: string;
  fullName?: string;
  phone?: string;
  email?: string;
  role?: string | { id?: number; name?: string };
  roleName?: string;
  avatarUrl?: string;
  accumulatedPoints?: number;
}

/**
 * Standardize user role into 'ADMIN' | 'CASHIER' | 'CUSTOMER'
 */
export function getUserRole(user: any): UserRole {
  if (!user) return "CUSTOMER";

  // Check role field (can be string or object)
  const raw =
    typeof user.role === "string"
      ? user.role
      : user.role?.name || user.roleName || "";
  const upper = raw.toUpperCase();

  if (upper === "ADMIN" || upper === "ROLE_ADMIN" || upper === "MANAGER") {
    return "ADMIN";
  }
  if (upper === "CASHIER" || upper === "ROLE_CASHIER" || upper === "STAFF") {
    return "CASHIER";
  }

  // Fallback checks by username or email
  if (user.username === "admin" || user.email === "admin@utc.edu.vn") {
    return "ADMIN";
  }
  if (user.username === "thungan01" || user.email === "cashier01@utc.edu.vn") {
    return "CASHIER";
  }

  return "CUSTOMER";
}

/**
 * Check if user is full system administrator
 */
export function isAdmin(user: any): boolean {
  return getUserRole(user) === "ADMIN";
}

/**
 * Check if user has permission to access Admin portal and POS
 */
export function hasAdminAccess(user: any): boolean {
  const role = getUserRole(user);
  return role === "ADMIN" || role === "CASHIER";
}

/**
 * Get readable label and badge style for user role
 */
export function getRoleBadgeInfo(user: any) {
  const role = getUserRole(user);
  switch (role) {
    case "ADMIN":
      return {
        role,
        label: "Quản trị viên (Admin)",
        shortLabel: "Admin",
        badgeBg: "bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300 border-purple-200 dark:border-purple-800",
        icon: "🛡️",
      };
    case "CASHIER":
      return {
        role,
        label: "Thu ngân POS",
        shortLabel: "Thu Ngân",
        badgeBg: "bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border-blue-200 dark:border-blue-800",
        icon: "🏪",
      };
    default:
      return {
        role,
        label: "Thành viên Ubofood",
        shortLabel: "Khách hàng",
        badgeBg: "bg-emerald-50 text-[#195329] dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-800/60",
        icon: "👤",
      };
  }
}
