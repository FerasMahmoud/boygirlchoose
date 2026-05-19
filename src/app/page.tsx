import { FloatingNav } from "@/components/FloatingNav";
import { GenerativeCalm } from "@/components/vote/GenerativeCalm";
import { getIpHash } from "@/server/ip";
import { getMyVote } from "@/server/store";

export const dynamic = "force-dynamic";

export default async function Home() {
  const ipHash = await getIpHash();
  const mine = await getMyVote(ipHash);
  return (
    <div className="relative h-dvh w-full overflow-hidden">
      <GenerativeCalm />
      <FloatingNav showDashboard={mine !== null} theme={mine?.choice ?? "neutral"} />
    </div>
  );
}
