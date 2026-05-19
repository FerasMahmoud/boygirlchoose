import { createHash } from "node:crypto";
import { headers } from "next/headers";

const SALT = process.env.IP_SALT ?? "boygirl-default-salt";

export type ClientId = {
  ipHash: string;
  ipFamily: "ipv4" | "ipv6" | "unknown";
  rawIp: string;
};

export async function getClientId(): Promise<ClientId> {
  const h = await headers();
  const raw =
    pickFirst(h.get("x-vercel-forwarded-for")) ??
    pickFirst(h.get("x-forwarded-for")) ??
    h.get("x-real-ip") ??
    "0.0.0.0";
  const ip = raw.trim();
  const family = detectFamily(ip);
  const normalized = normalize(ip, family);
  const ipHash = createHash("sha256").update(`${SALT}:${normalized}`).digest("hex");
  return { ipHash, ipFamily: family, rawIp: ip };
}

export async function getIpHash(): Promise<string> {
  return (await getClientId()).ipHash;
}

function pickFirst(header: string | null): string | null {
  if (!header) return null;
  const first = header.split(",")[0]?.trim();
  return first || null;
}

function detectFamily(ip: string): "ipv4" | "ipv6" | "unknown" {
  if (/^\d{1,3}(?:\.\d{1,3}){3}$/.test(ip)) return "ipv4";
  if (ip.includes(":")) return "ipv6";
  return "unknown";
}

// Collapse IPv6 to /64 prefix (household subnet). IPv4 unchanged.
function normalize(ip: string, family: "ipv4" | "ipv6" | "unknown"): string {
  if (family !== "ipv6") return ip;
  const expanded = expandIpv6(ip);
  if (!expanded) return ip;
  return `${expanded.split(":").slice(0, 4).join(":")}::/64`;
}

function expandIpv6(ip: string): string | null {
  if (!ip.includes(":")) return null;
  const [head, tail] = ip.split("::");
  const headParts = head ? head.split(":") : [];
  const tailParts = tail ? tail.split(":") : [];
  const missing = 8 - headParts.length - tailParts.length;
  if (missing < 0) return null;
  const middle = Array(missing).fill("0");
  return [...headParts, ...middle, ...tailParts].map((p) => p.padStart(4, "0")).join(":");
}
