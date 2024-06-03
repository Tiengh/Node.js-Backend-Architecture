"use strict";

const { findById } = require("../services/apiKey.service");

const HEADERS = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
};

const apiKey = async (req, res, next) => {
  try {
    const key = req.headers[HEADERS.API_KEY]?.toString();
    if (!key) {
      return res.status(403).json({
        message: "Forbidden error!!",
      });
    }
    // check objKey
    const objKey = await findById(key);
    if (!objKey) {
      return res.status(403).json({
        message: "Forbidden error!!",
      });
    }
    req.objKey = objKey;
    return next();
  } catch (error) {
    // Log the error and send a generic error response
    console.error("Error in apiKey middleware:", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const permission = (permission) => {
  return (req, res, next) => {
    if (!req.objKey) {
      return res.status(403).json({
        message: "permission denied!!",
      });
    }
    if (!req.objKey.permissions) {
      return res.status(403).json({
        message: "permission denied!!",
      });
    }

    console.log(`permissions::`, req.objKey.permissions);
    const validPermission = req.objKey.permissions.includes(permission);
    if (!validPermission) {
      return res.status(403).json({
        message: "permission denied!!",
      });
    }
    return next();
  };
};

const asyncHandler = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

module.exports = {
  apiKey,
  permission,
  asyncHandler,
};
