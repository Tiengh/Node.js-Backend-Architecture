"use strict";

const express = require("express");
const accessController = require("../../controllers/access.controller");
const { asyncHandler } = require("../../auth/checkAuth");
const { authenticationV2 } = require("../../auth/authUtils");
const router = express.Router();

//sign up
router.post("/shop/signup", asyncHandler(accessController.signUp));

//login
router.post("/shop/login", asyncHandler(accessController.login));

//authentication
router.use(authenticationV2);
//logout
router.post("/shop/logout", asyncHandler(accessController.logout));
//handler refresh token
router.post(
  "/shop/handler",
  asyncHandler(accessController.handlerRefreshToken)
);

module.exports = router;
