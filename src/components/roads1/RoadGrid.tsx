"use client";

import { useEffect, useRef, useState, ReactNode } from "react";

interface RoadGridProps {
  rows: number;
  cellSize: number;
  columns: number;           
  children: ReactNode;       
}

export default function RoadGrid({
  rows = 6,
  cellSize = 30,
  columns,
  children,
}: RoadGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [viewportWidth, setViewportWidth] = useState(0);

  // Measure available width
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver(([entry]) => {
      setViewportWidth(entry.contentRect.width);
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Decide grid width
  const dataWidth = columns * cellSize;
  const visibleColumns = Math.floor(viewportWidth / cellSize);
  const totalColumns = Math.max(columns ?? 0, visibleColumns);
  const gridWidth = totalColumns * cellSize;

  return (
    <div ref={containerRef} className="w-full">
      <div
        ref={scrollRef}
        className="overflow-x-auto hideScrollbar-custom"
      >
        <div
          className="relative grid box-border"
          style={{
            width: gridWidth,
            gridTemplateColumns: `repeat(${totalColumns}, ${cellSize}px)`,
            gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
          }}
        >
          {/* Background grid */}
          {Array.from({ length: totalColumns * rows }).map((_, i) => (
            <div
              key={i}
              className="border-1 border-border box-border"
            />
          ))}

          {/* Overlay layer (symbols go here) */}
          {children}
        </div>
      </div>
    </div>
  );
}
