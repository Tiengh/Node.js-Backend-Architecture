"use strict";

const CartService = require("../services/cart.service.js");
const { SuccessResponse } = require("../core/success.response.js");

class CartController {
  // // Tạo giỏ hàng
  // createUserCart = async (req, res, next) => {
  //   try {
  //     new SuccessResponse({
  //       message: "Create new cart success!",
  //       metadata: await CartService.createUserCart({
  //         userId: req.user.userId,
  //         ...req.body,
  //       }),
  //     }).send(res);
  //   } catch (error) {
  //     next(error);
  //   }
  // };

  // // Cập số lượng sản phẩmphẩm
  // updateUserCartQuantity = async (req, res, next) => {
  //   try {
  //     new SuccessResponse({
  //       message: "Update quantity success!",
  //       metadata: await CartService.updateUserCartQuantity({
  //         userId: req.user.userId,
  //         ...req.body,
  //       }),
  //     }).send(res);
  //   } catch (error) {
  //     next(error);
  //   }
  // };

  //them san pham vao gio hang
  addToCart = async (req, res, next) => {
    try {
      new SuccessResponse({
        message: "Add product to cart success!",
        metadata: await CartService.addToCart({
          userId: req.user.userId,
          ...req.body,
        }),
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  //update cart
  updateCart = async (req, res, next) => {
    try {
      new SuccessResponse({
        message: "Update cart success!",
        metadata: await CartService.addToCartV2({
          userId: req.user.userId,
          ...req.body,
        }),
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  //Delete cart
  deleteCart = async (req, res, next) => {
    try {
      new SuccessResponse({
        message: "Delete cart success!",
        metadata: await CartService.deleteUserCart({
          userId: req.user.userId,
          ...req.body,
        }),
      }).send(res);
    } catch (error) {
      next(error);
    }
  };
  
  //Lấy giỏ hàng với userId
  listToCart = async (req, res, next) => {
    try {
      new SuccessResponse({
        message: "Get list success!",
        metadata: await CartService.getListUserCart({
          userId: req.user.userId,
        }),
      }).send(res);
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new CartController();
