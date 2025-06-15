"use strict";

const { update } = require("lodash");
const {
  product,
  electronic,
  clothing,
  furniture,
} = require("../../models/product.model");
const { Types } = require("mongoose");
const {
  getSelectData,
  unGetSelectData,
  convertToObjectId,
} = require("../../utils/index");

const searchProductByUser = async ({ keySearch }) => {
  const regexSearch = new RegExp(keySearch);
  const results = await product
    .find(
      {
        isDraft: false,
        $text: { $search: regexSearch },
      },
      { score: { $meta: "textScore" } }
    )
    .sort({ score: { $meta: "textScore" } })
    .lean();

  return results;
};

const findAllDraftForShop = async ({ query, limit, skip }) => {
  return await queyProduct({ query, limit, skip });
};

const findAllPublishForShop = async ({ query, limit, skip }) => {
  return await queyProduct({ query, limit, skip });
};

const findAllProducts = async ({ limit, sort, page, filter, select }) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const products = await product
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean();
  return products;
};

const findProduct = async ({ product_id, unSelect }) => {
  return await product.findById(product_id).select(unGetSelectData(unSelect));
};

const updateProductById = async ({
  productId,
  payload,
  model,
  isNew = true,
}) => {
  console.log("repo:", model);
  return await model.findByIdAndUpdate(productId, payload, { new: isNew });
};

const publishProductByShop = async ({ product_shop, product_id }) => {
  const foundProduct = await product.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id),
  });
  if (!foundProduct) return null;
  foundProduct.isDraft = false;
  foundProduct.isPublished = true;
  const { modifiedCount } = await foundProduct.updateOne(foundProduct);

  return modifiedCount;
};

const unPublishProductByShop = async ({ product_shop, product_id }) => {
  const foundProduct = await product.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id),
  });
  if (!foundProduct) return null;
  foundProduct.isDraft = true;
  foundProduct.isPublished = false;
  const { modifiedCount } = await foundProduct.updateOne(foundProduct);

  return modifiedCount;
};

const queyProduct = async ({ query, limit, skip }) => {
  return await product
    .find(query)
    .populate("product_shop", "name email -_id")
    .sort({ update: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
};

const getProductById = async ({ productId }) => {
  return await product.findById({
    _id: convertToObjectId(productId),
  });
};


// Hàm kiểm tra sản phẩm
const checkProductByServer = async (products) => {
  return await Promise.all(
    products.map(async (product) => {
      try {
        const foundProduct = await findProduct({ product_id: product.productId });

        if (!foundProduct) {
          console.warn(`❌ Product not found: ${product.productId}`);
          return null;
        }

        // ✅ In ra thông tin sản phẩm nếu tìm thấy
        console.log(`✅ Found product: ${foundProduct._id} - ${foundProduct.product_name}`);

        // ✅ Kiểm tra tồn kho
        if (foundProduct.product_quantity < product.quantity) {
          console.warn(`⚠️ Not enough stock for product: ${product.productId} | Required: ${product.quantity}, Available: ${foundProduct.product_quantity}`);
          return null;
        }

        // ✅ Trả về dữ liệu cần thiết
        return {
          price: foundProduct.product_price,
          quantity: foundProduct.product_quantity,
          productId: foundProduct._id,
          name: foundProduct.product_name,
        };
      } catch (err) {
        console.error(`❌ Error while validating product ${product.productId}:`, err);
        return null;
      }
    })
  ).then((results) => results.filter((product) => product !== null));


};



module.exports = {
  findAllDraftForShop,
  findAllPublishForShop,
  findAllProducts,
  findProduct,
  updateProductById,
  publishProductByShop,
  unPublishProductByShop,
  searchProductByUser,
  getProductById,
  checkProductByServer,
};
