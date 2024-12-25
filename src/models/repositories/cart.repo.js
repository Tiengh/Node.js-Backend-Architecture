// inventory.repo.js
"use strict";

const cart = require("../cart.model");
const {
  unGetSelectData,
  getSelectData,
  convertToObjectId,
} = require("../../utils/index");

const findCartById = async (cartId) => {
  return await cart
    .findById({ _id: convertToObjectId(cartId), cart_state: "active" })
    .lean();
};

module.exports = {
  findCartById,
};
