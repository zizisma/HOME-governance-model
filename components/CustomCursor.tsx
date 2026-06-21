"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!ring || !dot) return;

    let rx = 0, ry = 0;
    let mx = 0, my = 0;
    let raf: number;

    function onMove(e: MouseEvent) {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px)`;
    }

    function onDown() {
      ring.style.transform = `translate(${rx}px, ${ry}px) scale(0.75)`;
    }

    function onUp() {
      ring.style.transform = `translate(${rx}px, ${ry}px) scale(1)`;
    }

    function loop() {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.transform = `translate(${rx}px, ${ry}px)`;
      raf = requestAnimationFrame(loop);
    }

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      {/* Large trailing ring */}
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
          boxShadow: "0 0 12px #ff018f, 0 0 24px rgba(255,1,143,0.3)",
          pointerEvents: "none",
          zIndex: 99999,
          willChange: "transform",
          mixBlendMode: "normal",
        }}
      />
      {/* Small precise dot */}
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
          boxShadow: "0 0 6px #ffcc00, 0 0 14px rgba(255,204,0,0.5)",
          pointerEvents: "none",
          zIndex: 100000,
          willChange: "transform",
        }}
      />
    </>
  );
}
