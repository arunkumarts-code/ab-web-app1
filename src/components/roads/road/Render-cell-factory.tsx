import { BigRoadCell } from "./cells/BigRoadCell";
import { BeadRoadCell } from "./cells/BeadRoadCell";
import { EyeRoadCell } from "./cells/EyeRoadCell";
import { RoadTypesType } from "@/constants/roads-list";
import { SmallRoadCell } from "./cells/SmallRoadCell";
import { RoachRoadCell } from "./cells/RoachRoadCell";

export function RoadCellFactory({
   cell,
   size,
   roadType,
}: {
   cell: any;
   size: number;
   roadType: RoadTypesType;
}) {
   switch (roadType) {
      case "Big Road":
         return <BigRoadCell cell={cell} size={size} />;

      case "Bead Road":
         return <BeadRoadCell cell={cell} size={size} />;

      case "Eye":
         return <EyeRoadCell cell={cell} size={size} />;
         
      case "Small":
         return <SmallRoadCell cell={cell} size={size} />;

      case "Roach":
         return <RoachRoadCell cell={cell} size={size} />;

      default:
         return null;
   }
}
