import { readVoteCookie } from "./cookies";
import { getVoteById } from "./store";
import type { Vote } from "./schema";

export async function findMyVote(): Promise<Vote | null> {
  const cookieId = await readVoteCookie();
  if (!cookieId) return null;
  return getVoteById(cookieId);
}
