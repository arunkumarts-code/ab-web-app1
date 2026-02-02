import { MM_LISTES } from "../constants/mm-lists";

export const Ragnar_MM = (results: any, userGame: any) => {
  const userProfile = JSON.parse(localStorage.getItem("User_Profile") ?? "{}");

  let TimesBet = 1;
  let CurrentStreak = 0;
  let betAmount = 0;
  let IsRecoveryMode = false;
  // let RecoveryBalance = userGame?.ugRecoveryBalance || 0;
  const BaseUnit = +userProfile?.ugBaseUnit || 5;
  const maxBetAmount = BaseUnit * +5;

  const ResultList = results || [];
  const resultLength = ResultList.length || 0;
  const LastHand = ResultList[resultLength - 1];
  const LastResult = LastHand?.Result || "";

  const mmDetails: any = MM_LISTES[userProfile.mmId];

  const N = [...(mmDetails?.ugSteps?.N || [])];
  let R = [...(mmDetails?.ugSteps?.R || [])];
  let lastBetAmount = +userGame?.ugNextHand?.BetAmount || BaseUnit;
  if (
    (ResultList[resultLength - 1]?.ugGame?.mmId || "") ===
    (userGame?.mmId || "")
  ) {
    if (LastResult === "Loss") {
      let tmp = [[+(lastBetAmount || BaseUnit).toFixed(2), 1, R.length]];
      if (R.length <= 0) {
        tmp = [
          [+(lastBetAmount || BaseUnit).toFixed(2), 1, R.length + 1],
          ...tmp,
        ];
      }
      R = [...tmp, ...R];
    } else if (LastResult === "Win") {
      if (R.length > 0) {
        if (BaseUnit === lastBetAmount) {
          for (let index = R.length - 1; index >= 0; index--) {
            const item = R[index];
            if (item[0] === lastBetAmount) {
              delete R[index];
              break;
            }
          }
        } else {
          for (let index = 0; index < R.length; index++) {
            const item = R[index];
            lastBetAmount = lastBetAmount - item[0];
            if (lastBetAmount >= 0) {
              delete R[index];
              if (lastBetAmount === 0) break;
            }
          }
        }
        R = R.filter((p) => p !== undefined && p !== null);
      }
    }
  }

  if (LastResult === "Loss" || resultLength <= 1) {
    betAmount = BaseUnit;
  } else if (LastResult === "Win") {
    if (R.length > 0) {
      const tmpAmt = R.map((p) => p[0]).reduce((n, a) => n + a, 0);
      if (tmpAmt > maxBetAmount) betAmount = maxBetAmount;
      else betAmount = tmpAmt;
    } else betAmount = BaseUnit;
  }

  return {
    TimesBet,
    CurrentStreak,
    BetAmount: betAmount,
    IsRecoveryMode,
    Steps: { N, R },
  };
};
