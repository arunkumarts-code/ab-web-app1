import { useMemo } from 'react'
import { updateDishRoad } from '@/components/roads/generate-road';
import { RawResults } from '@/constants/roads-list';
import RoadGrid from './RoadGrid';
import { BeadRoadCell } from '../roads/road/cells/BeadRoadCell';

const BeadRoad = ({columns}: {columns:number}) => {
   const beadRoadData = useMemo(() => {
      const bead = updateDishRoad(RawResults);;
      return bead
   }, []);

  return (
     <RoadGrid columns={columns} cellSize={32} rows={6} dataLength={beadRoadData.length}>
      {beadRoadData.map((col: any, x: number) =>
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
               <BeadRoadCell cell={cell} size={20} />
            </div>
            ) : null
         )
      )}
   </RoadGrid>
  )
}

export default BeadRoad