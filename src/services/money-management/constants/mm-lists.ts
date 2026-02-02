export type MMItem = {
   mmId: string;
   mmTitle: string;
   mmSteps: number;
   mmStepsList: number[][];
};

const MM_LISTES: MMItem[] = [
   {
      mmId: '30b57f20-d31b-4bce-a130-60662c95c585',
      mmTitle: 'Ragnar MM',
      mmSteps: 1,
      mmStepsList: [
         [1, 1, 0]
      ],
   },
   {
      mmId: '783c2563-706a-46c7-97d4-1e099c702c24',
      mmTitle: 'Authors MM',
      mmSteps: 4,
      mmStepsList: [
         [1, 1, 0], 
         [2, 1, 1], 
         [3, 1, 2], 
         [6, 1, 3]
      ],
   },
]