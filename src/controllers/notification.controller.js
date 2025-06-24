"use strict";

const { SuccessResponse } = require("../core/success.response");
const {
  listNotiByUser,
  pushNotiToSystem,
} = require("../services/notification.service");

class NotificationController {
//   createNoti = async (req, res, next) => {
//     new SuccessResponse({
//       message: "create new comment",
//       metadata: await createComment(req.body),
//     }).send(res);
//   };

  listNotiByUser = async (req, res, next) => {
    new SuccessResponse({
      message: "list notification success",
      metadata: await listNotiByUser(req.body),
    }).send(res);
  };
}

module.exports = new NotificationController();
