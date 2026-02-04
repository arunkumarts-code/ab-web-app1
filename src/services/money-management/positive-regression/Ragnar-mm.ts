import { MM_LISTES } from "../constants/mm-lists";

export const Ragnar_MM = (results: any) => {
   const userProfileStore = localStorage.getItem("User_Profile");
   const userProfile = JSON.parse(userProfileStore ?? "{}");

   let BetAmount = 0;
   let MMStep = 0;
   const BaseUnit = userProfile?.defaultBaseUnit || 5;
   const maxBetAmount = BaseUnit * 5;

   const { defaultMM } = userProfile;
   const mmData = MM_LISTES[defaultMM];
   if (!mmData?.mmStepsList?.length) {
      return { BetAmount: BaseUnit, MMStep: 0 };
   }

   const ResultList = results || [];
   const resultLength = ResultList.length || 0;

   const LastHand = ResultList.at(-2)
   const LastResult = LastHand?.Result || "Loss";
   let MMStepIndex = LastHand?.MMStep || 0;
   if (MMStepIndex >= mmData.mmStepsList.length - 1) {
      MMStepIndex = 0;
   }
   const [amount, unit] = mmData.mmStepsList[MMStepIndex];

   if (LastResult === "Loss" || resultLength <= 1) {
      BetAmount = BaseUnit;
      MMStepIndex = 0;
   } else if (LastResult === "Win") {
      MMStep = Number(MMStepIndex) + 1;
      BetAmount = Math.min(
         BaseUnit * amount * unit,
         maxBetAmount
      );
   }
   if (MMStep >= mmData.mmStepsList.length - 1) {
      MMStep = 0;
   }

   return { BetAmount, MMStep };
};