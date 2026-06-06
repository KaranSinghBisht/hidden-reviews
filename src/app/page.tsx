"use client";

import { useState } from "react";
import { SearchBar } from "@/components/SearchBar";
import { DigResults } from "@/components/DigResults";
import type { DigResult } from "@/lib/types";

const EXAMPLES = ["Dyson V15", "Notion", "Peloton Bike+"];

export default function Home() {
  const [result, setResult] = useState<DigResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeQuery, setActiveQuery] = useState("");

  async function runDig(query: string) {
    setLoading(true);
    setError(null);
    setActiveQuery(query);
    try {
      const res = await fetch("/api/dig", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Something went wrong.");
      setResult(data as DigResult);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  if (!result) {
    return (
      <main className="bg-beam flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <Wordmark />
        <p className="mt-4 max-w-md text-lg leading-relaxed text-muted">
          See the reviews they bury. We dig past page-one marketing to the
          honest, buried takes real people leave — with sources.
        </p>
        <div className="mt-8 w-full max-w-xl">
          <SearchBar onSearch={runDig} loading={loading} />
        </div>
        {loading ? (
          <p className="mt-6 animate-pulse font-mono text-sm text-accent">
            Digging through the long tail…
          </p>
        ) : error ? (
          <p className="mt-6 text-sm text-negative">{error}</p>
        ) : (
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-sm">
            <span className="text-muted">Try</span>
            {EXAMPLES.map((ex) => (
              <button
                key={ex}
                onClick={() => runDig(ex)}
                className="rounded-full border border-line px-3 py-1 text-cream/80 transition-colors hover:border-accent/50 hover:text-accent"
              >
                {ex}
              </button>
            ))}
          </div>
        )}
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <div className="sticky top-0 z-10 border-b border-line bg-ink/80 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-4 px-4 py-3">
          <button
            onClick={() => {
              setResult(null);
              setError(null);
            }}
            className="shrink-0"
            aria-label="New search"
          >
            <Wordmark small />
          </button>
          <div className="flex-1">
            <SearchBar
              onSearch={runDig}
              loading={loading}
              initialQuery={activeQuery}
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="mx-auto mt-4 max-w-3xl px-4">
          <p className="rounded-lg border border-negative/30 bg-negative/10 px-4 py-2 text-sm text-negative">
            {error}
          </p>
        </div>
      )}

      <div className="px-4 pt-8">
        <DigResults result={result} />
      </div>
    </main>
  );
}

function Wordmark({ small = false }: { small?: boolean }) {
  return (
    <span
      className={
        small
          ? "text-lg font-semibold tracking-tight text-cream"
          : "text-4xl font-semibold tracking-tight text-cream sm:text-5xl"
      }
    >
      hidden<span className="text-accent">.</span>reviews
    </span>
  );
}
