"use server";
import * as z from "zod";
import comparisonService from "@/services/compare.service";
import SupportedModel from "@/types/supported-model.type";

const supportedModels: SupportedModel[] = [
  "anthropic/claude-3-opus",
  "anthropic/claude-sonnet-4.6",
  "openai/gpt-4o",
  "xai/grok-4",
];

const schema = z.object({
  prompt: z.string(),
  models: z.array(z.enum(supportedModels)),
});

export const compareModels = async (
  prompt: string,
  models: SupportedModel[],
) => {
  const parsed = schema.parse({ prompt, models });
  return await comparisonService.compare(parsed);
};
