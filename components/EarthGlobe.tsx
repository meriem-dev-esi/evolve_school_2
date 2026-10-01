"use client";

import { useEffect, useRef } from "react";
import { createEarth } from "@/lib/earth";

export default function EarthGlobe() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let earth: Awaited<ReturnType<typeof createEarth>> | null = null;
    let cancelled = false;

    createEarth(containerRef.current).then((instance) => {
      // React may have already cleaned up the effect.
      if (cancelled) {
        instance.dispose();
        return;
      }

      earth = instance;
      earth.play();
    });

    return () => {
      cancelled = true;

      earth?.dispose();
      earth = null;
    };
  }, []);

  return (
    <div className="relative h-full w-full">
      <div ref={containerRef} className="h-full w-full" />
      <nav
        aria-label="City map links"
        className="pointer-events-none absolute inset-x-0 top-2 z-10 flex justify-center gap-2 opacity-0 transition-opacity focus-within:pointer-events-auto focus-within:opacity-100"
      >
        <a
          href="https://www.google.com/maps/search/?api=1&query=36.7538,3.0588"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-emerald-400 bg-zinc-950 px-3 py-2 text-xs font-semibold text-white outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
        >
          Algiers
        </a>
        <a
          href="https://www.google.com/maps/search/?api=1&query=36.365,6.6147"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-emerald-400 bg-zinc-950 px-3 py-2 text-xs font-semibold text-white outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
        >
          Constantine
        </a>
      </nav>
    </div>
  );
}
