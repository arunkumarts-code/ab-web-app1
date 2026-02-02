import { GameActions, GameResult, GameResult1, PredictionType } from "@/types";
import { NextPredictionAndBet } from "../games/prediction-and-bet";

const GAME_DATA = 'User_Game_Data';

const convertResult = (results: GameResult1[]) => {
   const raw = results.map((p) => {
      let resultType = 0;
      if (p.Winner === "B") resultType = 1;
      else if (p.Winner === "P") resultType = 2;
      else if (p.Winner === "T") resultType = 3;
      return { resultType, isBankerPair: false, isPlayerPair: false };
   });
   return raw;
}

export const saveResults = (results: GameResult1[]): GameResult[] => {
   localStorage.setItem(GAME_DATA, JSON.stringify(results));
   const convertedResult = convertResult(results);
   return convertedResult;
};

export const loadResults = (): GameResult[] => {
   const gameData = JSON.parse(localStorage.getItem(GAME_DATA) ?? "[]");
   const convertedResult = convertResult(gameData);
   return convertedResult;
};

export const getCurrectPredictionBet = () => {
   const gameData = JSON.parse(localStorage.getItem(GAME_DATA) ?? "[]");
   if (gameData.length >0) {
      const lastItem = gameData.at(-1);
      const predictionBet = lastItem.NextHand;
      if(predictionBet === "P") return "Player";
      else if(predictionBet === "B") return "Banker";
      else return "Wait";
   }
   else{
      return "Wait";
   }
}

export const addHand = (cHand: GameActions) => {
   const gameData: GameResult1[] = JSON.parse(localStorage.getItem(GAME_DATA) ?? "[]");

   if(gameData.length === 0) {
      const initGameHand: GameResult1 = {
         Id: 1,
         Winner: cHand,
         GameName : "Cocoa Beach",
         Prediction: "W",
         Bet: 0,
         DetectedPattern: "-",
         NextHand: "W",
         iCount1: 0,
         iCount2: 0,
         VirtualWinRequired: false,
         VirtualLossRequired: false,
      }
      const result = saveResults([initGameHand]);
      return result;
   }else{
      const lastGame = gameData.at(-1);

      const addGameNand: GameResult1 = {
         Id: gameData.length+1,
         Winner: cHand,
         GameName: "Cocoa Beach",
         Prediction: lastGame?.NextHand || "W",
         Bet: 0,
         DetectedPattern: "-",
         NextHand: "W",
         iCount1: 0,
         iCount2: 0,
         VirtualWinRequired: false,
         VirtualLossRequired: false,
      };

      if (gameData.length > 5-1) {
         const tmpNextHand = NextPredictionAndBet(gameData);
         addGameNand.DetectedPattern = tmpNextHand.DetectedPattern;
         addGameNand.NextHand = tmpNextHand.Prediction as PredictionType;
         addGameNand.iCount1 = tmpNextHand.iCount1;
         addGameNand.iCount2 = tmpNextHand.iCount2;
         addGameNand.VirtualLossRequired = tmpNextHand.VirtualLossRequired || false;
         addGameNand.VirtualWinRequired = tmpNextHand.VirtualWinRequired || false;
      }
      
      const newGameData = [...gameData, addGameNand];
      const result = saveResults(newGameData);
      return result;
   }

}

export const restartGame = (): GameResult[] => {
   try {
      localStorage.removeItem(GAME_DATA);
      return [];
   } catch (error) {
      console.error('Error restarting game:', error);
      return [];
   }
}

export const undoHand = (): GameResult[] => {
   try {
      const gameData: GameResult1[] = JSON.parse(
         localStorage.getItem(GAME_DATA) ?? "[]"
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