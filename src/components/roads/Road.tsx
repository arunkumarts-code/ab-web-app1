import { useEffect, useRef } from "react";
import { RenderColumn } from "./Render-column";
import { RoadTypesType } from "@/constants/roads-list";

interface RoadProps {
   roadData: any[][];
   circleSize?: number;
   roadType: RoadTypesType
}

export default function Road({
   roadData = [],
   circleSize = 15,
   roadType = "Big Road"
}: RoadProps) {
   const scrollRef = useRef<HTMLDivElement | null>(null);

   useEffect(() => {
      if (scrollRef.current) {
         scrollRef.current.scrollLeft =
            scrollRef.current.scrollWidth;
      }
   }, [roadData]);

   const filteredData = roadData.filter(
      (col) => col.filter((cell) => cell != null).length > 0
   );

   return (
      <div
         ref={scrollRef}
         style={{
            display: "flex",
            gap: 6,
            padding: "10px 0",
            overflowX: "auto",
            overflowY: "hidden",
            whiteSpace: "nowrap",
         }}
         className="hide-scrollbar"
      >
         {filteredData.map((column, index) => (
            <RenderColumn
               key={index}
               RoadColumn={column}
               CircleSize={circleSize}
               roadType={roadType}
            />
         ))}
      </div>
   );
}
