import express from "express";
import createHttpError from "http-errors";
import postSection from "./model.js";

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
    const posts = await postSection.find()
    res.send(posts)
  } catch (error) {
    next(error);
  }
});

postRouter.get("/:postId", async (req, res, next) => {
  try {
    const post = await postSection.findById(req.params.postId)
    if(post) {
        res.send(post)
    } else {
        next(createHttpError(404, `Post not found with id ${req.params.postId}`))
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
        {new : true, runValidators:true}
    )
    if(updatePost){
        res.send(updatePost)
    } else {
        next(createHttpError(404, `Post not found with id ${req.params.postId}`))
    }
  } catch (error) {
    next(error);
  }
});

postRouter.delete("/:postId", async (req, res, next) => {
  try {
    const deletePost = await postSection.findByIdAndDelete(req.params.postId)
    if(deletePost){
        res.status(204).send()
    } else  {
        next(createHttpError(404, `Post not found with id ${req.params.postId}`))
    }
  } catch (error) {
    next(error);
  }
});

export default postRouter;
