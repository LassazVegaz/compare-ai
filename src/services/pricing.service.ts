import { gateway, GatewayLanguageModelEntry } from "@ai-sdk/gateway";
import { LanguageModel, LanguageModelUsage } from "ai";
import NodeCache from "node-cache";

/**
 * Cache store for each model. Life time is 1 hour.
 */
const singleModelCache = new NodeCache({ stdTTL: 60 * 60 });
/**
 * Cache store for all the models. Life time is shorter than singleModelCache because
 * it is large and we don't want all the models. Life time is 1 minute.
 */
const allModelsCache = new NodeCache({ stdTTL: 60 * 1 });
const CACHE_KEY_ALL_MODELS = "all_models";

type PriceBreakdown = {
  /**Cost of an input token in USD */
  inputCost: number;
  /**Cost of an output token in USD */
  outputCost: number;
};

type CalculateCostResults = {
  /**Total cost in USD */
  totalCost: number;
  /**Price breakdown during calculations */
  breakdown: PriceBreakdown;
};

export class PricingService {
  async calculateCost(
    model: LanguageModel,
    usage: LanguageModelUsage,
  ): Promise<CalculateCostResults | undefined> {
    // If any price details are missing, we cannot calculate the total cost.
    // hence we return undefined to indicate that the cost cannot be calculated.
    if (!usage.inputTokens || !usage.outputTokens) return undefined;

    const cost = await this.getModelCost(model);
    if (!cost || !cost.input || !cost.output) return undefined;

    const inputCost = usage.inputTokens * cost.input;
    const outputCost = usage.outputTokens * cost.output;

    return {
      totalCost: inputCost + outputCost,
      breakdown: {
        inputCost,
        outputCost,
      },
    };
  }

  private async getModelCost(model: LanguageModel) {
    const modelInfo = await this.getModelInfo(model);

    if (!modelInfo) return undefined;

    const input = modelInfo.pricing?.input
      ? Number.parseFloat(modelInfo.pricing.input)
      : undefined;
    const output = modelInfo.pricing?.output
      ? Number.parseFloat(modelInfo.pricing.output)
      : undefined;

    return { input, output };
  }

  private async getModelInfo(model: LanguageModel) {
    const modelCacheKey = model.toString();
    let modelInfo = singleModelCache.get<GatewayLanguageModelEntry | undefined>(
      modelCacheKey,
    );
    if (modelInfo !== undefined) return modelInfo;

    let allModels =
      allModelsCache.get<GatewayLanguageModelEntry[]>("all_models");
    if (!allModels) {
      const res = await gateway.getAvailableModels();
      allModels = res.models;
      allModelsCache.set(CACHE_KEY_ALL_MODELS, allModels);
    }

    modelInfo = allModels.find((m) => m.id === model);
    singleModelCache.set(modelCacheKey, modelInfo);
    return modelInfo;
  }
}

const pricingService = new PricingService();
export default pricingService;
