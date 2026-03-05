import { auth } from "@/auth";

export async function requireAdmin(): Promise<{ email: string } | null> {
  const session = await auth();
  if (!session?.user?.email || session.user.role !== "admin") return null;
  return { email: session.user.email };
}
