import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import type { Session } from "next-auth";

export async function getTypedSession(): Promise<Session | null> {
  return await getServerSession(authOptions) as Session;
} 