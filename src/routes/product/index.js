"use strict";

const express = require("express");
const productController = require("../../controllers/product.controller");
const { asyncHandler } = require("../../auth/checkAuth");
const { authenticationV2 } = require("../../auth/authUtils");
const router = express.Router();

// search
router.get("/search/:keySearch", asyncHandler(productController.getListSearchProduct));
router.get("", asyncHandler(productController.findAllProducts));

// CÁC ROUTE SAU auth
router.use(authenticationV2);

router.get("/drafts/all", asyncHandler(productController.getAllDraftForShop));
router.get("/published/all", asyncHandler(productController.getAllPublishForShop));

router.get("/:id", asyncHandler(productController.findProduct)); // <= chuyển xuống cuối

router.post("", asyncHandler(productController.createProduct));
router.patch("/:id", asyncHandler(productController.updateProduct));
router.post("/publish/:id", asyncHandler(productController.publishProductByShop));
router.post("/unPublish/:id", asyncHandler(productController.unPublishProductByShop));


module.exports = router;
