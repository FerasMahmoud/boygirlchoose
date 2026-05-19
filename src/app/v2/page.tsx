import { FloatingNav } from "@/components/FloatingNav";
import { KineticManuscript } from "./KineticManuscript";

export const dynamic = "force-dynamic";

export default function V2() {
  return (
    <div className="relative h-dvh w-full overflow-hidden bg-linen text-ink">
      <KineticManuscript />
      <FloatingNav />
    </div>
  );
}
