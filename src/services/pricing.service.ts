import SupportedModel from "@/types/supported-model.type";
import { gateway, GatewayLanguageModelEntry } from "@ai-sdk/gateway";
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

export class PricingService {
  async getModelPrice(model: SupportedModel) {
    const modelInfo = await this.getModelInfo(model);

    const input = modelInfo?.pricing?.input
      ? Number.parseFloat(modelInfo.pricing.input)
      : undefined;
    const output = modelInfo?.pricing?.output
      ? Number.parseFloat(modelInfo.pricing.output)
      : undefined;

    return { input, output };
  }

  private async getModelInfo(model: SupportedModel) {
    const modelCacheKey = model;
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
