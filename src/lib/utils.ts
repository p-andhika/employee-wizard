import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generateEmployeeId = (
  department: string,
  existingIds: Array<string>,
): string => {
  const deptCode = department.substring(0, 3).toUpperCase();
  const deptIds = existingIds
    .filter((id) => id.startsWith(deptCode))
    .map((id) => parseInt(id.split("-")[1]) || 0);
  const nextNum = deptIds.length > 0 ? Math.max(...deptIds) + 1 : 1;
  return `${deptCode}-${String(nextNum).padStart(3, "0")}`;
};

export const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
