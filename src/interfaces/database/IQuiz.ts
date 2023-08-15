import { IFieldAnswers } from "./IFieldAnswers";

export default interface IQuiz {
  id: number;
  questionName: string;
  fieldType: string;
  fieldAnswers: IFieldAnswers[];
}
