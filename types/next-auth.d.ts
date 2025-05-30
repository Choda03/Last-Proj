import NextAuth from "next-auth";

// Extend the built-in types for NextAuth

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string | null;
      id?: string | null;
      emailVerified?: boolean;
      createdAt?: Date;
    };
  }
  interface User {
    role?: string | null;
    id?: string | null;
    emailVerified?: boolean;
    createdAt?: Date;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string | null;
    id?: string | null;
    emailVerified?: boolean;
    createdAt?: Date;
  }
} 