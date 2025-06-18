"use strict";

const { createClient } = require("redis");
const {
  reservationInventory,
} = require("../models/repositories/inventory.repo");

const redisClient = createClient();
redisClient.connect(); // Bắt buộc gọi connect()

const acquireLock = async (productId, quantity, cartId) => {
  const key = `lock_v2025_${productId}`;
  const retryTime = 10;
  const expireTime = 3000; // in ms

  for (let i = 0; i < retryTime; i++) {
    const result = await redisClient.setNX(key, cartId); // Gán cartId làm value tạm
    console.log(`result: `, result);

    if (result) {
      const isReservation = await reservationInventory({
        productId,
        quantity,
        cartId,
      });

      if (isReservation.modifiedCount) {
        await redisClient.pExpire(key, expireTime); // Đặt thời gian hết hạn
        return key;
      }

      // Nếu không đặt hàng thành công -> xóa key
      await redisClient.del(key);
      return null;
    } else {
      // Đợi 50ms rồi retry
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }
  return null;
};

const releaseLock = async (keyLock) => {
  return await redisClient.del(keyLock);
};

module.exports = {
  acquireLock,
  releaseLock,
};
