import { gateway, GatewayLanguageModelEntry } from "@ai-sdk/gateway";
import { LanguageModel, LanguageModelUsage } from "ai";
import NodeCache from "node-cache";

const singleModelCache = new NodeCache({ stdTTL: 60 * 60 });
const allModelsCache = new NodeCache({ stdTTL: 60 * 1 });
const CACHE_KEY_ALL_MODELS = "all_models";

export class PricingService {
  async calculateCost(
    model: LanguageModel,
    usage: LanguageModelUsage,
  ): Promise<number | undefined> {
    // it will be wrong to calculate cost if we don't have both input and output tokens,
    // so we return undefined in that case
    if (!usage.inputTokens || !usage.outputTokens) return undefined;

    const cost = await this.getModelCost(model);
    if (!cost || !cost.input || !cost.output) return undefined;

    const inputCost = usage.inputTokens * cost.input;
    const outputCost = usage.outputTokens * cost.output;
    return inputCost + outputCost;
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
