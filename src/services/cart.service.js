"use strict";

/*
  Cart Services
   1 - createUserCart (User)
   2 - updateUserCartQuantity (User)
   3 - addToCart (User)
   4 - addToCartV2  (User)
   5 - deleteUserCart (User)
   6 - getListUserCart (User)
*/

const cart = require("../models/cart.model");
const { getProductById, findProduct } = require("../models/repositories/product.repo");
const { NotFoundError, BadRequestError } = require("../core/error.response");
const { convertToObjectId } = require("../utils");

class CartService {
  static async createUserCart({ userId, product }) {
    if (!userId) throw new BadRequestError("Invalid userId");

    const query = {
      cart_userId: convertToObjectId(userId),
      cart_state: "active",
    };
    const updateOrInsert = {
      $addToSet: {
        cart_products: product,
      },
    };
    const options = { upsert: true, new: true };

    const result = await cart.findOneAndUpdate(query, updateOrInsert, options);
    if (!result) throw new Error("Failed to create or update user cart");
    return result;
  }

  static async updateUserCartQuantity({ userId, product }) {
    const { productId, quantity } = product;
    if (!userId || !productId) throw new BadRequestError("Invalid input data");

    const query = {
      cart_userId: convertToObjectId(userId),
      "cart_products.productId": productId,
      cart_state: "active",
    };
    const updateSet = {
      $set: {
        "cart_products.$.quantity": quantity,
      },
    };
    const options = { new: true };

    const result = await cart.findOneAndUpdate(query, updateSet, options);
    if (!result)
      throw new NotFoundError("Cart not found or product not updated");
    return result;
  }

  static async addToCart({ userId, product = {} }) {
    if (!userId) throw new BadRequestError("Invalid userId");

    const userCart = await cart.findOne({
      cart_userId: convertToObjectId(userId),
    });

    if (!userCart) {
      return await CartService.createUserCart({ userId, product });
    }

    if (!userCart.cart_products.length) {
      userCart.cart_products = [product];
      return await userCart.save();
    }

    return await CartService.updateUserCartQuantity({ userId, product });
  }

  static async addToCartV2({ userId, shop_order_ids = [] }) {
    if (!userId || !shop_order_ids.length)
      throw new BadRequestError("Invalid input data");

    const { productId, quantity, old_quantity } =
      shop_order_ids[0]?.item_products[0];

    const foundProduct = await getProductById({productId});
    
    if (!foundProduct) throw new NotFoundError("Product not exist");

    if (foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId) {
      throw new BadRequestError("Product does not belong to the shop");
    }

    if (quantity === 0) {
      return await CartService.deleteUserCart({ userId, productId });
    }

    return await CartService.updateUserCartQuantity({
      userId,
      product: {
        productId,
        quantity: quantity,
      },
    });
  }

  static async deleteUserCart({ userId, productId }) {
    if (!userId || !productId) throw new BadRequestError("Invalid input data");

    const query = {
      cart_userId: convertToObjectId(userId),
      cart_state: "active",
    };
    const updateSet = {
      $pull: {
        cart_products: {
          productId: convertToObjectId(productId), // Chuyển productId thành ObjectId nếu cần
        },
      },
    };
    

    const result = await cart.updateOne(query, updateSet);
    if (result.modifiedCount === 0)
      throw new NotFoundError("Cart or product not found");
    return result;
  }

  static async getListUserCart({ userId }) {
    if (!userId) throw new BadRequestError("Invalid userId");

    const result = await cart.findOne({
      cart_userId: convertToObjectId(userId),
    });

    if (!result) throw new NotFoundError("Cart not found");
    return result;
  }
}

module.exports = CartService;
