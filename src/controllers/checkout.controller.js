"use strict";

const checkoutService = require("../services/checkout.service.js");
const { SuccessResponse } = require("../core/success.response.js");

class CheckoutController {
  
  checkoutReview = async (req, res, next) => {
    try {
      new SuccessResponse({
        message: "Checkout review success!",
        metadata: await checkoutService.checkoutReview({
          ...req.body,
        }),
      }).send(res);
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new CheckoutController();
