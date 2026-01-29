import { useEffect, useRef, useState } from "react";
import { RoadTypesType } from "@/constants/roads-list";
import { RoadCellFactory } from "./Render-cell-factory";

interface RoadProps {
   roadData: any[][];
   circleSize?: number;
   roadType: RoadTypesType
}

const ROWS = 6;

export default function Road({
   roadData,
   circleSize = 20,
   roadType = "Big Road",
}: RoadProps) {
   const scrollRef = useRef<HTMLDivElement>(null);
   const containerRef = useRef<HTMLDivElement>(null);

   const CELL_SIZE = circleSize + 10;
   const [viewportWidth, setViewportWidth] = useState(0);

   useEffect(() => {
      if (!containerRef.current) return;

      const observer = new ResizeObserver(([entry]) => {
         setViewportWidth(entry.contentRect.width);
      });

      observer.observe(containerRef.current);
      return () => observer.disconnect();
   }, []);

   // Compute widths
   const dataWidth = roadData.length * CELL_SIZE;
   const gridWidth = Math.max(viewportWidth, dataWidth);
   const columns = Math.ceil(gridWidth / CELL_SIZE);

   // Auto scroll when data exceeds viewport
   useEffect(() => {
      if (scrollRef.current && dataWidth > viewportWidth) {
         scrollRef.current.scrollLeft =
            scrollRef.current.scrollWidth;
      }
   }, [roadData, dataWidth, viewportWidth]);

   return (
      <div
         ref={containerRef}
         className="w-full"
      >
         <div
            ref={scrollRef}
            className="overflow-x-auto"
         >
            <div
               className="grid overflow-hidden box-border "
               style={{
                  width: gridWidth,
                  gridTemplateColumns: `repeat(${columns}, ${CELL_SIZE}px)`,
                  gridTemplateRows: `repeat(${ROWS}, ${CELL_SIZE}px)`,
               }}
            >
               {/* Background grid */}
               {Array.from({ length: columns * ROWS }).map((_, i) => (
                  <div key={i} className="border border-border box-border " />
               ))}

               {/* Symbols */}
               {roadData.map((column, col) =>
                  column.map((cell, row) =>
                     cell ? (
                        <div
                           key={`${col}-${row}`}
                           style={{
                              gridColumn: col + 1,
                              gridRow: row + 1,
                           }}
                           className="flex items-center justify-center border border-border box-border "
                        >
                           <RoadCellFactory
                              cell={cell}
                              size={circleSize}
                              roadType={roadType}
                           />
                        </div>
                     ) : null
                  )
               )}
            </div>
         </div>
      </div>
   ); 
}
