"use server";
import * as z from "zod";
import comparisonService, { supportedModels } from "@/services/compare.service";
import SupportedModel from "@/types/supported-model.type";

const schema = z.object({
  prompt: z.string(),
  models: z.array(z.enum(supportedModels)).length(3),
});

export const compareModels = async (
  prompt: string,
  models: SupportedModel[],
) => {
  const parsed = schema.parse({ prompt, models });
  return await comparisonService.compare(parsed);
};
