import { LanguageModel, streamText } from "ai";
import pricingService from "./pricing.service";
import prisma from "./prisma.service";
import { Message } from "@/generated/prisma/client";

type CompareParams = {
  prompt: string;
  models: LanguageModel[];
};

export class ComparisonService {
  async compare(params: CompareParams) {
    const res = await Promise.all(
      params.models.map((m) => this.callModel(m, params.prompt)),
    );

    const created = await prisma.compareGroup.create({
      data: {
        prompt: params.prompt,
        responses: res,
      },
    });

    return created;
  }

  private async callModel(
    model: LanguageModel,
    prompt: string,
  ): Promise<Message> {
    const startTime = Date.now();
    const res = streamText({ model, prompt });
    const usage = await res.totalUsage;
    const text = await res.text;
    const endTime = Date.now();

    const price = await pricingService.getModelPrice(model);

    return {
      text,
      model: model.toString(),
      inputTokens: usage.inputTokens ?? null,
      outputTokens: usage.outputTokens ?? null,
      inputTokenPrice: price.input ?? null,
      outputTokenPrice: price.output ?? null,
      time: endTime - startTime,
    };
  }
}
