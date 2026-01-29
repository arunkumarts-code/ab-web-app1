import { RoachRoadCell } from "@/components/roads/road/cells/RoachRoadCell";
import RoadGrid from "../RoadGrid";

export type RoachRoadQuad = (1 | 2 | null)[];

export const RoachRoadDummyData: RoachRoadQuad[][] = [
   // Column 1
   [
      [1, 2, 1, 1],
      [null, null, null, null],
      [null, null, null, null],
   ],

   // Column 2
   [
      [2, null, 2, 1],
      [2, 1, 2, null],
      [2, null, null, null],
   ],

   // Column 3
   [
      [1, null, null, null],
      [2, 2, null, null],
      [null, null, null, null],
   ],

   // Column 4
   [
      [2, null, null, null],
      [1, null, null, null],
      [null, null, null, null],
   ],
];

const RoachRoad = () => {  
   return (
      <RoadGrid columns={RoachRoadDummyData.length} cellSize={32} rows={3}>
         {RoachRoadDummyData.map((col: any, x: any) =>
            col.map((cell: any, y: any) => (
               <div
                  key={`${x}-${y}`}
                  style={{
                     gridColumn: x + 1,
                     gridRow: y + 1,
                  }}
                  className="flex items-center justify-center border border-border"
               >
                  <div className="grid grid-cols-2 grid-rows-2 w-full h-full">
                     {cell.map((v: any, i: any) =>
                        v !== null ? (
                           <div className="flex justify-center items-center">
                              <RoachRoadCell key={i + v} cell={v} size={10} />
                           </div>
                        ) : (
                           <div key={i} />
                        )
                     )}
                  </div>
               </div>
            ))
         )}

      </RoadGrid>
   );
};

export default RoachRoad;
