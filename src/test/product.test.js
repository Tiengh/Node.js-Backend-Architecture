const redisPubSubService = require("../services/redisPubSub.service");

class ProductServiceTest {
  async purchaseProduct(productId, quantity) {
    const order = {
      productId,
      quantity,
    };

    console.log("productId: ", productId);
    await redisPubSubService.publish("purchase_event", JSON.stringify(order));
  }
}

module.exports = new ProductServiceTest();
