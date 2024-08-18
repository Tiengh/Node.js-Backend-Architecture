"use strict";

const _ = require("lodash");

const getInfoData = ({ fields = [], object = {} }) => {
  return _.pick(object, fields);
};

//['a','b'] => {a:1,b:1}
const getSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 1]));
};

//['a','b'] => {a:0,b:0}
const unGetSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 0]));
};

//remove undefine or null object
const removeUndefinedObject = (obj) => {
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }
  Object.keys(obj).forEach((k) => {
    if (obj[k] && typeof obj[k] === "object") {
      obj[k] = removeUndefinedObject(obj[k]);
    }
    if (obj[k] === null || obj[k] === undefined) {
      delete obj[k];
    }
  });
  return obj;
};

const updateNestedObjectParser = (obj) => {
  const final = {};
  Object.keys(obj).forEach((k) => {
    if (typeof obj[k] === "object" && !Array.isArray(obj[k])) {
      const response = updateNestedObjectParser(obj[k]);
      Object.keys(response).forEach((a) => {
        final[`${k}.${a}`] = response[a];
      });
    } else {
      final[k] = obj[k];
    }
  });
  return final;
};

module.exports = {
  getInfoData,
  getSelectData,
  unGetSelectData,
  removeUndefinedObject,
  updateNestedObjectParser,
};
