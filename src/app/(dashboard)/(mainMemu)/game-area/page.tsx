"use client";

import BeadRoad from "@/components/roads/bead-road/BeadRoad";
import BigRoad from "@/components/roads/big-road/BigRoad";
import EyeRoad from "@/components/roads/big-eye-boad/EyeRoad";
import RoachRoad from "@/components/roads/cockroach-road/RoachRoad";
import SmallRoad from "@/components/roads/small-raod/SmallRoad";
import { Briefcase, Package, TrendingUp } from "lucide-react";
import { ReactNode, useEffect, useRef, useState } from "react";
import { BsGrid3X3GapFill } from "react-icons/bs";
import { FaUndo, FaTrashAlt, FaWallet } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { GameResult } from "@/types";
import GlobalLoader from "@/components/common/GlobalLoader";
import { addHand, getCurrectPredictionBet, loadResults, restartGame, undoHand } from "@/services/users";

const GameAreaPage = () => {
  const [currentBet, setCurrentBet] = useState<"Banker" | "Player" | "Wait">("Banker");
  const [openMenuDial, setOpenMenuDial] = useState(false);
  const [currentResult, setCurrentResult] = useState<GameResult[]>([]);
  const [loadingGame, setLoadingGame] =useState(true);

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

  const getCurrentBet = () => {
    const gameCurrectBet = getCurrectPredictionBet();
    setCurrentBet(gameCurrectBet)
  }

  useEffect(() => {
    const gameResult = loadResults();
    setCurrentResult(gameResult);
    getCurrentBet();
    setLoadingGame(false);
  }, []);
  
  useEffect(() => {
    if (loadingGame) return;
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
  }, [loadingGame]);

  const handleAddHand = (handType: "P" | "B" | "T") => {
    setLoadingGame(true);
    const result = addHand(handType);
    setCurrentResult([...result]);
    getCurrentBet();
    setLoadingGame(false);
  }

  const handleRestart = () => {
    setLoadingGame(true);
    setOpenMenuDial(false);
    const result = restartGame();
    setCurrentResult(result);
    getCurrentBet();
    setLoadingGame(false);
  }

  const handleUndo = () => {
    setLoadingGame(true);
    setOpenMenuDial(false);
    const result = undoHand();
    setCurrentResult(result);
    getCurrentBet();
    setLoadingGame(false);
  }
  
  if (loadingGame){
    return (
      <GlobalLoader />
    )
  }

  return (
    <div className="space-y-2 flex flex-col h-full w-full">
      {/* Road Tabs */}
      <div className="space-y-3 flex flex-col h-full w-full">
        <div className="flex w-full flex-col md:flex-row gap-2">
          <div className="w-full overflow-hidden" ref={roadRefs.bigRoad}>
            <div className="p-1 text-xs bg-primary text-white tracking-wider rounded-tl-lg rounded-tr-lg">Big Road</div>
            <BigRoad columns={widths.bigRoad} data={currentResult} cellSize={25} />
          </div>
          <div className="w-full overflow-hidden" ref={roadRefs.beadRoad}>
            <div className="p-1 text-xs bg-primary text-white tracking-wider rounded-tl-lg rounded-tr-lg">Bead Road</div>
            <BeadRoad columns={widths.beadRoad} data={currentResult} cellSize={25} />
          </div>
        </div>

        <div className="flex w-full flex-col gap-2">
          <div className="w-full overflow-hidden" ref={roadRefs.eyeRoad}>
            <div className="p-1 text-xs bg-primary text-white tracking-wider rounded-tl-lg rounded-tr-lg">Big Eye Boy Road</div>
            <EyeRoad columns={widths.eyeRoad} data={currentResult} cellSize={25} />
          </div>

          <div className="flex flex-1 w-full flex-col md:flex-row gap-2">
            <div className="w-full overflow-hidden" ref={roadRefs.smallRoad}>
              <div className="p-1 text-xs bg-primary text-white tracking-wider rounded-tl-lg rounded-tr-lg">Small Road</div>
              <SmallRoad columns={widths.smallRoad} data={currentResult} cellSize={25} />
            </div>

            <div className="w-full overflow-hidden" ref={roadRefs.roachRoad}>
              <div className="p-1 text-xs bg-primary text-white tracking-wider rounded-tl-lg rounded-tr-lg">Cockroach Road</div>
              <RoachRoad columns={widths.roachRoad} data={currentResult} cellSize={25} />
            </div>
          </div>

        </div>
      </div>

      {/* Prediction */}
      <div className="space-y-2">
        {/* Parity Items */}
        <div className="w-full flex justify-between items-center gap-2">
          {/* Parity */}
          <div className="bg-gray-200 dark:bg-gray-800 px-3 py-1 flex-1 min-w-20 rounded-md shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="font-bold text-xs text-gray-800 dark:text-gray-400 uppercase tracking-wider">Parity</div>
            <div className=" font-bold text-sm text-gray-900 dark:text-gray-100">1:3:1</div>
          </div>

          {/* Player */}
          <div className="bg-blue-100 dark:bg-blue-500/30 px-3 py-1 flex-1 min-w-20 rounded-md shadow-sm border border-blue-200 dark:border-blue-900">
            <div className="font-bold text-xs text-blue-800 dark:text-white uppercase tracking-wider">Player</div>
            <div className=" font-bold text-sm text-blue-700 dark:text-white">6</div>
          </div>

          {/* Tie */}
          <div className="bg-green-100 dark:bg-green-400/30 px-3 py-1 flex-1 min-w-20 rounded-md shadow-sm border border-green-200 dark:border-green-900">
            <div className="font-bold text-xs text-green-800 dark:text-white uppercase tracking-wider">Tie</div>
            <div className=" font-bold text-sm text-green-700 dark:text-white">1</div>
          </div>

          {/* Banker */}
          <div className="bg-red-100 dark:bg-red-500/30 px-3 py-1 flex-1 min-w-20 rounded-md shadow-sm border border-red-200 dark:border-pink-900">
            <div className="font-bold text-xs text-red-600 dark:text-white uppercase tracking-wider">Banker</div>
            <div className=" font-bold text-sm text-red-700 dark:text-white">8</div>
          </div>

          {/* Hand */}
          <div className="bg-gray-300 dark:bg-gray-800 px-3 py-1 flex-1 min-w-20 rounded-md shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="font-bold text-xs text-gray-800 dark:text-gray-400 uppercase tracking-wider">Hand</div>
            <div className=" font-bold text-sm text-gray-900 dark:text-gray-100">15</div>
          </div>
        </div>

        {/* Prediction and Stake */}
        <div className="w-full flex overflow-hidden gap-2">
          {/* Active Bet */}
          <div className={`flex flex-1 flex-col ${currentBet === "Banker" ? "bg-red-400" : currentBet === "Player" ? "bg-blue-500" : "bg-gray-500"} rounded-lg px-2 py-1`}>
            <div className="flex justify-between items-center">
              <div className="text-xs text-white font-bold">CHOP</div>
              <div className="text-xs text-white font-bold">2 - 1</div>
            </div>

            <div className="text-lg text-white font-bold text-center uppercase">{currentBet}</div>

            <div className="text-xs text-white font-bold">Authors MM</div>
          </div>

          {/* Stake */}
          <div className="flex flex-1 flex-col items-center justify-center gap-1 bg-gray-700 rounded-lg">
            <span className="text-sm uppercase font-semibold text-gray-300">
              Stake
            </span>

            <span className="text-lg font-bold text-white">
              1.00
            </span>
          </div>
        </div>

        {/* MM */}
        <div
          className="@container flex justify-between items-center gap-2 overflow-x-auto scrollbar-custom">
          {/* Base */}
          <div className="bg-primary/90 px-2 py-1 flex-shrink-0 flex-1 min-w-20 rounded-md shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="font-bold text-xs text-white dark:text-gray-400 tracking-wider text-center">Base</div>
            <div className="text-sm text-white text-center">1.00</div>
          </div>

          {/* Step 2 */}
          <div className="bg-primary/10 px-2 py-1 flex-shrink-0 flex-1 min-w-20 rounded-md shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="font-bold text-xs text-gray-500 dark:text-gray-400 tracking-wider text-center">Step 2</div>
            <div className=" text-sm text-center">3.00</div>
          </div>

          {/* Step 3 */}
          <div className="bg-primary/10 px-2 py-1 flex-shrink-0 flex-1 min-w-20 rounded-md shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="font-bold text-xs text-gray-500 dark:text-gray-400 tracking-wider text-center">Step 3</div>
            <div className=" text-sm text-center">7.00</div>
          </div>

          {/* Step 4 */}
          <div className="bg-primary/10 px-2 py-1 flex-shrink-0 flex-1 min-w-20 rounded-md shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="font-bold text-xs text-gray-500 dark:text-gray-400 tracking-wider text-center">Step 4</div>
            <div className="text-sm text-center">15.00</div>
          </div>

          {/* Step 5 */}
          <div className="bg-primary/10 px-2 py-1 flex-shrink-0 flex-1 min-w-20 rounded-md shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="font-bold text-xs text-gray-500 dark:text-gray-400 tracking-wider text-center">Step 5</div>
            <div className="text-sm text-center">15.00</div>
          </div>
        </div>

        {/* Current profit */}
        <div className="w-full flex gap-2 overflow-hidden">
          {/* Start */}
          <div className="bg-surface p-2 flex-1 min-w-20 rounded-md shadow-sm border border-border  flex justify-between">
            <div className="pl-1 flex flex flex-col justify-start flex-1">
              <div className="font-bold text-sm text-primary tracking-wider ">Start</div>
              <div className="pt-1 font-bold text-sm text-gray-900 dark:text-gray-100 ">500.00</div>
            </div>
            <div>
              <div className="p-1 text-primary ">
                <Briefcase className="text-sm w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Now */}
          <div className="bg-surface p-2 flex-1 min-w-20 rounded-md shadow-sm border border-border  flex justify-between">
            <div className="pl-1 flex flex flex-col justify-start flex-1">
              <div className="font-bold text-sm text-gray-400 tracking-wider ">Now</div>
              <div className="pt-1 font-bold text-sm text-gray-900 dark:text-gray-100 ">6.00</div>
            </div>
            <div>
              <div className="p-1 text-gray-400 ">
                <FaWallet className="text-sm" />
              </div>
            </div>
          </div>

          {/* Units */}
          <div className="bg-surface p-2 flex-1 min-w-20 rounded-md shadow-sm border border-border  flex justify-between">
            <div className="pl-1 flex flex flex-col justify-start flex-1">
              <div className="font-bold text-sm text-red-400 tracking-wider ">Units</div>
              <div className="pt-1 font-bold text-sm text-gray-900 dark:text-gray-100 ">3.00</div>
            </div>
            <div>
              <div className="p-1 text-red-400 ">
                <Package className="text-sm w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Profit */}
          <div className="bg-surface p-2 flex-1 min-w-20 rounded-md shadow-sm border border-border flex justify-between">
            <div className="pl-1 flex flex flex-col justify-start flex-1">
              <div className="font-bold text-sm text-green-600 tracking-wider ">Profit</div>
              <div className="pt-1 font-bold text-sm text-gray-900 dark:text-gray-100 ">+ 6.00</div>
            </div>
            <div>
              <div className="p-1 text-green-500 ">
                <TrendingUp className="text-sm w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Peak and Drawdown */}
        <div className="w-full flex gap-2 overflow-hidden">
          {/* Peak */}
          <div className="bg-primary/20 py-1 flex-1 min-w-20 rounded-md shadow-sm border border-border flex justify-between items-center flex-col w-full">

            <div className="font-bold text-sm text-primary tracking-wider w-full text-center">Peak</div>

            <div className=" font-bold text-sm text-gray-900 dark:text-gray-100 ">0.00</div>
          </div>

          {/* Trough */}
          <div className="bg-primary/20 py-1 flex-1 min-w-20 rounded-md shadow-sm border border-border  flex justify-between items-center flex-col">

            <div className="font-bold text-sm text-primary tracking-wider  w-full text-center">Trough</div>

            <div className="font-bold text-sm text-gray-900 dark:text-gray-100 ">0.00</div>
          </div>

          {/* DrawDown */}
          <div className="bg-primary/20 py-1 flex-1 min-w-20 rounded-md shadow-sm border border-border  flex justify-between items-center flex-col">

            <div className="font-bold text-sm text-primary tracking-wider  w-full text-center">DrawDown</div>

            <div className=" font-bold text-sm text-gray-900 dark:text-gray-100 ">0%</div>
          </div>
        </div>

        {/* Actions (P B T S Menu) */}
        <div className="flex h-16 gap-3 justify-around items-center select-none">
          <div
            className='flex justify-center items-center
                  w-14 h-14
                  shadow-lg
                  font-bold text-xl
                  rounded-full
                  border-2 border-gray-400
                  bg-blue-500
                  text-white
                  cursor-pointer
                  transition-all duration-200
                  hover:scale-110 hover:shadow-xl
                  active:scale-95'
            onClick={() => handleAddHand("P")}
          >
            P
          </div>
          <div
            className='flex justify-center items-center
                  w-14 h-14
                  shadow-lg
                  font-bold text-xl
                  rounded-full
                  border-2 border-gray-400
                  bg-red-400
                  text-white
                  cursor-pointer
                  transition-all duration-200
                  hover:scale-110 hover:shadow-xl
                  active:scale-95'
            onClick={() => handleAddHand("B")}
          >
            B
          </div>
          <div
            className='flex justify-center items-center
                  w-14 h-14
                  shadow-lg
                  font-bold text-xl
                  rounded-full
                  border-2 border-gray-400
                  bg-green-500
                  text-white
                  cursor-pointer
                  transition-all duration-200
                  hover:scale-110 hover:shadow-xl
                  active:scale-95'
            onClick={() => handleAddHand("T")}
          >
            T
          </div>
          <div
            className='flex justify-center items-center
                  w-14 h-14
                  shadow-lg
                  font-bold text-xl
                  rounded-full
                  border-2 border-gray-400
                  bg-yellow-500
                  text-white
                  cursor-pointer
                  transition-all duration-200
                  hover:scale-110 hover:shadow-xl
                  active:scale-95'
          >
            S
          </div>
          <div className="relative flex flex-col items-center">
            {/* Actions */}
            <div
              className={`absolute bottom-16 flex flex-col gap-3
              transition-all duration-300
              ${openMenuDial
                  ? "opacity-100 translate-y-0 scale-100"
                  : "opacity-0 translate-y-4 scale-75 pointer-events-none"
              }`}
            >
              <div className="flex justify-center items-center
                w-14 h-14 rounded-full
                bg-gray-700 text-white
                shadow-md cursor-pointer  
                transition-all duration-200
                hover:scale-110 active:scale-95"
                onClick={handleRestart}
              >
                <FaTrashAlt className="h-5 w-5"/>
              </div>
              <div className="flex justify-center items-center
                w-14 h-14 rounded-full
                bg-gray-700 text-white
                shadow-md cursor-pointer  
                transition-all duration-200
                hover:scale-110 active:scale-95"
                onClick={handleUndo}
              >
                <FaUndo className="h-5 w-5" />
              </div>
            </div>
            <div
              onClick={() => setOpenMenuDial(!openMenuDial)}
              className='flex justify-center items-center
                w-14 h-14 shadow-lg font-bold text-xl
                rounded-full border-2 border-gray-400
                bg-gray-500 text-white cursor-pointer
                transition-all duration-200
                hover:scale-110 hover:shadow-xl
                active:scale-95'
            >
              {openMenuDial ? <IoClose size={24} /> : <BsGrid3X3GapFill />}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GameAreaPage