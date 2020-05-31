const redis = require("redis");
let redisNotReady = true;
let redisClient = redis.createClient({
  host: "redis",
  port: 6379,
});
redisClient.on("error", (err) => {
  console.log("error", err);
});
redisClient.on("connect", (err) => {
  console.log("connect");
});
redisClient.on("ready", (err) => {
  redisNotReady = false;
  console.log("ready");
});
module.exports = redisClient;
