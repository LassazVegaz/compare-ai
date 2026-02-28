import { LanguageModel } from "ai";

type CallModelResponse = {
  text: string;
  totalTokens?: number;
  model: LanguageModel;
  timeTakenMs: number;
};

export default CallModelResponse;
