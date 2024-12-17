"use strict";

/*
  Product Services
   1 - createProduct [Shop]
   2 - updateProduct [Shop]
   3 - publishProductByShop [Shop]
   4 - unPublishProductByShop  [Shop]
   5 - findAllDraftForShop [Shop]
   6 - findAllPublishForShop [Shop]
   7 - searchProducts [User]
   8 - findProduct [Shop | Admin]
    
*/


const {
  product,
  clothing,
  electronic,
  furniture,
} = require("../models/product.model");
const { BadRequestError } = require("../core/error.response");

const {
  findAllDraftForShop,
  publishProductByShop,
  findAllPublishForShop,
  unPublishProductByShop,
  searchProductByUser,
  findAllProducts,
  findProduct,
  updateProductById,
} = require("../models/repositories/product.repo");
const {
  removeUndefineObject,
  removeUndefinedObject,
  updateNestedObjectParser,
} = require("../utils");
const { insertInventory } = require("../models/repositories/inventory.repo");

// Define Factory class to create products
class ProductFactory {
  static productRegistry = {};

  static registerProductType(type, classRef) {
    ProductFactory.productRegistry[type] = classRef;
  }

  static async createProduct(type, payload) {
    const ProductClass = ProductFactory.productRegistry[type];
    if (!ProductClass) {
      throw new Error(`Product type ${type} is not registered.`);
    }
    return new ProductClass(payload).createProduct();
  }

  static async updateProduct(type, productId, payload) {
    const ProductClass = ProductFactory.productRegistry[type];
    if (!ProductClass) {
      throw new Error(`Product type ${type} is not registered.`);
    }
    const productInstance = new ProductClass(payload);
    const result = await productInstance.updateProduct(productId);
    return result;
  }

  // PUT //
  static async publishProductByShop({ product_shop, product_id }) {
    return await publishProductByShop({ product_shop, product_id });
  }
  static async unPublishProductByShop({ product_shop, product_id }) {
    return await unPublishProductByShop({ product_shop, product_id });
  }
  // END PUT //

  // Query //
  static async findAllDraftForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isDraft: true };
    return await findAllDraftForShop({ query, limit, skip });
  }
  static async findAllPublishForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isDraft: false, isPublished: true };
    return await findAllPublishForShop({ query, limit, skip });
  }
  static async searchProducts({ keySearch }) {
    return await searchProductByUser({ keySearch });
  }
  static async findAllProducts({
    limit = 50,
    sort = "ctime",
    page = 1,
    filter = { isPublished: true },
  }) {
    return await findAllProducts({
      limit,
      sort,
      page,
      filter,
      select: ["product_name", "product_price", "product_thumb"],
    });
  }
  static async findProduct({ product_id }) {
    return await findProduct({ product_id, unSelect: ["__v"] });
  }
  // END QUERY //
}

// Define base Product
class Product {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_quantity,
    product_type,
    product_shop,
    product_attributes,
  }) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_price = product_price;
    this.product_quantity = product_quantity;
    this.product_type = product_type;
    this.product_shop = product_shop;
    this.product_attributes = product_attributes;
  }

  // Create new product
  async createProduct(product_id) {
    const newProduct = await product.create({ ...this, _id: product_id });
    if (newProduct) {
      await insertInventory({
        product_id: newProduct._id,
        shopId: this.product_shop,
        stock: this.product_quantity,
      });
    }
    return newProduct;
  }
  

  // Update product
  async updateProduct(productId, payload) {
    return await updateProductById({ productId, payload, model: product });
  }
}

// Define sub-classes for different product types

class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newClothing) throw new BadRequestError("Create new Clothing error!");

    const newProduct = await super.createProduct(newClothing._id);
    if (!newProduct) throw new BadRequestError("Create new Product error!");

    return newProduct;
  }

  async updateProduct(productId) {
    // Remove attributes that are null or undefined
    const objectParams = removeUndefinedObject(this);

    // Check if product_attributes exists
    if (objectParams.product_attributes) {
      const bodyUpdate = { ...this.product_attributes };

      // Update child
      const updateChildResult = await updateProductById({
        productId,
        payload: updateNestedObjectParser(bodyUpdate),
        model: clothing,
      });
    }
    // Update product
    const updateProduct = await super.updateProduct(
      productId,
      updateNestedObjectParser(objectParams)
    );

    return updateProduct;
  }
}

class Electronic extends Product {
  async createProduct() {
    const newElectronic = await electronic.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newElectronic)
      throw new BadRequestError("Create new Electronic error!");

    const newProduct = await super.createProduct(newElectronic._id);
    if (!newProduct) throw new BadRequestError("Create new Product error!");

    return newProduct;
  }

  async updateProduct(productId) {
    // Remove attributes that are null or undefined
    const objectParams = removeUndefinedObject(this);

    // Check if product_attributes exists
    if (objectParams.product_attributes) {
      const bodyUpdate = { ...this.product_attributes };

      // Update child
      const updateChildResult = await updateProductById({
        productId,
        payload: updateNestedObjectParser(bodyUpdate),
        model: electronic,
      });
    }
    // Update product
    const updateProduct = await super.updateProduct(
      productId,
      updateNestedObjectParser(objectParams)
    );

    return updateProduct;
  }
}

class Furniture extends Product {
  async createProduct() {
    const newFurniture = await furniture.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newFurniture) throw new BadRequestError("Create new Furniture error!");

    const newProduct = await super.createProduct(newFurniture._id);
    if (!newProduct) throw new BadRequestError("Create new Product error!");

    return newProduct;
  }

  async updateProduct(productId) {
    // Remove attributes that are null or undefined
    const objectParams = removeUndefinedObject(this);

    // Check if product_attributes exists
    if (objectParams.product_attributes) {
      const bodyUpdate = { ...this.product_attributes };

      // Update child
      const updateChildResult = await updateProductById({
        productId,
        payload: updateNestedObjectParser(bodyUpdate),
        model: furniture,
      });
    }
    // Update product
    const updateProduct = await super.updateProduct(
      productId,
      updateNestedObjectParser(objectParams)
    );

    return updateProduct;
  }
}

ProductFactory.registerProductType("Electronic", Electronic);
ProductFactory.registerProductType("Clothing", Clothing);
ProductFactory.registerProductType("Furniture", Furniture);

module.exports = ProductFactory;
