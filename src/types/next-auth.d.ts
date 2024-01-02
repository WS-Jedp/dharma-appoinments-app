import { UserRole } from "@prisma/client";
import "next-auth";

declare module "next-auth" {
  interface User {
    id: number;
    role: UserRole;
  }

  interface Session {
    user: {
        id: number;
        role?: UserRole;
        email?: string;
    };
  }

  declare module "next-auth/jwt" {
    interface JWT {
      id: number;
      role: string;
    }
  }
}
