"use client";

import { type RefObject, useEffect, useRef } from "react";

type Particle = { x: number; y: number; vx: number; vy: number; r: number };

export function ParticleField({
  host,
  color,
  hover,
}: {
  host: RefObject<HTMLElement | null>;
  color: string;
  hover: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<{
    particles: Particle[];
    mouse: { x: number; y: number; active: boolean };
    raf: number | null;
    dpr: number;
    w: number;
    h: number;
  }>({
    particles: [],
    mouse: { x: 0, y: 0, active: false },
    raf: null,
    dpr: 1,
    w: 0,
    h: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = host.current;
    if (!canvas || !parent) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const s = stateRef.current;
    s.dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    const resize = () => {
      const r = parent.getBoundingClientRect();
      s.w = r.width;
      s.h = r.height;
      canvas.width = Math.floor(r.width * s.dpr);
      canvas.height = Math.floor(r.height * s.dpr);
      canvas.style.width = `${r.width}px`;
      canvas.style.height = `${r.height}px`;
      const target = Math.min(140, Math.floor((r.width * r.height) / 18000));
      s.particles = Array.from({ length: target }, () => ({
        x: Math.random() * r.width,
        y: Math.random() * r.height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: 0.6 + Math.random() * 1.6,
      }));
    };

    const onMove = (e: MouseEvent) => {
      const r = parent.getBoundingClientRect();
      s.mouse.x = e.clientX - r.left;
      s.mouse.y = e.clientY - r.top;
      s.mouse.active = true;
    };
    const onLeave = () => {
      s.mouse.active = false;
    };

    const tick = () => {
      ctx.save();
      ctx.scale(s.dpr, s.dpr);
      ctx.clearRect(0, 0, s.w, s.h);
      ctx.fillStyle = color;
      for (const p of s.particles) {
        if (s.mouse.active) {
          const dx = s.mouse.x - p.x;
          const dy = s.mouse.y - p.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 40000) {
            const f = (1 - d2 / 40000) * 0.04;
            p.vx += dx * f * 0.02;
            p.vy += dy * f * 0.02;
          }
        }
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.96;
        p.vy *= 0.96;
        if (p.x < 0 || p.x > s.w) p.vx *= -1;
        if (p.y < 0 || p.y > s.h) p.vy *= -1;
        if (!s.mouse.active) {
          p.vx += (Math.random() - 0.5) * 0.02;
          p.vy += (Math.random() - 0.5) * 0.02;
        }
        ctx.globalAlpha = 0.6;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
      s.raf = requestAnimationFrame(tick);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(parent);
    parent.addEventListener("mousemove", onMove);
    parent.addEventListener("mouseleave", onLeave);
    s.raf = requestAnimationFrame(tick);

    return () => {
      if (s.raf) cancelAnimationFrame(s.raf);
      ro.disconnect();
      parent.removeEventListener("mousemove", onMove);
      parent.removeEventListener("mouseleave", onLeave);
    };
  }, [host, color]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-500"
      style={{ opacity: hover ? 1 : 0.7 }}
    />
  );
}
