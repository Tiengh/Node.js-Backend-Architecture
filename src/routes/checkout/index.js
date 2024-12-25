"use strict";

const express = require("express");
const CheckoutController = require("../../controllers/checkout.controller");
const { asyncHandler } = require("../../auth/checkAuth");
const { authenticationV2 } = require("../../auth/authUtils");
const router = express.Router();


// authentication //
router.use(authenticationV2);

router.post("/review", asyncHandler(CheckoutController.checkoutReview));


module.exports = router;
