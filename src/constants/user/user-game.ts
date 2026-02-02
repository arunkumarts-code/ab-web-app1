export const UserGame = {
   ugSkip: false,
   hSkip: false,

   gmId: "e9bfb121-f43f-4920-a787-ef3bb6997f08",
   gmTitle: "Cocoa Beach (Beta)",
   gmStartAt: 5,
   gmOption: "",
   gmOptionList: [],

   mmId: "30b57f20-d31b-4bce-a130-60662c95c585",
   mmTitle: "Ragnar MM +",
   BaseUnit: 1,

   StepsList: {
      N: [[1, 1, 0]],
      R: []
   },

   StreakStartIndex: 0,
   StartingBalance: 22.85,
   CurrentBalance: 22.85,
   RecoveryBalance: 0,

   WinUnits: 0,
   ProfitAmount: 0,
   ProfitCarryFWD: 0,

   Peak: 22.85,
   Trough: 22.85,
   Drawdown: 100,

   UndoCount: 0,
   HandCount: 0
};

export const NextHand = {
   CurrentId: 5,
   CurrentStreak: 0,
   DoubleBetRequired: false,
   VirtualWinRequired: false,
   VirtualLossRequired: false,
   DetectedPattern: 0,
   gPattern: "Chop",
   Prediction: "WAIT",
   IsRecoveryMode: false,
   BetAmount: 0,
   BetUnit: 0,
   RecoveryBalance: 0,
   Shield: "off",

   Parity: [
      { label: "Parity", value: 0 },
      { label: "Parity", value: 0 },
      { label: "Parity", value: 0 }
   ],

   WLIndicators: {
      show: true,
      LossInRow: 0,
      Win: 0,
      vWin: 0,
      Loss: 0,
      vLoss: 0,
      WinPercentage: 0
   }
};

export const ResultList = [
   {
      Id: 1,
      Winner: "P",
      Prediction: "WAIT",
      DetectedPattern: "-",
      Result: "-",
      hSkip: false,
      ugSkip: false,
      VirtualLossRequired: false,
      VirtualWinRequired: false,
      VirtualWoLRequired: false,
      Bet: 0,
      Column1: "",
      Column2: ""
   },
   {
      Id: 2,
      Winner: "B",
      Prediction: "WAIT",
      DetectedPattern: "-",
      Result: "-",
      hSkip: false,
      ugSkip: false,
      VirtualLossRequired: false,
      VirtualWinRequired: false,
      VirtualWoLRequired: false,
      Bet: 0,
      Column1: "",
      Column2: ""
   },
   {
      Id: 3,
      Winner: "P",
      Prediction: "WAIT",
      DetectedPattern: "-",
      Result: "-",
      hSkip: false,
      ugSkip: false,
      VirtualLossRequired: false,
      VirtualWinRequired: false,
      VirtualWoLRequired: false,
      Bet: 0,
      Column1: "",
      Column2: ""
   },
   {
      Id: 4,
      Winner: "B",
      Prediction: "WAIT",
      DetectedPattern: "-",
      Result: "-",
      hSkip: false,
      ugSkip: false,
      VirtualLossRequired: false,
      VirtualWinRequired: false,
      VirtualWoLRequired: false,
      Bet: 0,
      Column1: "",
      Column2: ""
   }
];

export const UserSettings = {
   GameType: "7155a4f6-10cc-4b79-8b1b-68ab0b232d1d",
   GameOption: "",
   MM: "783c2563-706a-46c7-97d4-1e099c702c24",
   BaseUnit: "1.00",
   BuyIn: "255.00"
}

const init=[
   {
      "Id": 1,
      "Winner": "P",
      "Prediction": "WAIT",
      "DetectedPattern": "-",
      "IsRecoveryMode": false,
      "VirtualWoLRequired": false,
      "Bet": 0,
      "WLUnit": 0,
      "Result": "-",
      "LossNo": 0,
      "Count1": 0,
      "Count2": 0,
      "Column1": "",
      "Column2": "",
      "StreakOnWL": 0,
      "DoubleBetRequired": false,
      "WaitForNextBlock": false,
      "ugGame": {
         "ugBaseUnit": 1,
         "ugStartingBalance": 22.85,
         "ugRecoveryBalance": 0,
         "ugCurrentBalance": 0,
         "ugProfitAmount": 0,
         "ugProfitCarryFWD": 0,
         "ugPeak": 0,
         "ugTrough": 0,
         "ugDrawdown": 0,
         "ugSkip": false,
         "hSkip": false,
         "ugAllowShield": true,
         "ugShieldSettings": false,
         "ugShieldStartOn": 0,
         "ugShieldStopOpt": false,
         "ugShieldStopWCount": 0,
         "ugShieldStopPattern": "",
         "AllowParityShield": true,
         "ugParityShield": false,
         "AllowRingOfFire": false,
         "IsRingOfFire": false,
         "AllowRingOfIce": false,
         "IsRingOfIce": false,
         "gmId": "e9bfb121-f43f-4920-a787-ef3bb6997f08",
         "gmOption": "",
         "ugStartAt": 5,
         "mmId": "30b57f20-d31b-4bce-a130-60662c95c585",
         "ugSteps": {
            "N": [
               [
                  1,
                  1,
                  0
               ]
            ],
            "R": []
         },
         "ugStreakStartIndex": 0,
         "ugWinUnits": 0,
         "ugTmpStreak": null,
         "ugResetStakeHistory": null,
         
         "ugIsCharged": false,
         "IsFree": false,
         "ugHandPlayed": 0,
         "agmId": null,
         "UndoCount": 0,
         "HandCount": 0
      },
      "ugNextHand": {
         "CurrentId": 1,
         "CurrentStreak": 0,
         "DoubleBetRequired": false,
         "VirtualWinRequired": false,
         "VirtualLossRequired": false,
         "DetectedPattern": 0,
         "Prediction": "WAIT",
         "IsRecoveryMode": false,
         "BetAmount": 0,
         "BetUnit": 0,
         "RecoveryBalance": 0,
         "Shield": "off",
         "Steps": null,
         "Parity": [
            {
               "label": "Parity",
               "value": 0
            },
            {
               "label": "Parity",
               "value": 0
            },
            {
               "label": "Parity",
               "value": 0
            }
         ],
         "WLIndicators": {
            "show": true,
            "LossInRow": 0,
            "Win": 0,
            "vWin": 0,
            "Loss": 0,
            "vLoss": 0,
            "WinPercentage": 0
         }
      }
   }
]