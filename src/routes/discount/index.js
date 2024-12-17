"use strict";

const express = require("express");
const DiscountController = require("../../controllers/discount.controller");
const { asyncHandler } = require("../../auth/checkAuth");
const { authenticationV2 } = require("../../auth/authUtils");
const router = express.Router();

router.post("/amount", asyncHandler(DiscountController.getDiscountAmount));
router.get(
  "/list_product",
  asyncHandler(DiscountController.getAllProductWithDiscountCode)
);

// authentication //
router.use(authenticationV2);

router.post("/", asyncHandler(DiscountController.createDiscountCode));
router.get("", asyncHandler(DiscountController.getAllDiscountCodesByShop));
router.patch("/:id", asyncHandler(DiscountController.updateDiscountCode));
router.delete("/:id", asyncHandler(DiscountController.deleteDiscountCode));
router.post("/cancel/:id", asyncHandler(DiscountController.cancelDiscountCode));

module.exports = router;
