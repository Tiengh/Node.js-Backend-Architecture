// inventory.repo.js
"use strict";

const Inventory = require("../inventory.model");

const insertInventory = async ({
  product_id,
  shopId,
  stock,
  location = "unknown",
}) => {
  return await Inventory.create({
    inven_productId: product_id,
    inven_shopId: shopId,
    inven_location: location,
    inven_stock: stock,
  });
};

module.exports = {
  insertInventory,
};
