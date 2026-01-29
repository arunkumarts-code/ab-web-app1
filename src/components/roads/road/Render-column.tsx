import { RoadTypesType } from "@/constants/roads-list";
import { RoadCellFactory } from "./Render-cell-factory";

interface RenderColumnProps {
   RoadColumn: any[];
   CircleSize: number;
   roadType: RoadTypesType;
}

export const RenderColumn = ({
   RoadColumn = [],
   CircleSize = 40,
   roadType,
}: RenderColumnProps) => {
   return (
      <div
         className="flex flex-col">
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
