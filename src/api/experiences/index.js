import express from "express";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import q2m from "query-to-mongo";
import ExperienceModel from "./model.js";
import UserModel from "../users/model.js";
const experienceRouter = express.Router();

experienceRouter.post("/:userId/experiences", async (req, res, next) => {
  try {
    const newExperience = await ExperienceModel(req.body);
    const { _id } = await newExperience.save();
    const updatedUser = await UserModel.findByIdAndUpdate(
      req.params.userId,
      { $push: { experiences: _id } },
      { new: true }
    );
    if (updatedUser) {
      res.send(newExperience);
    } else {
      next(createHttpError(404, `User with id ${req.params.userId} not found`));
    }
  } catch (error) {
    next(error);
  }
});
experienceRouter.get("/:userId/experiences", async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.params.userId).populate({
      path: "experiences",
      select: "role company startDate endDate description area image",
    });
    if (user) {
      res.send(user.experiences);
    } else {
      next(createHttpError(404, `User with id ${req.params.userId} not found`));
    }
  } catch (error) {
    next(error);
  }
});
experienceRouter.get("/:userId/experiences/:expId", async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.params.userId);
    if (user) {
      const experience = user.experiences.find(
        (experience) => experience._id.toString() === req.params.expId
      );
      console.log(user);
      console.log(user.experiences);
      console.log(experience);
      if (experience) {
        const experienceSelected = await ExperienceModel.findById(
          req.params.expId
        );
        res.send(experienceSelected);
      } else {
        next(
          createHttpError(
            404,
            `Experience with id ${req.params.expId} not found in user ${req.params.userId}`
          )
        );
      }
    } else {
      next(createHttpError(404, `User with id ${req.params.userId} not found`));
    }
  } catch (error) {
    next(error);
  }
});
experienceRouter.put("/:userId/experiences/:expId", async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.params.userId);
    if (user) {
      console.log(user);
      const index = user.experiences.findIndex(
        (experience) => experience._id.toString() === req.params.expId
      );
      console.log(index);
      console.log(user.experiences[index]._id);
      console.log(user.experiences[index]._id.toString());

      const updatedExperience = await ExperienceModel.findByIdAndUpdate(
        req.params.expId,
        req.body,
        { new: true, runValidators: true }
      );
      if (updatedExperience) {
        res.send(updatedExperience);
      } else {
        next(
          createHttpError(`experience with id ${req.params.expId} not found`)
        );
      }
    } else {
      next(createHttpError(404, `User with id ${req.params.expId} not found`));
    }
  } catch (error) {
    next(error);
  }
});
experienceRouter.delete(
  "/:userId/experiences/:expId",
  async (req, res, next) => {
    try {
      const user = await UserModel.findById(req.params.userId);
      if (user) {
        const remainingExperiences = user.experiences.filter(
          (experience) => experience._id.toString() !== req.params.expId
        );
        user.experiences = remainingExperiences;
        if (user) {
          res.status(202).send("deleted");
          user.save();
        } else {
          next(
            createHttpError(`experience with id ${req.params.expId} not found`)
          );
        }
      } else {
        next(
          createHttpError(404, `User with id ${req.params.userId} not found`)
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

export default experienceRouter;
