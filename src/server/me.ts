import { readVoteCookie } from "./cookies";
import { getClientId } from "./ip";
import { getMyVote, getVoteById } from "./store";
import type { Vote } from "./schema";

export async function findMyVote(): Promise<Vote | null> {
  const cookieId = await readVoteCookie();
  if (cookieId) {
    const byCookie = await getVoteById(cookieId);
    if (byCookie) return byCookie;
  }
  const { ipHash } = await getClientId();
  return getMyVote(ipHash);
}
