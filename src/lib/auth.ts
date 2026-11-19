import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { connectDB } from "@/lib/mongodb";
import { User, type Role } from "@/lib/models";
function getSecret() {
  const value = process.env.AUTH_SECRET || (process.env.NODE_ENV !== "production" ? "development-only-change-this-secret-32chars" : "");
  if (!value || value.length < 32) throw new Error("AUTH_SECRET must be set to at least 32 characters");
  return new TextEncoder().encode(value);
}
export type SessionUser = { id: string; name: string; email: string; role: Role };
export async function setSession(user: SessionUser) {
  const token = await new SignJWT(user).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("7d").sign(getSecret());
  (await cookies()).set("localtrust_session", token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 7 });
}
export async function getSession(): Promise<SessionUser | null> {
  const token = (await cookies()).get("localtrust_session")?.value;
  if (!token) return null;
  try { return (await jwtVerify(token, getSecret())).payload as unknown as SessionUser; } catch { return null; }
}
export async function requireRole(...roles: Role[]) {
  const session = await getSession();
  if (!session || !roles.includes(session.role)) throw new Error("Unauthorized");
  return session;
}
export async function sessionWithUser() {
  const session = await getSession(); if (!session) return null;
  await connectDB(); const user = await User.findById(session.id).select("name email phone address profileImage role").lean();
  return user ? { ...user, id: String(user._id) } : null;
}
