import { GameActions, GameResult, GameResult1, PredictionType } from "@/types";
import { NextPredictionAndBet } from "../common/prediction-and-bet";
import { GAME_LISTES } from "./constants/game-lists";
import { USER_GAME_RESULT, USER_PROFILE } from "@/constants/roads-list";

const convertResult = (results: any[]) => {
   const raw = results.map((p) => {
      let resultType = 0;
      if (p.Winner === "B") resultType = 1;
      else if (p.Winner === "P") resultType = 2;
      else if (p.Winner === "T") resultType = 3;
      return { resultType, isBankerPair: false, isPlayerPair: false };
   });
   return raw;
}

export const saveResults = (results: any[]): any[] => {
   localStorage.setItem(USER_GAME_RESULT, JSON.stringify(results));
   const convertedResult = convertResult(results);
   return convertedResult;
};

export const loadResults = (): any[] => {
   const gameData = JSON.parse(localStorage.getItem(USER_GAME_RESULT) ?? "[]");
   const convertedResult = convertResult(gameData);
   return convertedResult;
};

export const getCurrectGameData = () => {
   const userProfileStore = localStorage.getItem(USER_PROFILE);
   const userProfile = JSON.parse(userProfileStore ?? "{}");
   const userGameResultStore = localStorage.getItem(USER_GAME_RESULT);
   const userGameResult = JSON.parse(userGameResultStore ?? "[]");

   let rt = {
      Prediction: "Wait",
      MMStepIndex: 0,
      PlayerCount: 0,
      BankerCount: 0,
      TieCount: 0,
      HandCount: 0,
      StartingBalance: userProfile.defaultStartingBalance || 0,
      CurrentBalance: 0,
      ProfitAmount: 0,
   }
   const lastGameResult = userGameResult.at(-1);

   if (userGameResult.length === 0) {
      return rt;
   }

   userGameResult.forEach((result: any)=>{
      rt.HandCount += 1;
      if (result.Winner === "P") rt.PlayerCount += 1;
      if (result.Winner === "B") rt.BankerCount += 1;
      if (result.Winner === "T") rt.TieCount += 1;
   })

   const predictionBet = lastGameResult.NextHand.Prediction;
   if(predictionBet === "P") {
      rt.Prediction = "Player";
   } 
   else if(predictionBet === "B") {
      rt.Prediction = "Banker";
   } 
   else {
      rt.Prediction = "Wait";
   }
   
   rt.MMStepIndex = lastGameResult.NextHand.MMStep;
   rt.CurrentBalance = lastGameResult.CurrentBalance;
   rt.ProfitAmount = lastGameResult.ProfitAmount;

   return rt;
}

export const addHand = (hand: GameActions) => {
   const userProfileStore = localStorage.getItem(USER_PROFILE);
   const userProfile = JSON.parse(userProfileStore ?? "{}");
   const userGameResultStore = localStorage.getItem(USER_GAME_RESULT);
   const userGameResult = JSON.parse(userGameResultStore ?? "[]");
   const gameData = GAME_LISTES[userProfile.defaultGame];

   const lastGameResult = userGameResult.at(-1);

   let rt = {
      Id: userGameResult.length + 1,
      Winner: hand,
      Prediction: lastGameResult?.NextHand.Prediction ?? "WAIT",
      Result: "-",
      Bet: lastGameResult?.NextHand.BetAmount ?? 0,
      DetectedPattern: lastGameResult?.NextHand.DetectedPattern ?? "-",
      NextHand: {
         DetectedPattern: "-",
         Prediction: "WAIT",
         BetAmount: 0,
         BetUnit: 0,
         MMStep: 0,
      },
      MMStep: lastGameResult?.NextHand.MMStep ?? 0,
      iCount1: 0,
      iCount2: 0,
      VirtualWinRequired: false,
      VirtualLossRequired: false,
      BaseUnit: lastGameResult?.NextHand.BetUnit || userProfile.defaultBaseUnit,
      StartingBalance: userProfile.defaultStartingBalance,
      CurrentBalance: lastGameResult?.CurrentBalance || userProfile.defaultStartingBalance,
      ProfitAmount: lastGameResult?.ProfitAmount || 0,
      GMId: userProfile.defaultGame,
      MMId: userProfile.defaultMM,
   }

   if (
      rt.Prediction !== "WAIT" &&
      rt.Prediction !== "C1" &&
      rt.Prediction !== "C2" &&
      rt.Winner !== "T"
   ){
      rt.Result = rt.Winner === rt.Prediction ? "Win" : "Loss";
   }

   if (rt.Result === "Win") {
      if (rt.Winner === "B") rt.Bet *= 0.95;
   } else if (rt.Result === "Loss") {
      rt.Bet = -rt.Bet;
      rt.BaseUnit = -rt.BaseUnit;
   } else {
      rt.Bet = 0;
      rt.BaseUnit = 0;
   }

   rt.CurrentBalance = Number(
      (rt.CurrentBalance + rt.Bet).toFixed(2)
   );

   rt.ProfitAmount = Number(
      (rt.ProfitAmount + rt.Bet).toFixed(2)
   );

   let newGameResult = [...userGameResult, rt] 
   if (newGameResult.length > gameData.gmStartAt - 1) {
      const tmpNextHand = NextPredictionAndBet(newGameResult, userProfile);
      rt.iCount1 = tmpNextHand.iCount1;
      rt.iCount2 = tmpNextHand.iCount2;
      rt.VirtualLossRequired = tmpNextHand.VirtualLossRequired;
      rt.VirtualWinRequired = tmpNextHand.VirtualWinRequired;
      rt.NextHand.BetAmount = tmpNextHand.BetAmount
      rt.NextHand.BetUnit = tmpNextHand.BetUnit
      rt.NextHand.Prediction = tmpNextHand.Prediction
      rt.NextHand.DetectedPattern = tmpNextHand.DetectedPattern
      rt.NextHand.MMStep = tmpNextHand.MMStep
      console.log(rt)
   }
   newGameResult = [...userGameResult, rt] 
   
   return saveResults(newGameResult);
}

export const restartGame = (): GameResult[] => {
   try {
      localStorage.removeItem(USER_GAME_RESULT);
      return [];
   } catch (error) {
      console.error('Error restarting game:', error);
      return [];
   }
}

export const undoHand = (): GameResult[] => {
   try {
      const gameData: GameResult1[] = JSON.parse(
         localStorage.getItem(USER_GAME_RESULT) ?? "[]"
      );

      if (gameData.length === 0) {
         return [];
      }

      const newGameData = gameData.slice(0, -1);
      return saveResults(newGameData);
   } catch (error) {
      console.error('Error undoing hand:', error);
      return [];
   }
}