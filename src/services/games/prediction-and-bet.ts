import { MM_LOOKUP } from "../money-management/mm-lookup";
import { GAME_TYPE } from "./constants/game-types";
import { GAME_LOOKUP } from "./game-lookup";

export const Get_Max_LossCount_In_Row = (ResultList: any[] = []) => {
   const resultList = (ResultList || [])
      .map((p) => p.Result)
      .reduce(
         (rows, key, index) =>
            (index === 0 || rows[rows.length - 1][0] !== key
               ? rows.push([key])
               : rows[rows.length - 1].push(key)) && rows,
         [],
      )
      .filter((p:any) => p[0] === "Loss")
      .map((p: any) => p.length);

   if (resultList.length <= 0) return 0;

   return Math.max.apply(null, resultList);
};

export const Generate_ResultList = (ugResultList: any = [], GameType = "") => {
   const tmpResultList = ugResultList || [];
   const ResultList = tmpResultList.map((item: any) => {
      let Prediction = item.Prediction;
      if (
         item?.ugNextHand?.VirtualWinRequired === true 
      )
         Prediction = "WAIT";
      return {
         Id: item.Id,
         Winner: item.Winner,
         Prediction: Prediction,
         DetectedPattern: item.DetectedPattern,
         Result: item?.Result || "-",
         hSkip: item?.ugGame?.hSkip || false,
         ugSkip: item?.ugGame?.ugSkip || false,
         VirtualLossRequired: item?.ugNextHand?.VirtualLossRequired || false,
         VirtualWinRequired: item?.ugNextHand?.VirtualWinRequired || false,
         VirtualWoLRequired: item?.VirtualWoLRequired || false,
         Bet: item?.Bet || 0,
         Column1: item?.Column1 || "",
         Column2: item?.Column2 || "",
      };
   });
   const WinLossList = [...ResultList].reverse();
   if (GameType === GAME_TYPE.COCOA_BEACH) {
      WinLossList.forEach((item) => {
         if (item.VirtualWinRequired || item.VirtualLossRequired) {
            item.Prediction = "WAIT";
         }
      });
   }
   return { ResultList, WinLossList };
};

export const NextPredictionAndBet = (results: any, UserGame: any) => {
   let rt = {
      CurrentStreak: UserGame?.ugStreakStartIndex || 0,
      TimesBet: 1,
      DoubleBetRequired: false,
      VirtualWinRequired: false,
      VirtualLossRequired: false,
      DetectedPattern: "-",
      Prediction: "WAIT",
      IsRecoveryMode: results[results.length - 1]?.IsRecoveryMode || false,
      BetAmount: 0,
      BetUnit: 0,
      RecoveryBalance: 0,
      Shield: "off",
      Parity: [],
      Steps: null,
      PL: null,
      Sequence: 0,
      SequenceUnits: 0,
      iCount1: 0,
      iCount2: 0,
   };
   let gamePrediction = {
      Prediction: "WAIT",
      CalculateBet: false,
      VirtualWinRequired: false,
      VirtualLossRequired: false,
      DetectedPattern: "-",
   };
   let varUserGame = { ...UserGame };

   let tmpResults = results.filter((r: any) => r.Winner !== "T");

   const { gmId, mmId, ugBaseUnit } = varUserGame;
   const game_process = GAME_LOOKUP[gmId];

   // if (
   //    varUserGame?.gmId === GAME_TYPE.CINQUE ||
   //    varUserGame?.gmId === GAME_TYPE.CINQUE_II ||
   //    varUserGame?.gmId === GAME_TYPE.CINQUE_III ||
   //    varUserGame?.gmId === GAME_TYPE.SEI_I ||
   //    varUserGame?.gmId === GAME_TYPE.SEI_II ||
   //    varUserGame?.gmId === GAME_TYPE.SEI_III ||
   //    varUserGame?.gmId === GAME_TYPE.QUATTRO ||
   //    varUserGame?.gmId === GAME_TYPE.QUATTRO_II
   // )
   //    tmpResults = results || [];

   if (
      game_process !== null &&
      game_process !== undefined &&
      typeof game_process === "function"
   ) {
      // Remove tie from the results

      gamePrediction = game_process(tmpResults, UserGame);
      rt.Prediction = gamePrediction.Prediction;
      rt.DetectedPattern = gamePrediction.DetectedPattern;
      // rt.PL = gamePrediction?.PL || null;

      // if (
      //    gmId === GAME_TYPE.DORNE ||
      // ) {
      //    rt.iCount1 = gamePrediction?.iCount1 || 0;
      //    rt.iCount2 = gamePrediction?.iCount2 || 0;
      // }

      if (gamePrediction.VirtualLossRequired) rt.VirtualLossRequired = true;
      else if (gamePrediction.VirtualWinRequired) rt.VirtualWinRequired = true;
   } else {
      throw new Error(gmId + " -  Invalid Game detail provided");
   }

   let mm = {
      TimesBet: 1,
      CurrentStreak: UserGame?.ugStreakStartIndex || 0,
      BetAmount: 0,
      IsRecoveryMode: false,
      RecoveryBalance: 0,
      Sequence: 0,
      WLUnits: 0,
      SequenceUnits: 0,
   };

   let tmpResultList = [];

   // if (
   //    MM_TYPES.CHIDAM_MM === mmId ||
   //    MM_TYPES.CAMELOT_II_MM === mmId ||
   //    MM_TYPES.CAMELOT_III_MM === mmId ||
   //    MM_TYPES.ORC_III_MM == mmId
   // )
   //    tmpResultList = results || [];
   // else tmpResultList = (results || []).filter((p: any) => p.Result !== "-");
   tmpResultList = (results || []).filter((p: any) => p.Result !== "-");

   const LastResult = results[results.length - 1]?.Result || "-";
   const mm_process = MM_LOOKUP[mmId];

   if (
      mm_process !== null &&
      mm_process !== undefined &&
      typeof mm_process === "function"
   )
      mm = mm_process(tmpResultList, UserGame);
   if (gamePrediction.CalculateBet && rt.Shield === "off") {
      rt.BetAmount = mm.BetAmount;
      rt.TimesBet = mm.TimesBet;
      rt.BetUnit = mm.BetAmount / +(ugBaseUnit || 1);
      rt.DoubleBetRequired = mm.TimesBet > 1;
      rt.IsRecoveryMode = mm.IsRecoveryMode;
      rt.RecoveryBalance = mm.RecoveryBalance;
      rt.CurrentStreak = mm.CurrentStreak;
      rt.Sequence = mm?.Sequence || 0;
      // rt.WLUnits = mm?.WLUnits || 0;
      rt.SequenceUnits = mm?.SequenceUnits || 0;
   }

   // if (MM_TYPES.ORC_III_MM === mmId) {
   //    rt.RecoveryBalance = mm.RecoveryBalance;
   // }

   // if (
   //    (mm?.Steps !== null && mm?.Steps !== undefined && LastResult !== "-") ||
   //    // (["P", "B"].includes(gamePrediction.Prediction) &&
   //    MM_TYPES.CAMELOT_II_MM === mmId ||
   //    MM_TYPES.CAMELOT_III_MM === mmId
   // ) {
   //    rt.Steps = mm.Steps;
   // }

   // if (MM_TYPES.CAMELOT_II_MM === mmId || MM_TYPES.CAMELOT_III_MM === mmId) {
   //    rt.TimesBet = mm.TimesBet;
   //    rt.CurrentStreak = mm.CurrentStreak;
   // }

   return rt;
};
