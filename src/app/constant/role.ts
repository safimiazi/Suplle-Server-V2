export const ROLE = {
    ADMIN: "admin",
    EMPLOYEE: "employee",
    CUSTOMER: "customer",
} as const;
export type Role = typeof ROLE[keyof typeof ROLE];
