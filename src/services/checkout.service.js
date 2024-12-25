"use strict";

const { findCartById } = require("../models/repositories/cart.repo");
const { NotFoundError, BadRequestError } = require("../core/error.response");
const { checkProductByServer } = require("../models/repositories/product.repo");
const { getDiscountAmount } = require("../services/discount.service");

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

      // Kiểm tra tính hợp lệ của sản phẩm
      const checkProduct = await checkProductByServer(item_products);
      if (!checkProduct || checkProduct.length === 0) {
        throw new BadRequestError("Order contains invalid products");
      }

      // Tính tổng tiền trước khi áp dụng giảm giá
      const checkPrice = checkProduct.reduce((acc, product) => {
        return acc + product.quantity * product.price;
      }, 0);

      // Cập nhật tổng tiền trước giảm giá
      checkout_order.totalPrice += checkPrice;

      const itemCheckout = {
        shopId,
        shop_discounts: shop_discount,
        priceRaw: checkPrice,
        priceApplyDiscount: checkPrice,
        item_products: checkProduct,
      };

      // Nếu có mã giảm giá
      if (shop_discount.length > 0) {
        // Giả sử chỉ áp dụng 1 mã giảm giá đầu tiên
        const { totalPrice = 0, discount = 0 } = await getDiscountAmount({
          codeId: shop_discount[0].codeId,
          userId: userId,
          shopId: shopId,
          products: checkProduct,
        });

        // Tổng số tiền giảm được cộng dồn
        checkout_order.totalDiscount += discount;

        if (discount > 0) {
          itemCheckout.priceApplyDiscount = checkPrice - discount;
        }
      }

      // Cập nhật tổng tiền sau khi áp dụng giảm giá
      checkout_order.totalCheckout += itemCheckout.priceApplyDiscount;

      // Lưu vào danh sách đơn hàng mới
      shop_order_ids_new.push(itemCheckout);
    }

    return {
      shop_order_ids,
      shop_order_ids_new,
      checkout_order,
    };
  }
}

module.exports = CheckoutService;


