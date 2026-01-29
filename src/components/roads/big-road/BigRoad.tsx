import { useMemo } from 'react'
import { updateBigRoad } from '@/components/roads/generate-road';
import { RawResults } from '@/constants/roads-list';
import { BigRoadCell } from '@/components/roads/big-road/BigRoadCell';
import RoadGrid from '../RoadGrid';

const BigRoad = ({columns}: {columns:number}) => {
   const bigRoadData = useMemo(() => {
      const big = updateBigRoad(RawResults);
      return big.board
   }, []);
   
  return (
     <RoadGrid columns={columns} cellSize={32} rows={6} dataLength={bigRoadData.length}>
      {bigRoadData.map((col: any, x: number) =>
         col.map((cell: any, y: number) =>
            cell ? (
            <div
               key={`${x}-${y}`}
               style={{
                  gridColumn: x + 1,
                  gridRow: y + 1,
               }}
               className="flex items-center justify-center border-1 border-border"
            >
               <BigRoadCell cell={cell} size={20} />
            </div>
            ) : null
         )
      )}
   </RoadGrid>
  )
}

export default BigRoad