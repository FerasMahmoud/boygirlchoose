import { FloatingNav } from "@/components/FloatingNav";
import { GenerativeCalm } from "@/components/vote/GenerativeCalm";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <div className="relative h-dvh w-full overflow-hidden">
      <GenerativeCalm />
      <FloatingNav />
    </div>
  );
}
