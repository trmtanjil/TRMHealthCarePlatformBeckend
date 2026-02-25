import { Role } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string; // এখানে নিশ্চিত করুন বানানটি 'userId' ই আছে
        role: Role;
        email: string;
      };
    }
  }
}