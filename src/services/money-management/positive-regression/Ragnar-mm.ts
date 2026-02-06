import { USER_PROFILE, USER_RECOVERY_LIST } from "@/constants/roads-list";

export const Ragnar_MM = (results: any) => {
   const userProfileStore = localStorage.getItem(USER_PROFILE);
   const userProfile = JSON.parse(userProfileStore ?? "{}");
   const userRecoryListStore = localStorage.getItem(USER_RECOVERY_LIST);
   const userRecoryList = JSON.parse(userRecoryListStore ?? "[]");

   let BetAmount = 0;
   let MMStep = 0;
   const BaseUnit = userProfile?.defaultBaseUnit || 5;
   const maxBetAmount = BaseUnit * 5;
   
   const ResultList = results || [];
   const ResultLength = ResultList.length || 0;
   const LastHand = ResultList.at(-1)
   const LastResult = LastHand?.Result || "Loss"; 
   let lastBetAmount = +LastHand?.Bet || BaseUnit; 

   let RecoveryList = ResultList
      .map((r: any) => (!r.IsRecovered ? r : null))
      .filter((r: any) => r !== null)

   if (RecoveryList.length === 0){
      localStorage.removeItem(USER_RECOVERY_LIST);
   }
   
   let betamount = 0;
   if (LastResult === "Win") {
      if (RecoveryList.length > 0) {
         if (BaseUnit !== lastBetAmount) {
            for (let i = 0; i < RecoveryList.length; i++){
               betamount += RecoveryList[i].Bet;
               userRecoryList.push(RecoveryList[i].Id);
               if (maxBetAmount <= betamount){
                  break;
               }
            }
            localStorage.setItem(USER_RECOVERY_LIST, JSON.stringify(userRecoryList));
         }
      }
   }


   if (LastResult === "Loss" || ResultLength <= 1) {
      BetAmount = BaseUnit;
   } else if (LastResult === "Win") {
      if (RecoveryList.length > 0) {
         const totalBet = RecoveryList.reduce((sum: number, r: any) => {
            return sum + (r.Bet || 0);
         }, 0);
         if (totalBet > maxBetAmount) BetAmount = maxBetAmount;
         else BetAmount = totalBet || BaseUnit;
      } else BetAmount = BaseUnit;
   }

   return { BetAmount, MMStep };
};