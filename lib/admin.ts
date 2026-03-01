import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "admin_s";

function getSecret() {
  return process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || "fallback";
}

export function makeAdminToken(email: string): string {
  const ts = Date.now().toString();
  const payload = `${email}|${ts}`;
  const sig = createHmac("sha256", getSecret()).update(payload).digest("hex");
  return Buffer.from(`${payload}|${sig}`).toString("base64url");
}

function verifyAdminToken(token: string): string | null {
  try {
    const decoded = Buffer.from(token, "base64url").toString();
    const lastPipe = decoded.lastIndexOf("|");
    const secondLastPipe = decoded.lastIndexOf("|", lastPipe - 1);
    if (secondLastPipe === -1) return null;

    const payload = decoded.slice(0, lastPipe);
    const sig = decoded.slice(lastPipe + 1);

    const expectedSig = createHmac("sha256", getSecret()).update(payload).digest("hex");
    const a = Buffer.from(sig.padEnd(expectedSig.length, "0"), "hex");
    const b = Buffer.from(expectedSig, "hex");
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

    const [email, ts] = payload.split("|");
    if (Date.now() - parseInt(ts) > 7 * 24 * 60 * 60 * 1000) return null;
    return email;
  } catch {
    return null;
  }
}

export async function requireAdmin(): Promise<{ email: string } | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  if (!token) return null;

  const email = verifyAdminToken(token);
  if (!email || email !== process.env.ADMIN_EMAIL) return null;
  return { email };
}
