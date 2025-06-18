"use strict";

const { SuccessResponse } = require("../core/success.response");
const {
  createComment,
  getCommentsByParentId,
  deleteCommentById,
} = require("../services/comment.service");

class CommentController {
  createComment = async (req, res, next) => {
    new SuccessResponse({
      message: "create new comment",
      metadata: await createComment(req.body),
    }).send(res);
  };

  getCommentsByParentId = async (req, res, next) => {
    new SuccessResponse({
      message: "get comments success",
      metadata: await getCommentsByParentId(req.body),
    }).send(res);
  };

  deleteCommentById = async (req, res, next) => {
    new SuccessResponse({
      message: "delete comments success",
      metadata: await deleteCommentById(req.body),
    }).send(res);
  };
}

module.exports = new CommentController();
