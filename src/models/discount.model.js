// inventory.model.js
"use strict";

const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = "Discount";
const COLLECTION_NAME = "discounts";

const discountSchema = new Schema(
  {
    discount_name: { type: String, require: true },
    discount_code: { type: String, require: true },
    discount_desc: { type: String, require: true },
    discount_type: { type: String, default: "fixed_amount" }, 
    discount_value: { type: Number, require: true }, //15k,20k,... 
    discount_start: { type: Date, require: true },//thoi gian ap dung
    discount_end: { type: Date, require: true },//thoi gian het han
    discount_max_uses: { type: Number, require: true },//so luong toi da
    discount_used_count: { type: Number, require: true },//so luong da su dung
    discount_users_used: { type: Array, default: [] }, //ai da su dung
    discount_max_uses_per_user: { type: Number, require: true }, //so discount 1 user co the dung
    discount_min_order_value: { type: Number, require: true },//gia tien toi thieu
    discount_shopId: { type: Schema.Types.ObjectId, ref: "Shop" },

    discount_is_active: { type: Boolean, default: true },
    discount_applies_to: { type: String, require: true, enum: ["all", "specific"]},
    discount_product_ids: { type: Array, default: [] },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

module.exports = model(DOCUMENT_NAME, discountSchema);
