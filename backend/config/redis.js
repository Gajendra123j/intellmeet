const Redis = require("ioredis");

let redis;

const connectRedis = () => {
  try {
    redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
      retryStrategy: (times) => {
        if (times > 3) {
          console.warn("⚠️ Redis not available, continuing without cache");
          return null;
        }
        return Math.min(times * 200, 2000);
      },
      lazyConnect: true,
    });

    redis.on("connect", () => console.log("✅ Redis Connected"));
    redis.on("error", (err) => {
      if (err.code !== "ECONNREFUSED") {
        console.error("Redis Error:", err.message);
      }
    });
  } catch (err) {
    console.warn("⚠️ Redis unavailable:", err.message);
    redis = null;
  }
  return redis;
};

const getRedis = () => redis;

module.exports = { connectRedis, getRedis };
