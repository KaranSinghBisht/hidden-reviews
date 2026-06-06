import { Search, Brain, FileSearch } from "lucide-react";

const STEPS = [
  {
    icon: Search,
    title: "Search the live web",
    body: "Nimble crawls Reddit, Trustpilot, forums, and the long tail — the candid sources page one buries.",
  },
  {
    icon: Brain,
    title: "Reason with Claude",
    body: "Claude separates the buried truth from the marketing and scores how far the promise holds up.",
  },
  {
    icon: FileSearch,
    title: "Honest verdict + sources",
    body: "You get the real consensus, what they don’t tell you, and every claim linked back to its source.",
  },
];

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-20">
      <h2 className="text-center text-sm font-semibold uppercase tracking-widest text-muted">
        How it works
      </h2>
      <div className="mt-8 grid gap-8 sm:grid-cols-3">
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={s.title}>
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-line font-mono text-sm text-accent">
                  {i + 1}
                </span>
                <Icon className="h-5 w-5 text-muted" />
              </div>
              <h3 className="mt-3 font-semibold text-cream">{s.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted">{s.body}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
