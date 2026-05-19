import { FloatingNav } from "@/components/FloatingNav";
import { QuietMuseum } from "./QuietMuseum";

export const dynamic = "force-dynamic";

export default function V1() {
  return (
    <div className="relative h-dvh w-full bg-paper text-ink">
      <QuietMuseum />
      <FloatingNav />
    </div>
  );
}
