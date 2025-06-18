"use strict";

const { BadRequestError } = require("../core/error.response");
const { inventory } = require("../models/inventory.model");
const { getProductById } = require("../models/repositories/product.repo");

class InventoryService {
  static async addStockToInventory({
    stock,
    productId,
    shopId,
    location = "11/37 Cau Noi, Co Nhue, Ha Noi",
  }) {
    const product = await getProductById(productId);
    if (!product) throw new BadRequestError("Sản phẩm không tồn tại");

    const quey = { inven_shopId: shopId, inven_productId: productId };
    updateSet = {
      $inc: {
        inven_stock: stock,
      },
      $set: {
        inven_location: location,
      },
    };
    options = { upsert: true, new: true };

    return await inventory.findOneAndUpdate(quey, updateSet, options);
  }
}

module.exports = { InventoryService };
