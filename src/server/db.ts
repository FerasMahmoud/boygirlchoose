import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql } from "@vercel/postgres";
import * as schema from "./schema";

export const db = drizzle(sql, { schema });

export const hasDb = Boolean(process.env.POSTGRES_URL ?? process.env.POSTGRES_URL_NON_POOLING);
