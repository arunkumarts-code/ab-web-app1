import { GAME_TYPE } from "./constants/game-types";
import { Generate_ResultList, Get_Max_LossCount_In_Row, NextPredictionAndBet } from "./prediction-and-bet";

const USER_RESULT_LIST = 'User_Result_list';

const convertResult = (results: any[]) => {
   console.log(results);
   
   // const raw = results.map((p) => {
   //    let resultType = 0;
   //    if (p.Winner === "B") resultType = 1;
   //    else if (p.Winner === "P") resultType = 2;
   //    else if (p.Winner === "T") resultType = 3;
   //    return { resultType, isBankerPair: false, isPlayerPair: false };
   // });
   return [];
}

export const saveResults = (results: any) => {
   localStorage.setItem(USER_RESULT_LIST, JSON.stringify(results));
   const convertedResult = convertResult(results);
   return convertedResult;
};

export const loadResults = () => {
   const gameResult = JSON.parse(localStorage.getItem(USER_RESULT_LIST) ?? "{}");
   const convertedResult = convertResult(gameResult.ugResultList);
   return convertedResult;
};

export const getCurrectPredictionBet = () => {
   const gameResult = JSON.parse(localStorage.getItem(USER_RESULT_LIST) ?? "[]");
   if (gameResult.length >0) {
      const lastItem = gameResult.at(-1);
      const predictionBet = lastItem.NextHand;
      if(predictionBet === "P") return "Player";
      else if(predictionBet === "B") return "Banker";
      else return "Wait";
   }
   else{
      return "Wait";
   }
}

export const restartGame = () => {
   try {
      localStorage.removeItem(USER_RESULT_LIST);
      return [];
   } catch (error) {
      console.error('Error restarting game:', error);
      return [];
   }
}

export const undoHand = () => {
   try {
      const gameResult: any = JSON.parse(
         localStorage.getItem(USER_RESULT_LIST) ?? "[]"
      );

      if (gameResult.length === 0) {
         return [];
      }

      const newGameData = gameResult.slice(0, -1);
      return saveResults(newGameData);
   } catch (error) {
      console.error('Error undoing hand:', error);
      return [];
   }
}

export const addHand = (cHand: any) => {
   let NextHand = {
      CurrentId: 1,
      VirtualWinRequired: false,
      VirtualLossRequired: false,
      DetectedPattern: "-",
      Prediction: "WAIT",
      BetAmount: 0,
      BetUnit: 0,
      RecoveryBalance: 0,
      Parity: [] as any[],
      WLIndicators: {
         show: true,
         LossInRow: 0,
         vWin: 0,
         vLoss: 0,
         Win: 0,
         Loss: 0,
         WinPercentage: 0,
      },
   };
   let currentHand = {
      Id: 1,
      Winner: "-",
      Prediction: "WAIT",
      DetectedPattern: "-",
      VirtualWoLRequired: false,
      Bet: 0,
      WLUnit: 0,
      Result: "-",
      LossNo: 0,
      Count1: 0,
      Count2: 0,
      Column1: "",
      Column2: "",
      ugNextHand: {},
   };

   const userGame = JSON.parse(localStorage.getItem("User_Game") ?? "{}");

   currentHand.Winner = cHand;
   let ResultList = userGame.ugResultList || [];
   let pNextHand = userGame.ugNextHand || {};

   let result = "-";
   let betAmount = +pNextHand?.BetAmount || 0;
   let betUnit = Math.round(+pNextHand?.BetUnit || 0);

   delete userGame.ugResultList;
   delete userGame.ugWinnersList;
   delete userGame.ugIsCompleted;
   delete userGame.ugMMHistory;

   if ( ResultList.length <= 0 ) {
      currentHand.Id = pNextHand?.CurrentId || 1;
      currentHand.ugNextHand = pNextHand;
      userGame.ugCurrentBalance = userGame.ugStartingBalance;
   } else if (userGame.ugStartAt - 1 > ResultList.length) {
      currentHand.Id = pNextHand?.CurrentId || 1;
      currentHand.ugNextHand = pNextHand;
   } else {
      currentHand.Id = pNextHand.CurrentId;
      currentHand.Bet = pNextHand.BetAmount;
      currentHand.DetectedPattern = pNextHand.DetectedPattern;
      currentHand.Prediction = pNextHand.Prediction;
      currentHand.VirtualWoLRequired =
         pNextHand.VirtualWinRequired || pNextHand.VirtualLossRequired;
      currentHand.WLUnit = Math.round(pNextHand.BetUnit || 0);
      currentHand.ugNextHand = { ...pNextHand };
      if (
         pNextHand.Prediction !== "WAIT" &&
         pNextHand.Prediction !== "C1" &&
         pNextHand.Prediction !== "C2" &&
         currentHand.Winner !== "T"
      )
         result = currentHand.Winner === pNextHand.Prediction ? "Win" : "Loss";

      if (result === "Win") {
         if (currentHand.Winner === "B") betAmount *= 0.95;
      } else if (result === "Loss") {
         betAmount = -betAmount;
         betUnit = -betUnit;

         // if (userGame?.gmId !== GAME_TYPE.SHENRON) {
         //    const LossNo = (ResultList[ResultList.length - 1]?.LossNo || 0) + 1;
         //    currentHand.LossNo = LossNo > 2 ? 1 : LossNo;
         // } else {
         // }
         const lastHand = ResultList.filter(
            (p: any) => p.Prediction !== "WAIT" && p.Winner !== "T",
         ).slice(-1)[0];

         if (pNextHand?.DetectedPattern === "CS") currentHand.LossNo = 1;
         else if ((pNextHand?.DetectedPattern || "").startsWith("PD")) {
            const LossNo =
               (lastHand?.DetectedPattern === "CS" ? 0 : lastHand?.LossNo || 0) +
               1;
            currentHand.LossNo = LossNo > 2 ? 1 : LossNo;
         }
      } else {
         betAmount = 0;
         betUnit = 0;
      }

      if ( (pNextHand?.VirtualWinRequired ?? false) ||
         (pNextHand?.VirtualLossRequired ?? false)
      ) {
         result = "-";
         betAmount = 0;
         betUnit = 0;
      }
   }

   currentHand.Bet = betAmount;
   currentHand.WLUnit = betUnit;
   currentHand.Result = result;

   let currentBalance = 0;
   if (ResultList.length <= 0) currentBalance = userGame.ugStartingBalance;
   else currentBalance = userGame.ugCurrentBalance;
   userGame.ugCurrentBalance = +Number(
      +currentBalance + betAmount,
   ).toFixed(2);
   userGame.ugWinUnits = userGame.ugWinUnits + betUnit;
   userGame.ugProfitAmount = userGame.ugProfitAmount + betAmount;
   userGame.ugResetStakeHistory = null;

   if (userGame.ugStartingBalance > userGame.ugPeak) {
      userGame.ugPeak = userGame.ugStartingBalance;
   } else if (userGame.ugCurrentBalance > userGame.ugPeak) {
      userGame.ugPeak = userGame.ugCurrentBalance;
   }
   if (
      userGame.ugCurrentBalance < userGame.ugTrough ||
      userGame.ugTrough === 0
   ) {
      userGame.ugTrough = userGame.ugCurrentBalance;
   }

   if (
      userGame.ugTrough < userGame.ugStartingBalance &&
      userGame.ugStartingBalance > 0
   ) {
      userGame.ugDrawdown = (
         ((userGame.ugStartingBalance - userGame.ugTrough) /
            userGame.ugStartingBalance || 0) * +100
      ).toFixed(2);
   } else if (
      userGame.ugTrough === userGame.ugStartingBalance &&
      userGame.ugStartingBalance > 0
   ) {
      userGame.ugDrawdown = (
         (userGame.ugPeak / userGame.ugStartingBalance || 1) * +100
      ).toFixed(2);
   }

   NextHand.CurrentId = (pNextHand?.CurrentId || 1) + 1;

   ResultList = [...ResultList, currentHand];

   if (ResultList.length > userGame.ugStartAt - 1) {

      const tmpNextHand = NextPredictionAndBet(ResultList, userGame);
      NextHand = {
         ...NextHand,
         ...tmpNextHand,
      };
      if (tmpNextHand?.Steps !== null && tmpNextHand?.Steps !== undefined) {
         userGame.ugSteps = tmpNextHand.Steps;
      }
      if (
         tmpNextHand?.Prediction !== "-" &&
         tmpNextHand?.Prediction !== "WAIT" &&
         userGame?.ugTmpStreak?.CurrentStreak > 0
      ) {
         const tmpStreak = { ...userGame?.ugTmpStreak };
         NextHand = {
            ...NextHand,
            ...tmpStreak,
         };
         if (tmpStreak?.Steps !== null && tmpStreak?.Steps !== undefined) {
            userGame.ugSteps = tmpStreak?.Steps;
         }
         userGame.ugTmpStreak = null;
      }
   } else {
      NextHand.DetectedPattern = pNextHand.DetectedPattern;
   }

   const tmpResult = (ResultList || []).map((p: any) => ({ Winner: p.Winner }));

      const tmp1 = tmpResult.slice(-5);
      const tmp2 = tmpResult.slice(-7);
      const tmp3 = tmpResult.slice(-9);

      const value1 =
         (tmp1.filter((i: any) => i.Winner === "B").length || 0) -
         (tmp1.filter((i: any) => i.Winner === "P").length || 0);
      const value2 =
         (tmp2.filter((i: any) => i.Winner === "B").length || 0) -
         (tmp2.filter((i: any) => i.Winner === "P").length || 0);
      let value3 =
         (tmp3.filter((i: any) => i.Winner === "B").length || 0) -
         (tmp3.filter((i: any) => i.Winner === "P").length || 0);
    
      // else if (
      //   varUserGame?.gmId === GAME_TYPE.CINQUE ||
      //   varUserGame?.gmId === GAME_TYPE.CINQUE_II ||
      //   varUserGame?.gmId === GAME_TYPE.CINQUE_III ||
      //   varUserGame?.gmId === GAME_TYPE.SEI_I ||
      //   varUserGame?.gmId === GAME_TYPE.SEI_II ||
      //   varUserGame?.gmId === GAME_TYPE.SEI_III ||
      //   varUserGame?.gmId === GAME_TYPE.QUATTRO
      // )
      //   value3 = NextHand.DetectedPattern;

      let center: any = value2;
      if (userGame?.gmId === GAME_TYPE.COCOA_BEACH) {
         center = NextHand.DetectedPattern;
         if (ResultList.length < userGame.ugStartAt) {
            center =
               ResultList[0]?.ugNextHand?.DetectedPattern ??
               NextHand.DetectedPattern;
         }
      }

      NextHand.Parity = [
         { label: "Parity", value: value1 },
         {
            label: "Parity",
            value: center,
         },
         {
            label: "Parity",
            value: value3,
         },
      ];

   if (
      NextHand.RecoveryBalance !== userGame.ugRecoveryBalance &&
      ((NextHand.Prediction !== "WAIT" &&
         NextHand.Prediction !== "C1" &&
         NextHand.Prediction !== "C2"))
   )
      userGame.ugRecoveryBalance = NextHand.RecoveryBalance;

   // NextHand.gPattern = StreakChopFinder(ResultList);

   const tmp = (ResultList || [])
      .filter(
         (p: any) =>
            p.Prediction !== "WAIT" &&
            p.Prediction !== "C1" &&
            p.Prediction !== "C2" &&
            p.Winner !== "T",
      )
      .map((p:any) => ({
         ...p,
         Result: p.Prediction === p.Winner ? "Win" : "Loss",
         aResult: p.Result,
      }));

   let LossesInRow = 0;
   let vWins = 0;
   let vLoss = 0;
   if (
      userGame?.gmId !== GAME_TYPE.COCOA_BEACH
   ) {
      vWins = tmp.filter((p: any) => p.Result === "Win" && p.aResult === "-").length;
      vLoss = tmp.filter(
         (p: any) => p.Result === "Loss" && p.aResult === "-",
      ).length;
      LossesInRow = Get_Max_LossCount_In_Row(tmp);
   }

   const Wins = tmp.filter(
      (p: any) => p.Result === "Win" && p.aResult !== "-",
   ).length;

   const Losses = tmp.filter(
      (p: any) => p.Result === "Loss" && p.aResult !== "-",
   ).length;

   let WinPercentage = 0;
   if (Wins > 0 || Losses > 0 || vWins > 0 || vLoss > 0) {
      WinPercentage = Math.round(
         ((Wins + vWins) / (Wins + Losses + vWins + vLoss)) * 100,
      );
   }

   NextHand.WLIndicators = {
      show: true,
      LossInRow: LossesInRow,
      Win: Wins,
      vWin: vWins,
      Loss: Losses,
      vLoss: vLoss,
      WinPercentage: WinPercentage,
   };

   userGame.ugResultList = ResultList;
   userGame.ugNextHand = NextHand;
   const storedData = JSON.parse(
      localStorage.getItem(USER_RESULT_LIST) ??
      JSON.stringify({ ugResultList: [], ugNextHand: {} })
   );

   // append ONLY the new result item
   const updatedData = {
      ...storedData,
      ugResultList: [
         ...(Array.isArray(storedData.ugResultList)
            ? storedData.ugResultList
            : []),
         ...userGame.ugResultList, // 👈 push only result rows
      ],
      ugNextHand: userGame.ugNextHand, // keep latest next hand
   };
   localStorage.setItem(USER_RESULT_LIST, JSON.stringify(updatedData));
   const resultrt = JSON.parse(localStorage.getItem(USER_RESULT_LIST) ?? "{}");
   const convertedResult = convertResult(resultrt.ugResultList);
   return convertedResult;

   // const rt = {
   //    CurrentBalance: userGame.ugCurrentBalance,
   //    Drawdown: userGame.ugDrawdown,
   //    Peak: userGame.ugPeak,
   //    Trough: userGame.ugTrough,
   //    ProfitAmount: userGame.ugProfitAmount,
   //    WinUnits: userGame.ugWinUnits,
   //    ProfitCarryFWD: userGame.ugProfitCarryFWD,
   //    hSkip: userGame.hSkip,
   //    NextHand: userGame.ugNextHand,
   //    ...Generate_ResultList(userGame.ugResultList, userGame?.gmId),
   //    UndoCount: userGame?.UndoCount || 0,
   //    HandCount: userGame?.HandCount || 0,
   //    StepsList: userGame?.ugSteps || [],
   // };

   // return returnGameData;
}