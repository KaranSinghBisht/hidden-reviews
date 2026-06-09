import type { DigResult } from "@/lib/types";
import seedData from "./seeds.json";

const seeds = seedData as unknown as Record<string, DigResult>;

/** Query → URL slug. "Joe's Pizza NYC" → "joes-pizza-nyc". */
export function slugify(query: string): string {
  return query
    .trim()
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Slug → best-effort human query for live digs. "sony-wh-1000xm5" → "Sony Wh 1000xm5". */
export function deslugify(slug: string): string {
  return slug
    .replace(/-+/g, " ")
    .trim()
    .replace(/\b[a-z]/g, (c) => c.toUpperCase());
}

/** Stable, deterministic case number for the dossier chrome. */
export function caseNo(slug: string): string {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  return `HR-${1000 + (h % 9000)}`;
}

const slugIndex: Record<string, DigResult> = {};
for (const k of Object.keys(seeds)) slugIndex[slugify(k)] = seeds[k];

export function getSeedBySlug(slug: string): DigResult | undefined {
  return slugIndex[slug];
}

/**
 * Carry the user's exact query (casing/punctuation) across navigation without
 * polluting the URL — the path stays a clean slug. Falls back to deslugify for
 * cold/shared loads.
 */
export function stashQuery(query: string): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(`hr:q:${slugify(query)}`, query);
  } catch {
    /* storage unavailable — deslugify fallback handles it */
  }
}

export function readQuery(slug: string): string | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    return sessionStorage.getItem(`hr:q:${slug}`) ?? undefined;
  } catch {
    return undefined;
  }
}

/** Pre-captured cases shown on the Archive wall, in display order. */
export const FEATURED: { slug: string; result: DigResult }[] = [
  "dyson v15",
  "dune part two",
  "joe's pizza nyc",
  "notion",
  "peloton bike+",
]
  .map((k) => ({ slug: slugify(k), result: seeds[k] }))
  .filter((c): c is { slug: string; result: DigResult } => Boolean(c.result));
