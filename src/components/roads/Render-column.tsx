import { RoadTypesType } from "@/constants/roads-list";
import { RoadCellFactory } from "./Render-cell-factory";

interface RenderColumnProps {
   RoadColumn: any[];
   CircleSize: number;
   roadType: RoadTypesType;
}

export const RenderColumn = ({
   RoadColumn = [],
   CircleSize = 25,
   roadType,
}: RenderColumnProps) => {
   return (
      <div
         style={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
         }}
      >
         {RoadColumn.map((cell, i) => (
            <RoadCellFactory
               key={i}
               cell={cell}
               size={CircleSize}
               roadType={roadType}
            />
         ))}
      </div>
   );
};
