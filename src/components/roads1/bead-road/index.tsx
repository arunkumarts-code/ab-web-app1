import React, { useMemo } from 'react'
import RoadGrid from '../RoadGrid'
import { updateDishRoad } from '@/components/roads/generate-road';
import { RawResults } from '@/constants/roads-list';
import { BeadRoadCell } from '@/components/roads/road/cells/BeadRoadCell';

const BeadRoad = () => {
   const beadRoadData = useMemo(() => {
      const bead = updateDishRoad(RawResults);
      return bead
   }, []);
   
  return (
   <RoadGrid columns={beadRoadData.length} cellSize={32} rows={6}>
      {beadRoadData.map((col: any, x: any) =>
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
               <BeadRoadCell cell={cell} size={20} />
            </div>
            ) : null
         )
      )}
   </RoadGrid>
  )
}

export default BeadRoad