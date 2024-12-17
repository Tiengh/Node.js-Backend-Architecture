// inventory.repo.js
"use strict";

const discount = require("../discount.model");
const { unGetSelectData, getSelectData } = require("../../utils/index");

const updateDiscountById = async ({ discountId, payload, isNew = true }) => {
  return await discount.findByIdAndUpdate(discountId, payload, {
    new: isNew,
  });
};

const findAllDiscountCodesUnselect = async ({
  limit = 50,
  page = 1,
  sort = "ctime",
  filter,
  unSelect,
  model,
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const discounts = await discount
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(unGetSelectData(unSelect))
    .lean();
  return discounts;
};

const findAllDiscountCodesSelect = async ({
  limit = 50,
  page = 1,
  sort = "ctime",
  filter,
  Select,
  model,
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const discounts = await discount
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(Select))
    .lean();
  return discounts;
};

const checkDiscountExist = async ({ model, filter }) => {
  return await discount.findOne(filter).lean();
};

module.exports = {
  updateDiscountById,
  findAllDiscountCodesUnselect,
  findAllDiscountCodesSelect,
  checkDiscountExist,
};
