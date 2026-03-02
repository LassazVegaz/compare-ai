"use server";
import * as z from "zod";
import { Duration, Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import comparisonService, {
  supportedModels,
} from "@/services/comparison.service";
import { headers } from "next/headers";

const RATE_LIMITING_ENABLED = process.env.RATE_LIMITING_ENABLED === "true";

const createRateLimit = () => {
  const token = Number.parseInt(process.env.RATE_LIMITING_MAX_REQUESTS || "");
  if (Number.isNaN(token))
    throw new Error("Invalid RATE_LIMITING_MAX_REQUESTS");

  const window = process.env.RATE_LIMITING_WINDOW as Duration | undefined;
  if (!window) throw new Error("RATE_LIMITING_WINDOW is not defined");

  return new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(token, window),
  });
};

const rateLimit = RATE_LIMITING_ENABLED ? createRateLimit() : undefined;

const schema = z.object({
  prompt: z.string(),
  models: z.array(z.enum(supportedModels)).length(3),
});

const checkRateLimit = async () => {
  if (!rateLimit) throw new Error("Rate limiting is not enabled.");

  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for") || "unknown";
  const { success } = await rateLimit.limit(ip);

  return success;
};

export const compareModels = async (prompt: string, models: string[]) => {
  if (RATE_LIMITING_ENABLED && !(await checkRateLimit())) {
    return new Error("Too many requests. Please try again later.");
  }

  const parsed = schema.parse({ prompt, models });
  const res = await comparisonService.compare(parsed);
  return res.id;
};
