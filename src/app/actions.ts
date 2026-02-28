"use server";
import { ComparisonService } from "@/services/compare.service";

export async function compareModels(prompt: string) {
  const comparisonService = new ComparisonService();
  return comparisonService.compare({
    prompt,
    models: [
      "openai/gpt-5.2-pro",
      "anthropic/claude-sonnet-4.6",
      "google/gemini-3.1-pro-preview",
    ],
  });
}
