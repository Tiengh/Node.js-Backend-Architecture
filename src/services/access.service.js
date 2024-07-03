"use strict";

const shopModel = require("../models/shop.model.js");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service.js");
const { createTokenPair, verifyJWT } = require("../auth/authUtils.js");
const { getInfoData } = require("../utils/index.js");
const {
  BadRequestError,
  ConflictRequestError,
  AuthFailureError,
  ForbiddenError,
} = require("../core/error.response.js");

// service //
const { findByEmail } = require("./shop.service.js");
const keyTokenModel = require("../models/keyToken.model.js");

const Role = {
  SHOP: "SHOP",
  WRITER: "0000W",
  EDITOR: "0000E",
  ADMIN: "0000A",
};

class AccessService {
  static handlerRefreshToken = async ({ refreshToken }) => {
    refreshToken = String(refreshToken); // Ensure refreshToken is a string

    const foundToken = await KeyTokenService.findByRefreshTokenUsed(
      refreshToken
    );
    if (foundToken) {
      const { userId, email } = await verifyJWT(
        refreshToken,
        foundToken.privateKey
      );
      console.log("[1]--", { userId, email });
      await KeyTokenService.removeKeyByUserId(userId);
      throw new ForbiddenError("Something wrong happened! Please relogin.");
    }

    const holderToken = await KeyTokenService.findByRefreshToken(refreshToken);
    if (!holderToken) throw new AuthFailureError("Shop not registered! - 1");

    const { userId, email } = await verifyJWT(
      refreshToken,
      holderToken.privateKey
    );
    console.log("[2]--", { userId, email });

    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new AuthFailureError("Shop not registered! - 2");

    const tokens = await createTokenPair(
      { userId, email },
      holderToken.publicKey,
      holderToken.privateKey
    );

    await keyTokenModel.updateOne(
      { user: holderToken.user },
      {
        $set: {
          refreshToken: tokens.refreshToken,
        },
        $addToSet: {
          refreshTokenUsed: refreshToken,
        },
      }
    );

    return {
      user: { userId, email },
      tokens,
    };
  };

  static handlerRefreshTokenV2 = async ({ refreshToken, user, keyStore }) => {
    try {
      refreshToken = String(refreshToken); // Ensure refreshToken is a string
  
      const { userId, email } = user;
  
      // Check if refreshToken has been used before
      if (keyStore.refreshTokenUsed.includes(refreshToken)) {
        await KeyTokenService.removeKeyByUserId(userId);
        throw new ForbiddenError("Something wrong happened! Please relogin.");
      }
  
      // Validate the provided refreshToken
      if (keyStore.refreshToken !== refreshToken) {
        throw new AuthFailureError("Shop not registered! - 1");
      }
  
      // Find the shop by email
      const foundShop = await findByEmail({ email });
      if (!foundShop) {
        throw new AuthFailureError("Shop not registered! - 2");
      }
  
      // Create new token pair
      const tokens = await createTokenPair(
        { userId, email },
        keyStore.publicKey,
        keyStore.privateKey
      );
  
      // Update the key token model with the new refresh token and mark the old one as used
      const result = await keyTokenModel.updateOne(
        { user: userId },
        {
          $set: {
            refreshToken: String(tokens.refreshToken),
          },
          $addToSet: {
            refreshTokenUsed: String(refreshToken),
          },
        }
      );
  
      // Check if the update was successful
      if (result.nModified === 0) {
        throw new Error("Failed to update refresh token");
      }
  
      return {
        user,
        tokens,
      };
    } catch (error) {
      console.error(`Error in handlerRefreshTokenV2:`, error);
      throw error;
    }
  };
  
  

  static logout = async ({ keyStore }) => {
    const delKey = await KeyTokenService.removeKeyById(keyStore._id);
    console.log({ delKey });
    return delKey;
  };

  static login = async ({ email, password, refreshToken = null }) => {
    /*
    1 - check email exist
    2 - match password 
    3 - create PublicKey vs PrivateKey
    4 - generate tokens
    5 - get data return login 
    */
    //*1
    const foundShop = await findByEmail({ email });
    if (!foundShop) {
      throw new BadRequestError("Shop not registered!");
    }
    //*2
    const match = await bcrypt.compare(password, foundShop.password); // Await added here
    if (!match) {
      throw new AuthFailureError("Authentication error!");
    }
    //*3
    const privateKey = crypto.randomBytes(64).toString("hex");
    const publicKey = crypto.randomBytes(64).toString("hex");

    const { _id: userId } = foundShop;
    //*4
    const tokens = await createTokenPair(
      {
        userId,
        email,
      },
      publicKey,
      privateKey
    );

    await KeyTokenService.createKeyToken({
      userId,
      refreshToken: tokens.refreshToken,
      privateKey,
      publicKey,
    });

    return {
      shop: getInfoData({
        fields: ["_id", "name", "email"],
        object: foundShop,
      }),
      tokens,
    };
  };

  static signUp = async ({ name, email, password }) => {
    /*
    1 - check email exist
    2 - create new shop model
    3 - create keyToken (AccessToken, RefreshToken) and save
    4 - get data return 
    */
    try {
      //*1
      const holderShop = await shopModel.findOne({ email }).lean();
      if (holderShop) {
        throw new BadRequestError("Error: shop already registered");
      }

      //*2
      const passwordHash = await bcrypt.hash(password, 10);
      const newShop = await shopModel.create({
        name,
        email,
        password: passwordHash,
        roles: [Role.SHOP],
      });

      //*3
      const privateKey = crypto.randomBytes(64).toString("hex");
      const publicKey = crypto.randomBytes(64).toString("hex");

      const tokens = await createTokenPair(
        {
          userId: newShop._id,
          email,
        },
        publicKey,
        privateKey
      );
      if (newShop) {
        // Generate privateKey and publicKey
        const keyStore = await KeyTokenService.createKeyToken({
          userId: newShop._id,
          publicKey,
          privateKey,
          refreshToken: tokens.refreshToken,
        });
        if (!keyStore) {
          throw new BadRequestError("Error: keyStore error", 500);
        }

        //*4
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
