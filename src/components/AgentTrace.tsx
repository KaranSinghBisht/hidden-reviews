import { Check, Loader2 } from "lucide-react";
import type { AgentStep } from "@/lib/types";

/** The agent's live "watch it work" trace: plan → search → read → synthesise. */
export function AgentTrace({ steps }: { steps: AgentStep[] }) {
  if (steps.length === 0) return null;
  return (
    <div className="mx-auto w-full max-w-md space-y-3 text-left">
      {steps.map((s, i) => (
        <div key={i} className="flex items-start gap-3">
          <span className="mt-0.5 shrink-0">
            {s.status === "done" ? (
              <Check className="h-4 w-4 text-positive" />
            ) : (
              <Loader2 className="h-4 w-4 animate-spin text-accent" />
            )}
          </span>
          <div className="min-w-0">
            <p className="text-sm text-cream">{s.label}</p>
            {s.detail && <p className="text-xs text-muted">{s.detail}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}
