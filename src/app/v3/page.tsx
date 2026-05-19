import { FloatingNav } from "@/components/FloatingNav";
import { GenerativeCalm } from "./GenerativeCalm";

export const dynamic = "force-dynamic";

export default function V3() {
  return (
    <div className="relative h-dvh w-full overflow-hidden">
      <GenerativeCalm />
      <FloatingNav />
    </div>
  );
}
