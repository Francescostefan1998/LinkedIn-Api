import express from "express";
import createHttpError from "http-errors";
import postSection from "./model.js";
import commentModel from "./commentModel.js";
import likeModel from "./likeModel.js";

const postRouter = express.Router();

postRouter.post("/", async (req, res, next) => {
  try {
    const userPost = new postSection(req.body);
    const { _id } = await userPost.save();
    res.status(200).send({ _id });
    console.log("Post runnnig");
  } catch (error) {
    next(error);
  }
});

postRouter.get("/", async (req, res, next) => {
  try {
    const posts = await postSection.find();
    res.send(posts);
  } catch (error) {
    next(error);
  }
});

postRouter.get("/:postId", async (req, res, next) => {
  try {
    const post = await postSection.findById(req.params.postId);
    if (post) {
      res.send(post);
    } else {
      next(createHttpError(404, `Post not found with id ${req.params.postId}`));
    }
  } catch (error) {
    next(error);
  }
});

postRouter.put("/:postId", async (req, res, next) => {
  try {
    const updatePost = await postSection.findByIdAndUpdate(
      req.params.postId,
      req.body,
      { new: true, runValidators: true }
    );
    if (updatePost) {
      res.send(updatePost);
    } else {
      next(createHttpError(404, `Post not found with id ${req.params.postId}`));
    }
  } catch (error) {
    next(error);
  }
});

postRouter.delete("/:postId", async (req, res, next) => {
  try {
    const deletePost = await postSection.findByIdAndDelete(req.params.postId);
    if (deletePost) {
      res.status(204).send();
    } else {
      next(createHttpError(404, `Post not found with id ${req.params.postId}`));
    }
  } catch (error) {
    next(error);
  }
});

postRouter.post("/:postId/like", async (req, res, next) => {
  try {
    const newLike = await likeModel(req.body);
    const _id = await newLike.save();

    const updatePost = await postSection.findByIdAndUpdate(
      req.params.postId,
      { $push: { likes: _id.username } },
      { new: true }
    );
    if (updatePost) {
      res.send(updatePost);
    } else {
      next(
        createHttpError(
          404,
          `Post not found with id ${req.params.postId} not found`
        )
      );
    }
  } catch (error) {
    next(error);
  }
  console.log(req.body);
});
postRouter.delete("/:postId/like", async (req, res, next) => {
  try {
    console.log("delete triggered");
    const { _id } = await likeModel.findOne({
      username: req.body.username,
      post: req.body.post,
    });
    console.log(_id);
    if (_id) {
      const updatePost = await postSection.findByIdAndUpdate(
        req.params.postId,
        { $pull: { likes: _id } },
        { new: true }
      );
      const deletedProduct = await likeModel.findByIdAndDelete(
        _id._id.toString()
      );
      if (updatePost) {
        res.send(updatePost);
      } else {
        next(
          createHttpError(
            404,
            `Post not found with id ${req.params.postId} not found`
          )
        );
      }
    } else {
      next(
        createHttpError(
          404,
          `Post not found with id ${req.params.postId} not found`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});
postRouter.post("/:postId/comments", async (req, res, next) => {
  try {
    const newComment = await commentModel(req.body);
    const { _id } = await newComment.save();

    const updatePost = await postSection.findByIdAndUpdate(
      req.params.postId,
      { $push: { comments: _id } },
      { new: true }
    );
    if (updatePost) {
      res.send(updatePost);
    } else {
      next(
        createHttpError(
          404,
          `Post not found with id ${req.params.postId} not found`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});
postRouter.get("/:postId/comments", async (req, res, next) => {
  try {
    const post = await postSection.findById(req.params.postId);
    if (post) {
      res.send(post.comments);
    } else {
      next(
        createHttpError(
          404,
          `Post not found with id ${req.params.postId} not found`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});
postRouter.get("/:postId/comments/:commentId", async (req, res, next) => {
  try {
    const post = await postSection.findById(req.params.postId);
    if (post) {
      const comment = await commentModel.findById(req.params.commentId);
      if (comment) {
        res.send(comment);
      } else {
        next(
          createHttpError(
            404,
            `Comment not found with id ${req.params.commentId} not found`
          )
        );
      }
    } else {
      next(
        createHttpError(
          404,
          `Post not found with id ${req.params.postId} not found`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});
postRouter.put("/:postId/comments/:commentId", async (req, res, next) => {
  try {
    const post = await postSection.findById(req.params.postId);
    if (post) {
      const comment = await commentModel.findByIdAndUpdate(
        req.params.commentId,
        req.body,
        { new: true, runValidators: true }
      );
      if (comment) {
        res.send(comment);
      } else {
        next(
          createHttpError(
            404,
            `Comment not found with id ${req.params.commentId} not found`
          )
        );
      }
    } else {
      next(
        createHttpError(
          404,
          `Post not found with id ${req.params.postId} not found`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});
postRouter.delete("/:postId/comments/:commentId", async (req, res, next) => {
  try {
    const post = await postSection.findById(req.params.postId);
    if (post) {
      const comment = await commentModel.findByIdAndDelete(
        req.params.commentId
      );
      if (comment) {
        const updatePost = await postSection.findByIdAndUpdate(
          req.params.postId,
          { $pull: { comments: comment._id } },
          { new: true }
        );
        res.send(updatePost);
      } else {
        next(
          createHttpError(
            404,
            `Comment not found with id ${req.params.commentId} not found`
          )
        );
      }
    } else {
      next(
        createHttpError(
          404,
          `Post not found with id ${req.params.postId} not found`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

export default postRouter;
