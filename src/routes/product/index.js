"use strict";

const express = require("express");
const productController = require("../../controllers/product.controller");
const { asyncHandler } = require("../../auth/checkAuth");
const { authenticationV2 } = require("../../auth/authUtils");
const router = express.Router();

// search
router.get("/search/:keySearch", asyncHandler(productController.getListSearchProduct));
router.get("", asyncHandler(productController.findAllProducts));
router.get("/:id", asyncHandler(productController.findProduct));



// authentication //
router.use(authenticationV2);

// create //
router.post("", asyncHandler(productController.createProduct));

// put //
router.post("/publish/:id", asyncHandler(productController.publishProductByShop));
router.post("/unPublish/:id", asyncHandler(productController.unPublishProductByShop));


// QUERY //
router.get("/drafts/all", asyncHandler(productController.getAllDraftForShop));
router.get("/published/all", asyncHandler(productController.getAllPublishForShop));


module.exports = router;
