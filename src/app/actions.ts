"use server";
import * as z from "zod";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import comparisonService, {
  supportedModels,
} from "@/services/comparison.service";
import { headers } from "next/headers";

const rateLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(1, "1 m"),
});

const schema = z.object({
  prompt: z.string(),
  models: z.array(z.enum(supportedModels)).length(3),
});

const checkRateLimit = async () => {
  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for") || "unknown";
  const { success } = await rateLimit.limit(ip);

  return success;
};

export const compareModels = async (prompt: string, models: string[]) => {
  if (!(await checkRateLimit())) {
    return new Error("Too many requests. Please try again later.");
  }

  const parsed = schema.parse({ prompt, models });
  const res = await comparisonService.compare(parsed);
  return res.id;
};
