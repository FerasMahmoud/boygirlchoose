import { pgTable, serial, varchar, timestamp, pgEnum, index } from "drizzle-orm/pg-core";

export const choiceEnum = pgEnum("choice", ["boy", "girl"]);

export const votes = pgTable(
  "votes",
  {
    id: serial("id").primaryKey(),
    choice: choiceEnum("choice").notNull(),
    name: varchar("name", { length: 80 }).notNull(),
    babyName: varchar("baby_name", { length: 80 }),
    ipHash: varchar("ip_hash", { length: 64 }).notNull().unique(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({ choiceIdx: index("choice_idx").on(t.choice) }),
);

export type Vote = typeof votes.$inferSelect;
export type NewVote = typeof votes.$inferInsert;
