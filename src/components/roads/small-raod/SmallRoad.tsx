import { useMemo } from 'react'
import { toRoadQuadData, updateEyeRoad } from '@/components/roads/generate-road';
import { RawResults } from '@/constants/roads-list';
import RoadGrid from '../RoadGrid';
import { SmallRoadCell } from './SmallRoadCell';

const SmallRoad = ({columns}: {columns:number}) => {

   const smallRoadData = useMemo(() => {
      const small = updateEyeRoad(RawResults, 2);
      const smallRoadData = toRoadQuadData(small.board);

      return smallRoadData
   }, []);

  return (
     <RoadGrid columns={columns} cellSize={32} rows={3} dataLength={smallRoadData.length}>
        {smallRoadData.map((col: any, x: number) =>
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
                           <SmallRoadCell cell={v} size={12} />
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

export default SmallRoad