"use client";

import { useEffect, useId, useRef, useState } from "react";

export default function SignalIcon({
  size = 16,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  const filterId = `sig-${useId().replace(/:/g, "")}`;
  const [hovered, setHovered] = useState(false);
  const [stopped, setStopped] = useState(false);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const topRef = useRef<SVGCircleElement>(null);
  const brRef = useRef<SVGCircleElement>(null);
  const blRef = useRef<SVGCircleElement>(null);

  const CYCLE = 1000;
  const FADE_IN = 300;
  const HOLD = 400;
  const FADE_OUT = 300;

  function ease(t: number) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  useEffect(() => {
    const nodes = [topRef.current, brRef.current, blRef.current];

    if (stopped) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      nodes.forEach((n) => n?.setAttribute("opacity", "0"));
      return;
    }

    if (hovered) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      nodes.forEach((n) => n?.setAttribute("opacity", "1"));
      return;
    }

    startRef.current = null;

    function tick(ts: number) {
      if (!startRef.current) startRef.current = ts;
      const elapsed = (ts - startRef.current) % (CYCLE * 3);
      const currentStep = Math.floor(elapsed / CYCLE);
      const stepTime = elapsed % CYCLE;

      nodes.forEach((n, i) => {
        if (!n) return;
        let opacity = 0;
        if (i === currentStep) {
          if (stepTime < FADE_IN) {
            opacity = ease(stepTime / FADE_IN);
          } else if (stepTime < FADE_IN + HOLD) {
            opacity = 1;
          } else {
            opacity = ease(1 - (stepTime - FADE_IN - HOLD) / FADE_OUT);
          }
        }
        n.setAttribute("opacity", String(Math.max(0, Math.min(1, opacity))));
      });

      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [hovered, stopped]);

  function handleInteract() {
    setStopped(true);
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ color: "currentColor", cursor: "pointer" }}
      className={className}
      onMouseEnter={() => { if (!stopped) setHovered(true); }}
      onMouseLeave={() => { if (!stopped) setHovered(false); }}
      onClick={handleInteract}
      onTouchStart={handleInteract}
    >
      <defs>
        <filter id={filterId} x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="1" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <path
        d="M3 10.25C4.51878 10.25 5.75 11.4812 5.75 13C5.75 14.5188 4.51878 15.75 3 15.75C1.48122 15.75 0.25 14.5188 0.25 13C0.25 11.4812 1.48122 10.25 3 10.25ZM13 10.25C14.5188 10.25 15.75 11.4812 15.75 13C15.75 14.5188 14.5188 15.75 13 15.75C11.4812 15.75 10.25 14.5188 10.25 13C10.25 11.4812 11.4812 10.25 13 10.25ZM3 11.75C2.30964 11.75 1.75 12.3096 1.75 13C1.75 13.6904 2.30964 14.25 3 14.25C3.69036 14.25 4.25 13.6904 4.25 13C4.25 12.3096 3.69036 11.75 3 11.75ZM13 11.75C12.3096 11.75 11.75 12.3096 11.75 13C11.75 13.6904 12.3096 14.25 13 14.25C13.6904 14.25 14.25 13.6904 14.25 13C14.25 12.3096 13.3096 11.75 13 11.75ZM8 12C8.55228 12 9 12.4477 9 13C9 13.5523 8.55228 14 8 14C7.44772 14 7 13.5523 7 13C7 12.4477 7.44772 12 8 12ZM2.5 7C3.05228 7 3.5 7.44772 3.5 8C3.5 8.55228 3.05228 9 2.5 9C1.94772 9 1.5 8.55228 1.5 8C1.5 7.44772 1.94772 7 2.5 7ZM8 7C8.55228 7 9 7.44772 9 8C9 8.55228 8.55228 9 8 9C7.44772 9 7 8.55228 7 8C7 7.44772 7.44772 7 8 7ZM13.5 7C14.0523 7 14.5 7.44772 14.5 8C14.5 8.55228 14.0523 9 13.5 9C12.9477 9 12.5 8.55228 12.5 8C12.5 7.44772 12.9477 7 13.5 7ZM8 0.25C9.51878 0.25 10.75 1.48122 10.75 3C10.75 4.51878 9.51878 5.75 8 5.75C6.48122 5.75 5.25 4.51878 5.25 3C5.25 1.48122 6.48122 0.25 8 0.25ZM8 1.75C7.30964 1.75 6.75 2.30964 6.75 3C6.75 3.69036 7.30964 4.25 8 4.25C8.69036 4.25 9.25 3.69036 9.25 3C9.25 2.30964 8.69036 1.75 8 1.75ZM2.5 2C3.05228 2 3.5 2.44772 3.5 3C3.5 3.55228 3.05228 4 2.5 4C1.94772 4 1.5 3.55228 1.5 3C1.5 2.44772 1.94772 2 2.5 2ZM13.5 2C14.0523 2 14.5 2.44772 14.5 3C14.5 3.55228 14.0523 4 13.5 4C12.9477 4 12.5 3.55228 12.5 3C12.5 2.44772 12.9477 2 13.5 2Z"
        fill="currentColor"
        opacity="0.25"
      />

      <circle
        ref={topRef}
        cx="8"
        cy="3"
        r="2.25"
        fill="#fff8f0"
        opacity="0"
        filter={`url(#${filterId})`}
      />
      <circle
        ref={brRef}
        cx="13"
        cy="13"
        r="2.25"
        fill="#fff8f0"
        opacity="0"
        filter={`url(#${filterId})`}
      />
      <circle
        ref={blRef}
        cx="3"
        cy="13"
        r="2.25"
        fill="#fff8f0"
        opacity="0"
        filter={`url(#${filterId})`}
      />
    </svg>
  );
}
