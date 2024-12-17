"use strict";

/*
  Discount Services
   1 - createDiscountCode (Shop | Admin)
   2 - updateDiscountCode (Shop | Admin)
   3 - getAllProductWithDiscountCode (User)
   4 - getAllDiscountCodesByShop  (Shop)
   5 - getDiscountAmount (User)
   6 - deleteDiscountCode (User)
   7 - cancelDiscountCode (User)
*/

const { BadRequestError, NotFoundError } = require("../core/error.response");
const discount = require("../models/discount.model");
const {
  convertToObjectId,
  removeUndefinedObject,
  updateNestedObjectParser,
} = require("../utils/index");
const {
  updateDiscountById,
  findAllDiscountCodesUnselect,
  checkDiscountExist,
} = require("../models/repositories/discount.repo");
const { findAllProducts } = require("../models/repositories/product.repo");

class DiscountService {
  static async createDiscountCode(payload) {
    const {
      code,
      start_date,
      end_date,
      is_active,
      shopId,
      min_order_value,
      product_ids,
      applies_to,
      name,
      desc,
      type,
      value,
      max_uses,
      used_count,
      max_uses_per_user,
    } = payload;

    // Kiểm tra ngày áp dụng
    const now = new Date();
    if (new Date(start_date) >= new Date(end_date)) {
      throw new BadRequestError("Invalid start_date or end_date");
    }
    if (now < new Date(start_date) || now > new Date(end_date)) {
      throw new BadRequestError("Discount is not valid for the current date");
    }

    // Kiểm tra sự tồn tại của mã giảm giá
    const foundDiscount = await discount
      .findOne({
        discount_code: code,
        discount_shopId: convertToObjectId(shopId),
      })
      .lean();

    if (foundDiscount && foundDiscount.discount_is_active) {
      throw new BadRequestError("Discount code already exists and is active");
    }

    // Tạo mới discount
    const newDiscount = await discount.create({
      discount_name: name,
      discount_code: code,
      discount_desc: desc,
      discount_type: type,
      discount_value: value,
      discount_start: new Date(start_date),
      discount_end: new Date(end_date),
      discount_max_uses: max_uses,
      discount_used_count: used_count || 0,
      discount_users_used: [],
      discount_max_uses_per_user: max_uses_per_user,
      discount_min_order_value: min_order_value,
      discount_shopId: convertToObjectId(shopId),
      discount_is_active: is_active ?? true,
      discount_applies_to: applies_to,
      discount_product_ids: product_ids || [],
    });

    return newDiscount;
  }

  static async updateDiscountCode(discountId, payload) {
    //Xóa bỏ các field null hoặc undefined
    const objectParams = removeUndefinedObject(payload);

    //Chuyển payload về dạng a.b.c = 123,...
    const updateDiscountPayload = updateNestedObjectParser(objectParams);

    return updateDiscountById({
      discountId,
      payload: updateDiscountPayload,
    });
  }

  static async getAllProductWithDiscountCode(payload) {
    const { code, shopId, limit, page } = payload;
    // Kiểm tra sự tồn tại của mã giảm giá
    const foundDiscount = await discount
      .findOne({
        discount_code: code,
        discount_shopId: convertToObjectId(shopId),
      })
      .lean();
    console.log(foundDiscount);

    if (!foundDiscount || !foundDiscount.discount_is_active) {
      throw new NotFoundError("discount not exits!");
    }

    const { discount_applies_to, discount_product_ids } = foundDiscount;
    let products;
    if (discount_applies_to === "all") {
      //get all product
      products = await findAllProducts({
        filter: {
          product_shop: convertToObjectId(shopId),
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: "ctime",
        select: ["product_name"],
      });
    }

    if (discount_applies_to === "specific") {
      //get product from discount_product_ids
      products = await findAllProducts({
        filter: {
          _id: { $in: discount_product_ids },
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: "ctime",
        select: ["product_name","product_price"],
      });
    }
    return products;
  }

  static async getAllDiscountCodesByShop({ limit, page, shopId }) {
    const discounts = await findAllDiscountCodesUnselect({
      limit: +limit,
      page: +page,
      filter: {
        discount_shopId: convertToObjectId(shopId),
        discount_is_active: true,
      },
      unSelect: ["_v", "discount_shopId"],
      model: discount,
    });
    return discounts;
  }

  static async getDiscountAmount({ code, userId, shopId, products }) {
    // Kiểm tra sự tồn tại của mã giảm giá
    const foundDiscount = await checkDiscountExist({
      model: discount,
      filter: {
        discount_code: code,
        discount_shopId: convertToObjectId(shopId),
      },
    });

    if (!foundDiscount) {
      throw new BadRequestError("Discount not exist");
    }

    const {
      discount_is_active,
      discount_max_uses,
      discount_start,
      discount_end,
      discount_min_order_value,
      discount_max_uses_per_user,
      discount_type,
      discount_value,
    } = foundDiscount;

    if (!discount_is_active) throw new BadRequestError("Discount expire");
    if (!discount_max_uses === 0) throw new BadRequestError("Discount are out");
    if (
      new Date() < new Date(discount_start) ||
      new Date() > new Date(discount_end)
    )
      throw new BadRequestError("Discount expire");
    let totalOrder = 0;
    if (discount_min_order_value > 0) {
      totalOrder = products.reduce((acc, product) => {
        return acc + product.quantity * product.price;
      }, 0);

      if (totalOrder < discount_min_order_value) {
        throw new BadRequestError(
          `discount require a minium order value of $(discount_min_order_value)`
        );
      }
    }

    // if (discount_max_uses_per_user) {
    //   const userUsedDiscount = discount_users_used.find(
    //     (user) => user.userId === userId
    //   );
    //   if (userUsedDiscount) {
    //     //..
    //   }
    // }

    const amount =
      discount_type === "fixed_amount"
        ? discount_value
        : totalOrder * (discount_value / 100);

    return {
      totalOrder,
      discount: amount,
      totalPrice: totalOrder - amount,
    };
  }

  static async deleteDiscountCode({ shopId, discountId }) {
    const deleted = await discount.findByIdAndDelete({
      _id: discountId,
      discount_shopId: convertToObjectId(shopId),
    });

    return deleted;
  }

  static async cancelDiscountCode({ discountId, shopId, userId }) {
    const foundDiscount = await checkDiscountExist({
      model: discount,
      filter: {
        _id: convertToObjectId(discountId),
        discount_shopId: convertToObjectId(shopId),
      },
    });

    if (!foundDiscount) throw new NotFoundError("discount not exist");

    const result = await discount.findByIdAndUpdate(foundDiscount._id, {
      $pull: {
        discount_users_used: userId,
      },
      $inc: {
        discount_max_uses: 1,
        discount_used_count: -1,
      },
    });

    return result;
  }
}

module.exports = DiscountService;
