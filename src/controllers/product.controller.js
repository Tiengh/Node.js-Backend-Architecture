"use strict";

const ProductService = require("../services/product.service.js");

const { SuccessResponse } = require("../core/success.response.js");

class ProductController {
  createProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Create new product success!",
      metadata: await ProductService.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  publishProductByShop = async (req,res,next) => {
    new SuccessResponse({
      message: "Publish product success!",
      metadata: await ProductService.publishProductByShop( {
        product_shop: req.user.userId,
        product_id : req.params.id,
      }),
    }).send(res);
  }

  unPublishProductByShop = async (req,res,next) => {
    new SuccessResponse({
      message: "unPublish product success!",
      metadata: await ProductService.unPublishProductByShop( {
        product_shop: req.user.userId,
        product_id : req.params.id,
      }),
    }).send(res);
  }

  // QUERY //
  /**
   * @desc Get all Draft for shop
   * @param { Number } limit
   * @param { Number } skip
   * @returns { JSON }
   */
  getAllDraftForShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list draft success!",
      metadata: await ProductService.findAllDraftForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  getAllPublishForShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list publish success!",
      metadata: await ProductService.findAllPublishForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  getListSearchProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list search product success!",
      metadata: await ProductService.searchProducts({
        keySearch: req.params.keySearch,
      }),
    }).send(res);
  };
  // END QUERY //
}

module.exports = new ProductController();
