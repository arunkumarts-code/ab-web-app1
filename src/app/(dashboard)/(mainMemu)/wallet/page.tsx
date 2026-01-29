"use client";

import BeadRoad from "@/components/roads/bead-road/BeadRoad"
import EyeRoad from "@/components/roads/big-eye-boad/EyeRoad"
import BigRoad from "@/components/roads/big-road/BigRoad"
import RoachRoad from "@/components/roads/cockroach-road/RoachRoad"
import SmallRoad from "@/components/roads/small-raod/SmallRoad"
import { useEffect, useRef, useState } from "react"

const WalletPage = () => {
    const roadRefs = {
      bigRoad: useRef<HTMLDivElement>(null),
      beadRoad: useRef<HTMLDivElement>(null),
      smallRoad: useRef<HTMLDivElement>(null),
      eyeRoad: useRef<HTMLDivElement>(null),
      roachRoad: useRef<HTMLDivElement>(null),
    };
    
    const [widths, setWidths] = useState({
      bigRoad: 0,
      beadRoad: 0,
      smallRoad: 0,
      eyeRoad: 0,
      roachRoad: 0,
    });
    
    useEffect(() => {
      const observers: ResizeObserver[] = [];
  
      (Object.keys(roadRefs) as Array<keyof typeof roadRefs>).forEach((key) => {
        const el = roadRefs[key].current;
        if (!el) return;
  
        const observer = new ResizeObserver(([entry]) => {
          setWidths((prev) => ({
            ...prev,
            [key]: entry.contentRect.width,
          }));
        });
  
        observer.observe(el);
        observers.push(observer);
      });
  
      return () => observers.forEach((o) => o.disconnect());
    }, []);

  return (
    <>
      <div className="space-y-3 flex flex-col h-full w-full">
        <div className="w-full bg-surface rounded-lg overflow-hidden" ref={roadRefs.bigRoad}>
          <div className="p-1 text-sm bg-primary text-white">Big Road</div>
          <BigRoad columns={widths.bigRoad} />
        </div>

        <div className="w-full flex gap-2 flex-col md:flex-row">
          <div className="w-full bg-surface rounded-lg overflow-hidden" ref={roadRefs.beadRoad}>
            {/* <div className="p-1 text-sm bg-primary text-white">Bead Road</div> */}
            <BeadRoad columns={widths.beadRoad} />
          </div>

          <div className="flex w-full flex-col">
            <div className="w-full bg-surface rounded-lg overflow-hidden" ref={roadRefs.eyeRoad}>
              {/* <div className="p-1 text-sm bg-primary text-white">Big Eye Boy Road</div> */}
              <EyeRoad columns={widths.eyeRoad} />
            </div>

            <div className="w-full bg-surface rounded-lg overflow-hidden" ref={roadRefs.smallRoad}>
              {/* <div className="p-1 text-sm bg-primary text-white">Small Road</div> */}
              <SmallRoad columns={widths.smallRoad} />
            </div>

            <div className="w-full bg-surface rounded-lg overflow-hidden" ref={roadRefs.roachRoad}>
              {/* <div className="p-1 text-sm bg-primary text-white">Cockroach Road</div> */}
              <RoachRoad columns={widths.roachRoad} />
            </div>
          </div>
        </div>

      </div>
    </>
  )
}

export default WalletPage