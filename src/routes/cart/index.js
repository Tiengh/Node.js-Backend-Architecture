"use strict";

const express = require("express");
const CartController = require("../../controllers/cart.controller");
const { asyncHandler } = require("../../auth/checkAuth");
const { authenticationV2 } = require("../../auth/authUtils");
const router = express.Router();


// authentication //
router.use(authenticationV2);

router.post("/", asyncHandler(CartController.addToCart));
router.post("/update", asyncHandler(CartController.updateCart));
router.delete("/", asyncHandler(CartController.deleteCart));
router.get("/", asyncHandler(CartController.listToCart));



module.exports = router;
