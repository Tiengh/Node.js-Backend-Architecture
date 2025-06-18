"use strict";

const { findCartById } = require("../models/repositories/cart.repo");
const { NotFoundError, BadRequestError } = require("../core/error.response");
const { checkProductByServer } = require("../models/repositories/product.repo");
const { getDiscountAmount } = require("../services/discount.service");
const { acquireLock, releaseLock } = require("./redis.service");
const { order } = require("../models/order.model");

class CheckoutService {
  static async checkoutReview({ cartId, userId, shop_order_ids }) {
    // Kiểm tra cartId
    const foundCart = await findCartById(cartId);
    if (!foundCart) throw new NotFoundError("Cart not exist");

    const checkout_order = {
      totalPrice: 0,
      ship: 0,
      totalDiscount: 0,
      totalCheckout: 0,
    };
    const shop_order_ids_new = [];

    for (let i = 0; i < shop_order_ids.length; i++) {
      const {
        shopId,
        shop_discount = [],
        item_products = [],
      } = shop_order_ids[i];

      // ✅ Kiểm tra sản phẩm hợp lệ và gắn quantity từ item_products
      const validProducts = await checkProductByServer(item_products);
      if (!validProducts || validProducts.length === 0) {
        throw new BadRequestError("Order contains invalid products");
      }

      // ✅ Gắn lại quantity từ item_products vào validProducts
      const enrichedProducts = validProducts.map((product) => {
        const requestedItem = item_products.find(
          (p) => p.productId.toString() === product.productId.toString()
        );
        return {
          ...product,
          quantity: requestedItem ? requestedItem.quantity : 1,
        };
      });

      // ✅ Tính tổng tiền trước giảm giá
      const checkPrice = enrichedProducts.reduce((acc, product) => {
        return acc + product.quantity * product.price;
      }, 0);

      // ✅ Cập nhật vào đơn hàng
      checkout_order.totalPrice += checkPrice;

      const itemCheckout = {
        shopId,
        shop_discounts: shop_discount,
        priceRaw: checkPrice,
        priceApplyDiscount: checkPrice,
        item_products: enrichedProducts,
      };

      // ✅ Áp dụng mã giảm giá nếu có
      if (shop_discount.length > 0) {
        const { totalPrice = 0, discount = 0 } = await getDiscountAmount({
          code: shop_discount[0].code,
          shopId: shopId,
          userId: userId,
          products: enrichedProducts,
        });

        checkout_order.totalDiscount += discount;

        if (discount > 0) {
          itemCheckout.priceApplyDiscount = checkPrice - discount;
        }
      }

      // ✅ Cập nhật tổng tiền cuối cùng
      checkout_order.totalCheckout += itemCheckout.priceApplyDiscount;

      // ✅ Lưu kết quả từng shop
      shop_order_ids_new.push(itemCheckout);
    }

    return {
      shop_order_ids,
      shop_order_ids_new,
      checkout_order,
    };
  }

  static async orderByUser({
    shop_order_ids,
    checkout_order,
    cartId,
    userId,
    user_address = {},
    user_payment = {},
  }) {
    const { shop_order_ids_new, checkout_order_new } =
      await CheckoutService.checkoutReview({
        cartId,
        userId,
        shop_order_ids,
      });

    //check tồn kho
    const products = shop_order_ids_new.flatMap((order) => order.item_products);
    console.log(`[1]: `, products);
    const acquireProduct = [];

    for (let i = 0; i < products.length; i++) {
      const { productId, quantity } = products[i];
      const keyLock = await acquireLock(productId, quantity, cartId);
      acquireProduct.push(keyLock ? true : false);
      if (keyLock) {
        await releaseLock(keyLock);
      }
    }

    if (acquireProduct.includes(false)) {
      throw new BadRequestError(
        "Một số sản phẩm đã được cập nhật vui lòng quay lại giở hàng!"
      );
    }

    const newOrder = await order.create({
      order_userId: userId,
      order_checkout: checkout_order_new,
      order_shopping: user_address,
      order_payment: user_payment,
      order_product: shop_order_ids_new,
    });

    //Nếu insert thành công thì xóa product trong cart
    if (newOrder) {
      //Xóa product trong cart

    }
    return newOrder;
  }

  static async getOrderByUser() {
  }

  static async getOneOrderByUser() {
  }

  static async cancelOrderByUser() {
  }

  static async updateOrderStatusByShop() {
  }

}

module.exports = CheckoutService;
