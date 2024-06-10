// const {redisClient, check} = require('../index')
const {createClient} = require('redis');

let redisClient = undefined;

async function initializeRedisClient() {
    let redisURL = process.env.REDIS_URI
    if (redisURL) {
      redisClient = createClient({ url: redisURL }).on("error", (e) => {
        console.error(`Failed to create the Redis client with error:`);
        console.error(e);
      });
      try {
        await redisClient.connect();
        console.log(`Connected to Redis successfully!`);
      } catch (e) {
        console.error(`Connection to Redis failed with error:`);
        console.error(e);
      }
    }
  }

function isRedisWorking() {
    return !!redisClient?.isOpen;
}

async function writeData(key, data, options) {
    if (isRedisWorking()) {
      try {
        console.log(key)
        await redisClient.set(key, data, options);
      } catch (e) {
        console.error(`Failed to cache data for key=${key}`, e);
      }
    }
  }

  async function readData(key) {
    let cachedValue = undefined;
    if (isRedisWorking()) {
      cachedValue = await redisClient.get(key);
      if (cachedValue) {
          return cachedValue;
      }
    }
  }

  function redisCacheMiddleware(
    options = {
      EX: 21600, 
    }
  ) {
    return async (req, res, next) => {
      if (isRedisWorking()) {
        const key = req.path;
        console.log(req.path)
        const cachedValue = await readData(key);
        if (cachedValue) {
          try {
            console.log('1')
            return res.json(JSON.parse(cachedValue));
          } catch {
            return res.send(cachedValue);
          }
        } else {
          const oldSend = res.send;
          console.log(oldSend)
          res.send = function (data) {
            res.send = oldSend;
            if (res.statusCode.toString().startsWith("2")) {
              writeData(key, data, options).then();
            }
            return res.send(data);
          };
          next();
        }
      } else {
        console.log('2')
        next();
      }
    };
  }

  module.exports = {
    redisCacheMiddleware,
    initializeRedisClient,
    writeData,
    readData
  }