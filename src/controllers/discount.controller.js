"use strict";

const DiscountService = require("../services/discount.service.js");
const { SuccessResponse } = require("../core/success.response.js");

class DiscountController {
  // Tạo mã giảm giá
  createDiscountCode = async (req, res, next) => {
    try {
      new SuccessResponse({
        message: "Create new discount code success!",
        metadata: await DiscountService.createDiscountCode({
          ...req.body,
          shopId: req.user.userId,
        }),
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  // Cập nhật mã giảm giá
  updateDiscountCode = async (req, res, next) => {
    try {
      new SuccessResponse({
        message: "Update discount code success!",
        metadata: await DiscountService.updateDiscountCode(req.params.id, {
          ...req.body,
        }),
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  // Lấy danh sách sản phẩm theo mã giảm giá
  getAllProductWithDiscountCode = async (req, res, next) => {
    try {
      new SuccessResponse({
        message: "Get products with discount code success!",
        metadata: await DiscountService.getAllProductWithDiscountCode({
          code: req.body.code,
          shopId: req.body.userId,
        }),
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  // Lấy tất cả mã giảm giá của shop
  getAllDiscountCodesByShop = async (req, res, next) => {
    try {
      new SuccessResponse({
        message: "Get all discount codes by shop success!",
        metadata: await DiscountService.getAllDiscountCodesByShop({
          limit: req.query.limit,
          page: req.query.page,
          shopId: req.user.userId,
        }),
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  // Tính giá trị giảm giá
  getDiscountAmount = async (req, res, next) => {
    try {
      new SuccessResponse({
        message: "Get discount amount success!",
        metadata: await DiscountService.getDiscountAmount({
          code: req.body.code,
          userId: req.body.userId,
          shopId: req.body.shopId,
          products: req.body.products,
        }),
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  // Xóa mã giảm giá
  deleteDiscountCode = async (req, res, next) => {
    try {
      new SuccessResponse({
        message: "Delete discount code success!",
        metadata: await DiscountService.deleteDiscountCode({
          shopId: req.user.userId,
          discountId: req.params.id,
        }),
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  // Hủy mã giảm giá
  cancelDiscountCode = async (req, res, next) => {
    try {
      new SuccessResponse({
        message: "Cancel discount code success!",
        metadata: await DiscountService.cancelDiscountCode({
          discountId: req.params.id,
          shopId: req.body.shopId,
          userId: req.user.userId,
        }),
      }).send(res);
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new DiscountController();
