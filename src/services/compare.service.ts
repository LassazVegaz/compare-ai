import CallModelResponse from "@/types/model-response.type";
import { LanguageModel, streamText } from "ai";
import pricingService from "./pricing.service";

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
    const startTime = Date.now();
    const res = streamText({ model, prompt });
    const usage = await res.totalUsage;
    const text = await res.text;
    const endTime = Date.now();

    const price = await pricingService.calculateCost(model, usage);

    return {
      text,
      model,
      price,
      totalTokens: usage.totalTokens,
      timeTakenMs: endTime - startTime,
    };
  }
}
