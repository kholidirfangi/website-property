import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export const leadRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "10 m"),
  analytics: true,
});

export const loginRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "10 m"),
  analytics: true,
});

export const imageUploadRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(30, "10 m"),
  analytics: true,
});
