import { eq, sql } from "drizzle-orm";
import { db, hasDb } from "./db";
import { type Vote, votes } from "./schema";

type MemVote = Vote;
const mem = new Map<number, MemVote>();
let memId = 1;

export const MAX_PER_IP = 12;

export async function countVotesByIp(ipHash: string): Promise<number> {
  if (!hasDb) {
    let n = 0;
    for (const v of mem.values()) if (v.ipHash === ipHash) n++;
    return n;
  }
  const rows = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(votes)
    .where(eq(votes.ipHash, ipHash));
  return rows[0]?.n ?? 0;
}

export async function insertVote(input: {
  choice: "boy" | "girl";
  name: string;
  babyName: string | null;
  ipHash: string;
}): Promise<Vote> {
  if (!hasDb) {
    const now = new Date();
    const row: MemVote = {
      id: memId++,
      choice: input.choice,
      name: input.name,
      babyName: input.babyName,
      ipHash: input.ipHash,
      createdAt: now,
      updatedAt: now,
    };
    mem.set(row.id, row);
    return row;
  }
  const [row] = await db.insert(votes).values(input).returning();
  if (!row) throw new Error("insert failed");
  return row;
}

export async function getVoteById(id: number): Promise<Vote | null> {
  if (!hasDb) return mem.get(id) ?? null;
  const rows = await db.select().from(votes).where(eq(votes.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function updateVoteById(
  id: number,
  patch: { choice: "boy" | "girl"; name: string; babyName: string | null },
): Promise<Vote | null> {
  if (!hasDb) {
    const v = mem.get(id);
    if (!v) return null;
    const next = { ...v, ...patch, updatedAt: new Date() };
    mem.set(id, next);
    return next;
  }
  const [row] = await db
    .update(votes)
    .set({ ...patch, updatedAt: new Date() })
    .where(eq(votes.id, id))
    .returning();
  return row ?? null;
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
