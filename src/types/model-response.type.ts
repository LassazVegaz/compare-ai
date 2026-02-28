import { LanguageModel } from "ai";

type CallModelResponse = {
  text: string;
  totalTokens?: number;
  model: LanguageModel;
};

export default CallModelResponse;
