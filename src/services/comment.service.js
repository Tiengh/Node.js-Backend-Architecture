"use strict";

const { BadRequestError, NotFoundError } = require("../core/error.response");
const Comment = require("../models/comment.model");
const { convertToObjectId } = require("../utils");
const { findProduct } = require("./product.service");

class CommentService {
  static async createComment({
    productId,
    userId,
    content,
    parentCommentId = null,
  }) {
    const comment = new Comment({
      comment_productId: productId,
      comment_userId: userId,
      comment_content: content,
      comment_parentId: parentCommentId,
    });

    let rightValue;
    if (parentCommentId) {
      const parentComment = await Comment.findById(
        convertToObjectId(parentCommentId)
      );
      if (!parentComment) {
        throw new NotFoundError(`ParentComment not exits!`);
      } else {
        rightValue = parentComment.comment_right;
        await Comment.updateMany(
          {
            comment_productId: convertToObjectId(productId),
            comment_right: { $gte: rightValue },
          },
          {
            $inc: { comment_right: 2 },
          }
        );
        await Comment.updateMany(
          {
            comment_productId: convertToObjectId(productId),
            comment_left: { $gt: rightValue },
          },
          {
            $inc: { comment_left: 2 },
          }
        );
      }
    } else {
      const maxRight = await Comment.findOne(
        {
          comment_productId: convertToObjectId(productId),
        },
        "comment_right",
        { sort: { comment_right: -1 } }
      );

      if (maxRight) {
        rightValue = maxRight.comment_right + 1;
      } else {
        rightValue = 1;
      }
    }

    comment.comment_left = rightValue;
    comment.comment_right = rightValue + 1;

    await comment.save();
    return comment;
  }

  static async getCommentsByParentId({
    productId,
    parentCommentId = null,
    limit = 50,
    offset = 0, //skip
  }) {
    if (parentCommentId) {
      const parent = await Comment.findById(parentCommentId);
      if (!parent) throw new NotFoundError(`Parent comment not exits!`);

      const comments = await Comment.find({
        comment_productId: convertToObjectId(productId),
        comment_left: { $gt: parent.comment_left },
        comment_right: { $lt: parent.comment_right },
      })
        .select({
          comment_left: 1,
          comment_right: 1,
          comment_content: 1,
          comment_parentId: 1,
        })
        .sort({ comment_left: 1 });

      return comments;
    }

    const comments = await Comment.find({
      comment_productId: convertToObjectId(productId),
      comment_parentId: null,
    })
      .select({
        comment_left: 1,
        comment_right: 1,
        comment_content: 1,
        comment_parentId: 1,
      })
      .sort({ comment_left: 1 });

    return comments;
  }

  static async deleteCommentById({ commentId, productId }) {
    const foundProduct = await findProduct({
      product_id: productId,
    });

    if (!foundProduct) throw new NotFoundError(`Product not exist!`);

    const foundComment = await Comment.findById(commentId);

    if (!foundComment) throw new NotFoundError(`Comment not exist!`);

    const left = foundComment.comment_left;
    const right = foundComment.comment_right;
    const width = right - left + 1;

    await Comment.deleteMany({
      comment_productId: convertToObjectId(productId),
      comment_left: { $gte: left },
      comment_right: { $lte: right },
    });

    await Comment.updateMany(
      {
        comment_productId: convertToObjectId(productId),
        comment_left: { $gt: right },
      },
      { $inc: { comment_left: -width } }
    );

    await Comment.updateMany(
      {
        comment_productId: convertToObjectId(productId),
        comment_right: { $gt: right },
      },
      { $inc: { comment_right: -width } }
    );

    return true;
  }
}

module.exports = CommentService;
