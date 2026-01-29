interface RoachRoadCellProps {
   cell: any;
   size: number;
}

export function RoachRoadCell({ cell, size }: RoachRoadCellProps) {
   if (!cell) return <div className="m-1" style={{ width: size, height: size }} />;

   // Decide color based on resultType
   const color = cell === 1 ? "bg-red-600" : "bg-blue-600";

   return (
      <div
         className=" rounded-full flex items-center justify-center"
         style={{ width: size, height: size }}
      >
         {/* Diagonal slash */}
         <div
            className={`${color} w-1 h-full`}
            style={{ transform: "rotate(45deg)" }}
         />
      </div>
   );
}
