"use strict";

const InventoryService  = require('../services/inventory.service')
const { SuccessResponse } = require("../core/success.response.js");

class InventoryController {
  addStock = async (req, res, next) => {
    try {
      new SuccessResponse({
        message: "Checkout review success!",
        metadata: await InventoryService.addStockToInventory({
          ...req.body,
        }),
      }).send(res);
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new InventoryController();
