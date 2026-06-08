const MCP_URL = "https://hidden-reviews.vercel.app/api/mcp";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-end sm:justify-between sm:px-6">
        <div>
          <p className="text-lg font-semibold tracking-tight text-cream">
            hidden<span className="text-accent">.</span>reviews
          </p>
          <p className="mt-1 font-serif text-[15px] italic text-muted">
            Reviews are usually hidden. Not here.
          </p>
        </div>
        <div className="space-y-1.5 font-mono text-[11px] uppercase tracking-widest text-faint sm:text-right">
          <p>An AI investigator for the honest web</p>
          <p>
            Live web via <span className="text-muted">Nimble</span> · synthesis by{" "}
            <span className="text-muted">Claude</span>
          </p>
          <p className="normal-case tracking-normal text-faint/80">{MCP_URL}</p>
          <p>DWNY 2026</p>
        </div>
      </div>
    </footer>
  );
}
