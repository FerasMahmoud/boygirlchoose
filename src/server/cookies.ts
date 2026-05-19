import { cookies } from "next/headers";
import { createHmac, randomBytes } from "node:crypto";

const SECRET = process.env.IP_SALT ?? "boygirl-default-salt";
const COOKIE_NAME = "bgc_vid";
const MAX_AGE = 60 * 60 * 24 * 365; // 1 year

function sign(payload: string): string {
  const sig = createHmac("sha256", SECRET).update(payload).digest("base64url").slice(0, 22);
  return `${payload}.${sig}`;
}

function verify(value: string): string | null {
  const lastDot = value.lastIndexOf(".");
  if (lastDot < 1) return null;
  const payload = value.slice(0, lastDot);
  const sig = value.slice(lastDot + 1);
  const expected = createHmac("sha256", SECRET).update(payload).digest("base64url").slice(0, 22);
  return constantTimeEq(sig, expected) ? payload : null;
}

function constantTimeEq(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

export async function readVoteCookie(): Promise<number | null> {
  const jar = await cookies();
  const v = jar.get(COOKIE_NAME)?.value;
  if (!v) return null;
  const payload = verify(v);
  if (!payload) return null;
  const id = Number.parseInt(payload, 10);
  return Number.isFinite(id) && id > 0 ? id : null;
}

export async function writeVoteCookie(voteId: number): Promise<void> {
  const jar = await cookies();
  jar.set(COOKIE_NAME, sign(String(voteId)), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export function generateSessionId(): string {
  return randomBytes(16).toString("hex");
}
