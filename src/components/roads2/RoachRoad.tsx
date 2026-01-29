import { useMemo } from 'react'
import { toRoaQuadData, updateEyeRoad } from '@/components/roads/generate-road';
import { RawResults } from '@/constants/roads-list';
import RoadGrid from './RoadGrid';
import { RoachRoadCell } from '../roads/road/cells/RoachRoadCell';

const RoachRoad = ({columns}: {columns:number}) => {

   const roachRoadData = useMemo(() => {
      const roach = updateEyeRoad(RawResults, 4);
      const roachRoadData = toRoaQuadData(roach.board);

      return roachRoadData
   }, []);

  return (
     <RoadGrid columns={columns} cellSize={32} rows={3} dataLength={roachRoadData.length}>
        {roachRoadData.map((col: any, x: number) =>
         col.map((cell: any, y: number) => (
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
                        <div key={`${x}-${y}-${i}`} className="flex justify-center items-center">
                           <RoachRoadCell key={i} cell={v} size={12} />
                        </div>
                     ) : (
                        <div key={`${x}-${y}-${i}`} />
                     )
                  )}
               </div>
            </div>
         ))
      )}
   </RoadGrid>
  )
}

export default RoachRoad