import React, { useMemo } from 'react'
import RoadGrid from '../RoadGrid'
import { updateBigRoad } from '@/components/roads/generate-road';
import { RawResults } from '@/constants/roads-list';
import { BigRoadCell } from '@/components/roads/road/cells/BigRoadCell';

const BigRoad = () => {
   const bigRoadData = useMemo(() => {
      const big = updateBigRoad(RawResults);
      return big.board
   }, []);
  return (
   <RoadGrid columns={bigRoadData.length} cellSize={32} rows={6}>
      {bigRoadData.map((col: any, x: any) =>
         col.map((cell: any, y: any) =>
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