import { UtensilsCrossed, Package, Clapperboard } from "lucide-react";
import { Card } from "@/components/ui/Card";

const CASES = [
  {
    icon: UtensilsCrossed,
    title: "Restaurants",
    blurb:
      "Before you book — the real diner takes from Reddit and forums, not just the 4.5-star facade.",
    example: "Joe's Pizza NYC",
  },
  {
    icon: Package,
    title: "Products",
    blurb:
      "Few reviews on the listing? We pull the long tail — Reddit, niche blogs — so you don't buy blind.",
    example: "Anker 737 power bank",
  },
  {
    icon: Clapperboard,
    title: "Movies & shows",
    blurb:
      "What's actually worth your night — candid takes curated from Letterboxd and Reddit.",
    example: "Dune Part Two",
  },
];

export function UseCases({ onTry }: { onTry: (query: string) => void }) {
  return (
    <section className="mx-auto max-w-4xl px-4 py-20">
      <h2 className="text-center text-2xl font-semibold tracking-tight text-cream sm:text-3xl">
        Google Maps for reviews is old. Asking an AI isn’t enough.
      </h2>
      <p className="mx-auto mt-3 max-w-2xl text-center leading-relaxed text-muted">
        Top results and chat assistants only see the shiny, top-of-search
        surface. hidden.reviews digs the candid, buried truth — before you buy,
        book, or watch.
      </p>
      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {CASES.map((c) => {
          const Icon = c.icon;
          return (
            <Card key={c.title} className="flex flex-col p-6">
              <Icon className="h-6 w-6 text-accent" />
              <h3 className="mt-4 text-lg font-semibold text-cream">
                {c.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                {c.blurb}
              </p>
              <button
                onClick={() => onTry(c.example)}
                className="mt-4 self-start rounded-full border border-line px-3 py-1 text-sm text-cream/80 transition-colors hover:border-accent/50 hover:text-accent"
              >
                Try “{c.example}”
              </button>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
