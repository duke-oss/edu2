import { auth } from "@/auth";

export async function requireAdmin() {
  const session = await auth();
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!session?.user?.email || session.user.email !== adminEmail) return null;
  return session;
}
