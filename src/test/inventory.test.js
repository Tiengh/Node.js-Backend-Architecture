// src/test/inventory.test.js
const redisPubSubService = require("../services/redisPubSub.service");

class InventoryServiceTest {
  static async init() {
    await redisPubSubService.subscribe("purchase_event", (channel, message) => {
      const { productId, quantity } = JSON.parse(message);
      InventoryServiceTest.updateInventory(productId, quantity);
    });
  }

  static updateInventory(productId, quantity) {
    console.log(
      `🧾 Updated inventory for ${productId} with quantity ${quantity}`
    );
  }
}

module.exports = InventoryServiceTest;
