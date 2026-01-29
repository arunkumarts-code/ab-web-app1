"use client";

import { useRef, ReactNode } from "react";

interface RoadGridProps {
  rows: number;
  cellSize: number;
  columns: number;     
  dataLength: number;      
  children: ReactNode;       
}

export default function RoadGrid({
  rows = 6,
  cellSize = 32,
  columns,
  dataLength,
  children,
}: RoadGridProps) {

  const scrollRef = useRef<HTMLDivElement>(null);
  const totalColumns = Math.max(dataLength ?? 0, Math.ceil(columns / cellSize));

  return (
    <div className="w-full">
      <div
        ref={scrollRef}
        // className="overflow-x-auto scrollbar-custom"
        className="overflow-x-auto hideScrollbar-custom"
      >
        <div
          className="relative grid box-border"
          style={{
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

          {/* Overlay layer */}
          {children}
        </div>
      </div>
    </div>
  );
}
