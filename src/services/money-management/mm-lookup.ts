import { MM_TYPES } from "./constants/mm-types";
import { Ragnar_MM } from "./positive-regression/Ragnar-MM";

export const MM_LOOKUP = {
   [MM_TYPES.RAGNAR_MM]: (results: any, userGame: any): any => Ragnar_MM(results, userGame),
}