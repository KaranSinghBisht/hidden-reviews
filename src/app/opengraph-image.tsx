import { ImageResponse } from "next/og";

export const alt = "hidden.reviews — the reviews they bury, declassified";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "84px",
          background: "#0c0a09",
          backgroundImage:
            "radial-gradient(900px 500px at 50% -10%, rgba(245,177,76,0.18), transparent 60%)",
          color: "#f5f1ea",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 26,
            letterSpacing: 10,
            textTransform: "uppercase",
            color: "#f5b14c",
          }}
        >
          An AI investigator for the honest web
        </div>
        <div style={{ fontSize: 86, fontWeight: 700, marginTop: 28, lineHeight: 1.05 }}>
          Reviews are usually hidden.
        </div>
        <div style={{ fontSize: 86, fontWeight: 700, color: "#f5b14c", lineHeight: 1.05 }}>
          Not here.
        </div>
        <div style={{ fontSize: 30, color: "#a39c92", marginTop: 34, maxWidth: 960 }}>
          The honest, buried reviews real people leave — Reddit, Trustpilot, forums —
          surfaced with sources. Live web via Nimble.
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 34,
            fontWeight: 600,
            marginTop: 56,
          }}
        >
          <span>hidden</span>
          <span style={{ color: "#f5b14c" }}>.</span>
          <span>reviews</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
