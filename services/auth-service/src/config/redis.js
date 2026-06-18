
const { createClient } = require("redis");

// const redisClient = createClient({
//     url: process.env.REDIS_URL
// });

const redisClient = createClient();


redisClient.on("error", (err) => {
    console.error("Redis Error:", err);
});

const connectRedis = async () => {
    await redisClient.connect();
 
};

module.exports = {
    redisClient,
    connectRedis
};