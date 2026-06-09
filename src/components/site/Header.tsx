import Link from "next/link";

const NAV = [
  { label: "The Archive", href: "/" },
  { label: "How it works", href: "/#how-it-works" },
  { label: "Connect your AI", href: "/#connect" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/60 bg-ink/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="text-[15px] font-semibold tracking-tight text-cream transition-opacity hover:opacity-80"
        >
          hidden<span className="text-accent">.</span>reviews
        </Link>
        <nav className="flex items-center gap-5 sm:gap-7">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hidden font-mono text-[11px] uppercase tracking-widest text-muted transition-colors hover:text-cream sm:inline"
            >
              {item.label}
            </Link>
          ))}
          <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface/40 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-positive" />
            Live web via Nimble
          </span>
        </nav>
      </div>
    </header>
  );
}
