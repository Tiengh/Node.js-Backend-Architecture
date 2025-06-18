// inventory.repo.js
"use strict";

const { convertToObjectId } = require("../../utils");
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

const reservationInventory = async ({ productId, quantity, cartId }) => {
  const query = {
      inven_productId: convertToObjectId(productId),
      inven_stock: { $gte: quantity },
    },
    updateSet = {
      $inc: {
        inven_stock: -quantity,
      },
      $push: {
        inven_reservation: {
          quantity,
          cartId,
          createOn: new Date(),
        },
      },
    };
  options: {
    upsert: true;
  }
  return await Inventory.updateOne(query, updateSet);
};

module.exports = {
  insertInventory,
  reservationInventory,
};
