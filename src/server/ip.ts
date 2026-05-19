import { createHash } from "node:crypto";
import { headers } from "next/headers";

const SALT = process.env.IP_SALT ?? "boygirl-default-salt";

export async function getIpHash(): Promise<string> {
  const h = await headers();
  const xff = h.get("x-forwarded-for") ?? "";
  const ip = xff.split(",")[0]?.trim() || h.get("x-real-ip") || "0.0.0.0";
  return createHash("sha256").update(`${SALT}:${ip}`).digest("hex");
}
