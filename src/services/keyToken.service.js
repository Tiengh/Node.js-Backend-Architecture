'use strict';


/*
  KeyTokenService Services
   1 - createKeyToken [User]
   2 - findByUserId [User]
   3 - findByRefreshTokenUsed [User]
   4 - findByRefreshToken  [User]
   5 - removeKeyById [User]
   6 - removeKeyByUserId [User]
*/

const keyTokenModel = require("../models/keyToken.model");
const { Types } = require("mongoose");

class KeyTokenService {
  static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
    try {
      const filter = { user: new Types.ObjectId(userId) }; // Convert userId to ObjectId
      const update = {
        publicKey,
        privateKey,
        refreshTokenUsed: [],
        refreshToken: String(refreshToken), // Ensure refreshToken is a string
      };
      const options = { upsert: true, new: true };
      const tokens = await keyTokenModel.findOneAndUpdate(filter, update, options);
      return tokens ? tokens.publicKey : null;
    } catch (error) {
      console.error(`Error in createKeyToken:`, error);
      return error;
    }
  };

  static findByUserId = async (userId) => {
    try {
      return await keyTokenModel.findOne({ user: new Types.ObjectId(userId) }).lean();
    } catch (error) {
      console.error(`Error in findByUserId:`, error);
      throw error;
    }
  };

  static findByRefreshTokenUsed = async (refreshToken) => {
    try {
      return await keyTokenModel.findOne({ refreshTokenUsed: String(refreshToken) }).lean();
    } catch (error) {
      console.error(`Error in findByRefreshTokenUsed:`, error);
      throw error;
    }
  };

  static findByRefreshToken = async (refreshToken) => {
    try {
      return await keyTokenModel.findOne({ refreshToken: String(refreshToken) });
    } catch (error) {
      console.error(`Error in findByRefreshToken:`, error);
      throw error;
    }
  };

  static removeKeyById = async (id) => {
    try {
      return await keyTokenModel.findByIdAndDelete(id);
    } catch (error) {
      console.error(`Error in removeKeyById:`, error);
      throw error;
    }
  };

  static removeKeyByUserId = async (userId) => {
    try {
      return await keyTokenModel.findOneAndDelete({ user: new Types.ObjectId(userId) }); // Corrected method
    } catch (error) {
      console.error(`Error in removeKeyByUserId:`, error);
      throw error;
    }
  };
}

module.exports = KeyTokenService;
