"use strict";

// inventory.model.js
"use strict";

const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = "Order";
const COLLECTION_NAME = "Orders";

const orderScheme = new Schema(
  {
    order_userId: { type: Number, require: true },
    order_checkout: { type: Object, default: {} },
    order_shipping: { type: Object, default: {} },
    order_payment: { type: Object, default: {} },
    order_products: { type: Array, require: true },
    order_trackingNumber: { type: String, default: "a123456789" },
    order_status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "cancelled", "delivered"],
      default: "pending",
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: {
      createdAt: "createdOn",
      updatedAt: "modifiedOn",
    },
  }
);

module.exports = model(DOCUMENT_NAME, orderScheme);
