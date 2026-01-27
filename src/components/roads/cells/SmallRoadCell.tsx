interface EyeRoadCellProps {
   cell: any;
   size: number;
}

export function SmallRoadCell({ cell, size }: EyeRoadCellProps) {
   if (!cell) return <div className={`m-1`} style={{ width: size, height: size }} />;

   const bgColor = cell === 1 ? "bg-red-600" : "bg-blue-600";

   return (
      <div
         className={`m-1 rounded-full ${bgColor}`}
         style={{ width: size, height: size }}
      />
   );
}
