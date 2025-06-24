"use strict";

const notiModel = require("../models/notification.model");
const { convertToObjectId } = require("../utils");

const pushNotiToSystem = async ({
  type = "SHOP-001",
  receivedId = 1,
  senderId = 1,
  options = {},
}) => {
  let noti_content;

  if (type === "SHOP-001") {
    noti_content = `@@@ vừa mới thêm một sản phẩm: @@@`;
  } else {
    noti_content = `@@@ vừa mới thêm một vocher: @@@@@`;
  }

  const newNoti = await notiModel.create({
    noti_type: type,
    noti_senderId: senderId,
    noti_receivedId: receivedId,
    noti_content,
    noti_options: options,
  });

  return newNoti;
};

const listNotiByUser = async ({ userId = "1", type = "ALL", isRead = 0 }) => {
  const match = {
    noti_receivedId: userId,
  };

  console.log(match);

  if (type !== "ALL") {
    match["noti_type"] = type;
  }

  return await notiModel.aggregate([
    { $match: match },
    {
      $project: {
        noti_type: 1,
        noti_senderId: 1,
        noti_receivedId: 1,
        noti_content: {
          $concat: [
            { $toString: "$noti_options.shop_name" },
            " vừa thêm một sản phẩm mới: ",
            { $toString: "$noti_options.product_name" },
          ],
        },
        noti_options: 1,
        createAt: 1,
      },
    },
  ]);
};

module.exports = {
  pushNotiToSystem,
  listNotiByUser,
};
