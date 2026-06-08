"use client";

import { useEffect, useRef } from "react";

/**
 * Ambient backdrop: faint fragments drifting up from the dark ("things
 * surfacing"), a soft beam from above, film grain, and an edge vignette.
 * Fixed behind all content; never interactive. Static if reduced-motion.
 */
export function Atmosphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let motes: Mote[] = [];
    let w = 0;
    let h = 0;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      canvas!.style.width = `${w}px`;
      canvas!.style.height = `${h}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(70, (w * h) / 26000));
      motes = Array.from({ length: count }, () => spawn(w, h));
    }

    function frame() {
      ctx!.clearRect(0, 0, w, h);
      for (const m of motes) {
        m.y += m.vy;
        m.x += m.vx;
        m.phase += m.flicker;
        if (m.y < -10) {
          m.y = h + 10;
          m.x = Math.random() * w;
        }
        const a = m.alpha * (0.6 + 0.4 * Math.sin(m.phase));
        ctx!.beginPath();
        ctx!.arc(m.x, m.y, m.r, 0, Math.PI * 2);
        ctx!.fillStyle = m.amber
          ? `rgba(245, 177, 76, ${a})`
          : `rgba(245, 241, 234, ${a})`;
        ctx!.fill();
      }
      raf = requestAnimationFrame(frame);
    }

    resize();
    window.addEventListener("resize", resize);
    if (reduce) {
      frame(); // draw one static field
      cancelAnimationFrame(raf);
    } else {
      raf = requestAnimationFrame(frame);
    }
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-beam" />
      <canvas ref={canvasRef} className="absolute inset-0 opacity-70" />
      <div className="absolute inset-0 grain opacity-[0.04]" />
      <div className="absolute inset-0 [background:radial-gradient(120%_100%_at_50%_0%,transparent_55%,rgba(0,0,0,0.55))]" />
    </div>
  );
}

interface Mote {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  alpha: number;
  phase: number;
  flicker: number;
  amber: boolean;
}

function spawn(w: number, h: number): Mote {
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    r: 0.5 + Math.random() * 1.4,
    vx: (Math.random() - 0.5) * 0.08,
    vy: -(0.05 + Math.random() * 0.22),
    alpha: 0.06 + Math.random() * 0.26,
    phase: Math.random() * Math.PI * 2,
    flicker: 0.004 + Math.random() * 0.01,
    amber: Math.random() < 0.22,
  };
}
