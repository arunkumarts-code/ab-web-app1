interface BeadRoadCellProps {
   cell: any;
   size: number;
}

export function BeadRoadCell({ cell, size }: BeadRoadCellProps) {
   if (!cell) return <div className={`m-1`} style={{ width: size, height: size }} />;

   const bgColor =
      cell === 1
         ? "bg-red-600"
         : cell === 2
            ? "bg-blue-600"
            : "bg-green-500";

   return (
      <div
         className={`m-1 rounded-full ${bgColor}`}
         style={{ width: size, height: size }}
      />
   );
}
