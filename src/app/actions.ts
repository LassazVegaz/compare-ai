"use server";
import * as z from "zod";
import comparisonService, {
  supportedModels,
} from "@/services/comparison.service";

const schema = z.object({
  prompt: z.string(),
  models: z.array(z.enum(supportedModels)).length(3),
});

export const compareModels = async (prompt: string, models: string[]) => {
  const parsed = schema.parse({ prompt, models });
  const res = await comparisonService.compare(parsed);
  return res.id;
};
