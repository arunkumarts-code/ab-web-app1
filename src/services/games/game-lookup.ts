import { GAME_TYPE } from "./constants/game-types";
import { Cocoa_Beaach_Prediction } from "./prediction-list/cocoa-beach";

export const GAME_LOOKUP = {
   [GAME_TYPE.COCOA_BEACH]: (results: any): any => Cocoa_Beaach_Prediction(results),
}