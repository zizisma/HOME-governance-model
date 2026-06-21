"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!ringRef.current || !dotRef.current) return;
    const ring: HTMLDivElement = ringRef.current;
    const dot: HTMLDivElement = dotRef.current;

    let rx = -200, ry = -200;
    let mx = -200, my = -200;
    let scale = 1;
    let raf: number;

    function onMove(e: MouseEvent) {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px)`;
      dot.style.opacity = "1";
      ring.style.opacity = "1";
    }

    function onLeave() {
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    }

    function onEnter() {
      dot.style.opacity = "1";
      ring.style.opacity = "1";
    }

    function onDown() { scale = 0.65; }
    function onUp() { scale = 1; }

    function loop() {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.transform = `translate(${rx}px, ${ry}px) scale(${scale})`;
      raf = requestAnimationFrame(loop);
    }

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
      cancelAnimationFrame(raf);
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <>
      <div
        ref={ringRef}
        style={{
          position: "fixed",
          top: -20,
          left: -20,
          width: 40,
          height: 40,
          borderRadius: "50%",
          border: "2px solid #ff018f",
          boxShadow: "0 0 12px #ff018f, 0 0 28px rgba(255,1,143,0.35)",
          pointerEvents: "none",
          zIndex: 99999,
          opacity: 0,
          transition: "opacity 0.2s ease, transform 0.08s ease",
        }}
      />
      <div
        ref={dotRef}
        style={{
          position: "fixed",
          top: -4,
          left: -4,
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: "#ffcc00",
          boxShadow: "0 0 8px #ffcc00, 0 0 18px rgba(255,204,0,0.55)",
          pointerEvents: "none",
          zIndex: 100000,
          opacity: 0,
          transition: "opacity 0.2s ease",
        }}
      />
    </>
  );
}
