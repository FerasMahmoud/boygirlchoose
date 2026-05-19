import { FloatingNav } from "@/components/FloatingNav";
import { GenerativeCalm } from "@/components/vote/GenerativeCalm";
import { findMyVote } from "@/server/me";

export const dynamic = "force-dynamic";

export default async function Home() {
  const mine = await findMyVote();
  return (
    <div className="relative h-dvh w-full overflow-hidden">
      <GenerativeCalm />
      <FloatingNav showDashboard={mine !== null} theme={mine?.choice ?? "neutral"} />
    </div>
  );
}
