import "server-only";
import { prisma } from "./db";
import { readSessionFromCookieStore } from "./session";

export async function getCurrentUser() {
  const session = await readSessionFromCookieStore();
  if (!session?.userId) return null;
  return await prisma.user.findUnique({ where: { id: session.userId } });
}

export async function requireUser() {
  const u = await getCurrentUser();
  if (!u) throw new Error("UNAUTHENTICATED");
  return u;
}

export async function requireBuyer() {
  const u = await requireUser();
  if (u.role !== "BUYER") throw new Error("BUYER_ONLY");
  return u;
}
