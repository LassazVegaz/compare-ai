import { LanguageModel } from "ai";

type CallModelResponse = {
  text: string;
  totalTokens?: number;
  model: LanguageModel;
  timeTakenMs: number;
  price?: number;
};

export default CallModelResponse;
