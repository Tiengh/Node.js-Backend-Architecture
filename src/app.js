require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const { default: helmet } = require("helmet");
const compression = require("compression");
const app = express();

//init middleware
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// test pub/sub
InventoryServiceTest = require("./test/inventory.test.js");
ProductServiceTest = require("./test/product.test.js");

(async () => {
  await InventoryServiceTest.init(); // ✅ đảm bảo đã subscribe
  await ProductServiceTest.purchaseProduct("product:001", 10); // sau đó mới publish
})();

//init db
require("./dbs/init.mongodb.js");
// const {checkOverload} = require('./helpers/check.connect');
// checkOverload()

//init routerX
app.use("/", require("./routes"));

//handling error
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});
app.use((error, req, res, next) => {
  const statusCode = error.status || 500;
  return res.status(statusCode).json({
    status: "error",
    code: statusCode,
    stack: error.stack,
    message: error.message || "Internal Server Error",
  });
});

//handle error
module.exports = app;
