"use strict";

const JWT = require("jsonwebtoken");
const { asyncHandler } = require("../helpers/asyncHandler.js");
const { AuthFailureError, NotFoundError } = require("../core/error.response");
const { findByUserId } = require("../services/keyToken.service.js");

const HEADERS = {
  API_KEY: "x-api-key",
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "authorization",
  REFRESH_TOKEN: "refresh-token",
};

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    // Access token
    const accessToken = await JWT.sign(payload, publicKey, {
      expiresIn: "2 days",
    });
    // Refresh token
    const refreshToken = await JWT.sign(payload, privateKey, {
      expiresIn: "7 days",
    });

    // Example verify
    JWT.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
        console.error(`Error verify:`, err);
      } else {
        console.log(`Decode verify:`, decode);
      }
    });

    return { accessToken, refreshToken };
  } catch (error) {
    console.error(`Error creating token pair:`, error);
    throw error;
  }
};

const authenticationV2 = asyncHandler(async (req, res, next) => {
  /*
   1 - Check userId missing???
   2 - get accessToken
   3 - verify token
   4 - check user in dbs
   5 - check key store with this userId
   6 - Ok all => return next
  */
  // 1
  const userId = req.headers[HEADERS.CLIENT_ID];
  if (!userId) throw new AuthFailureError("Invalid request!");

  // 2
  const keyStore = await findByUserId(userId);
  if (!keyStore) throw new NotFoundError("Not found keyStore!");

  // 3
  if (req.headers[HEADERS.REFRESH_TOKEN]) {
    try {
      const refreshToken = req.headers[HEADERS.REFRESH_TOKEN];
      const decodeUser = JWT.verify(refreshToken, keyStore.privateKey);
      if (userId != decodeUser.userId)
        throw new AuthFailureError("Invalid userId!");
      req.keyStore = keyStore;
      req.refreshToken = refreshToken;
      req.user = decodeUser;
      return next();
    } catch (error) {
      console.error(`Error verifying token:`, error);
      throw error;
    }
  }

  const accessToken = req.headers[HEADERS.AUTHORIZATION];
  if (!accessToken) throw new AuthFailureError("Invalid request!");

  // 4, 5, 6
  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
    if (userId != decodeUser.userId)
      throw new AuthFailureError("Invalid userId!");
    req.keyStore = keyStore;
    req.user = decodeUser;
    return next();
  } catch (error) {
    console.error(`Error verifying token:`, error);
    throw error;
  }
});

const authentication = asyncHandler(async (req, res, next) => {
  /*
   1 - Check userId missing???
   2 - get accessToken
   3 - verify token
   4 - check user in dbs
   5 - check key store with this userId
   6 - Ok all => return next
  */
  // 1
  const userId = req.headers[HEADERS.CLIENT_ID];
  if (!userId) throw new AuthFailureError("Invalid request!");

  // 2
  const keyStore = await findByUserId(userId);
  if (!keyStore) throw new NotFoundError("Not found keyStore!");

  // 3
  if (req.headers[HEADERS.REFRESH_TOKEN])
    // 4, 5, 6
    try {
      const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
      if (userId != decodeUser.userId)
        throw new AuthFailureError("Invalid userId!");
      req.keyStore = keyStore;
      req.user = decodeUser;
      next();
    } catch (error) {
      console.error(`Error verifying token:`, error);
      throw error;
    }
});

const verifyJWT = async (token, keySecret) => {
  return await JWT.verify(token, keySecret);
};

module.exports = {
  createTokenPair,
  authentication,
  verifyJWT,
  authenticationV2,
};
