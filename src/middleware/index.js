'use strict';

const Logger = require('../logger/discord.log');

const pushToLogDiscord = async (req, res, next) => {
  try {
    await Logger.sendToFormatCode({
      title: `Method: ${req.method}`,
      code: req.method === 'GET' ? req.query : req.body,
      message: `${req.get('host')}${req.originalUrl}`,
    });

    return next();
  } catch (error) {
    console.error("❌ pushToLogDiscord middleware error:", error.message);
    next(error);
  }
};

module.exports = {
  pushToLogDiscord,
};
