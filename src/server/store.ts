import { db, hasDb } from "./db";
import { votes, type Vote } from "./schema";
import { eq, sql } from "drizzle-orm";

type MemVote = Vote;
const mem = new Map<string, MemVote>();
let memId = 1;

export async function upsertVote(input: {
  choice: "boy" | "girl";
  name: string;
  ipHash: string;
}): Promise<Vote> {
  if (!hasDb) {
    const existing = mem.get(input.ipHash);
    const now = new Date();
    const row: MemVote = existing
      ? { ...existing, choice: input.choice, name: input.name, updatedAt: now }
      : {
          id: memId++,
          choice: input.choice,
          name: input.name,
          ipHash: input.ipHash,
          createdAt: now,
          updatedAt: now,
        };
    mem.set(input.ipHash, row);
    return row;
  }

  const [row] = await db
    .insert(votes)
    .values(input)
    .onConflictDoUpdate({
      target: votes.ipHash,
      set: { choice: input.choice, name: input.name, updatedAt: new Date() },
    })
    .returning();
  if (!row) throw new Error("upsert failed");
  return row;
}

export async function getMyVote(ipHash: string): Promise<Vote | null> {
  if (!hasDb) return mem.get(ipHash) ?? null;
  const rows = await db.select().from(votes).where(eq(votes.ipHash, ipHash)).limit(1);
  return rows[0] ?? null;
}

export async function getTallies(): Promise<{ boy: number; girl: number; total: number }> {
  if (!hasDb) {
    let boy = 0;
    let girl = 0;
    for (const v of mem.values()) v.choice === "boy" ? boy++ : girl++;
    return { boy, girl, total: boy + girl };
  }
  const rows = await db
    .select({ choice: votes.choice, n: sql<number>`count(*)::int` })
    .from(votes)
    .groupBy(votes.choice);
  let boy = 0;
  let girl = 0;
  for (const r of rows) r.choice === "boy" ? (boy = r.n) : (girl = r.n);
  return { boy, girl, total: boy + girl };
}

export async function listVotes(limit = 100): Promise<Vote[]> {
  if (!hasDb) return [...mem.values()].sort((a, b) => +b.updatedAt - +a.updatedAt).slice(0, limit);
  return db.select().from(votes).orderBy(sql`updated_at desc`).limit(limit);
}
