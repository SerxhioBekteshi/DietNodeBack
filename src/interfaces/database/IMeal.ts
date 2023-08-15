import { IIngredients } from "./IIngredients";

export default interface IMeal {
  id: number;
  name: string;
  ingredients: IIngredients[];
  cousine: string;
  carbonFootprint: number;
  dietCategory: string;
  calories: number;
  intolerance: string;
  image: string;
  providerId: number;
}
