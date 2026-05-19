import { sql } from "drizzle-orm";
import { db, hasDb } from "./db";
import { type Vote, votes } from "./schema";

const mem: Vote[] = [];
let memId = 1;

export async function insertVote(input: {
  choice: "boy" | "girl";
  name: string;
  babyName: string | null;
}): Promise<Vote> {
  if (!hasDb) {
    const now = new Date();
    const row: Vote = { id: memId++, ...input, createdAt: now, updatedAt: now };
    mem.push(row);
    return row;
  }
  const [row] = await db.insert(votes).values(input).returning();
  if (!row) throw new Error("insert failed");
  return row;
}

export async function getTallies(): Promise<{ boy: number; girl: number; total: number }> {
  if (!hasDb) {
    let boy = 0;
    let girl = 0;
    for (const v of mem) v.choice === "boy" ? boy++ : girl++;
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

export async function listVotes(limit = 200): Promise<Vote[]> {
  if (!hasDb) return [...mem].sort((a, b) => +b.updatedAt - +a.updatedAt).slice(0, limit);
  return db.select().from(votes).orderBy(sql`updated_at desc`).limit(limit);
}
