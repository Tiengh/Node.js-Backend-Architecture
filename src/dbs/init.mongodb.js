"use strict";

const mongoose = require("mongoose");
const { countConnect } = require("../helpers/check.connect.js");
const {
  db: { host, port, name },
} = require("../configs/config.mongodb.js");
const connectString = `mongodb://${host}:${port}/${name}`;

console.log(`connectString: `,connectString);
class Database {
  constructor() {
    this.connect();
  }

  //connect
  connect(type = "mongodb") {
    if (1 === 1) {
      mongoose.set("debug", true);
      mongoose.set("debug", { color: true });
    }

    mongoose
      .connect(connectString, {
        maxPoolSize: 50,
      })
      .then((_) => {
        console.log("Connect successful ");
        countConnect();
      })
      .catch((err) => console.log("Error Connect!"));
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }

    return Database.instance;
  }
}

const instanceMongodb = Database.getInstance();
module.exports = instanceMongodb;
