"use strict";

const shopModel = require("../models/shop.model.js");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service.js");
const { createTokenPair } = require("../Auth/authUtils.js");
const { getInfoData } = require("../utils/index.js");

const Role = {
  SHOP: "SHOP",
  WRITER: "0000W",
  EDITOR: "0000E",
  ADMIN: "0000A",
};

class AccessService {
  static signUp = async ({ name, email, password }) => {
    try {
      // step1: check email exists??
      const holderShop = await shopModel.findOne({ email }).lean();
      if (holderShop) {
        return {
          code: "xxxx",
          message: "Shop already registered!!",
        };
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const newShop = await shopModel.create({
        name,
        email,
        password: passwordHash,
        roles: [Role.SHOP],
      });

      if (newShop) {
        // Generate privateKey and publicKey
        const privateKey = crypto.randomBytes(64).toString('hex');
        const publicKey = crypto.randomBytes(64).toString('hex');

        console.log({ privateKey, publicKey });

        const keyStore = await KeyTokenService.createKeyToken({
          userId: newShop._id,
          publicKey,
          privateKey,
        });

        if (!keyStore) {
          return {
            code: "xxxxx",
            message: "Key storage error!!",
          };
        }

        // Create token pair
        const tokens = await createTokenPair(
          {
            userId: newShop._id,
            email,
          },
          publicKey,
          privateKey
        );
        console.log(`Created token success::`, tokens);
        return {
          code: 201,
          metadata: {
            shop: getInfoData({
              fields: ["_id", "name", "email"],
              object: newShop,
            }),
            tokens,
          },
        };
      }
      return {
        code: 200,
        metadata: null,
      };
    } catch (error) {
      return {
        code: "xx1",
        message: error.message,
        status: "error",
      };
    }
  };
}

module.exports = AccessService;
