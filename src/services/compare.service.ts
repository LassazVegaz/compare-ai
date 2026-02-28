import CallModelResponse from "@/types/model-response.type";
import { LanguageModel, streamText } from "ai";

type CompareParams = {
  prompt: string;
  models: LanguageModel[];
};

export class ComparisonService {
  async compare(params: CompareParams) {
    const res = await Promise.all(
      params.models.map((m) => this.callModel(m, params.prompt)),
    );

    return res;
  }

  private async callModel(
    model: LanguageModel,
    prompt: string,
  ): Promise<CallModelResponse> {
    const res = streamText({ model, prompt });
    const usage = await res.totalUsage;

    return {
      text: await res.text,
      totalTokens: usage.totalTokens,
    };
  }
}
