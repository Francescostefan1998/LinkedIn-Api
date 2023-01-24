import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import UserModel from "../../users/model.js";
import ExperienceModel from "../../experiences/model.js";
import createHttpError from "http-errors";

const fileExperienceRouter = express.Router();

const cloudUploader = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "experiences",
    },
  }),
}).single("image");
/*
fileExperienceRouter.post(
  "/profile/:userName/experiences/:expId/picture",
  cloudUploader,
  async (req, res, next) => {
    try {
      const user = await UserModel.findOne(
        (user) => user.name === req.params.userName
      );
      if (user) {
        console.log(user);
        const experience = user.experiences.findOne(
          (exp) => exp._id.toString() === req.params.expId
        );
        if (experience) {
          const updatedProduct = await ExperienceModel.findByIdAndUpdate(
            req.params.expId,
            { image: req.file.path },

            { new: true, runValidators: true }
          );
          res.send(updatedProduct);
        } else {
          next(
            createHttpError(
              404`Expirience with id ${req.params.expId} not found from user named ${req.params.userName}`
            )
          );
        }
      } else {
        next(createHttpError(404`userName  ${req.params.userName} not found `));
      }
    } catch (error) {
      next(error);
    }
  }
);

export default fileExperienceRouter;*/
fileExperienceRouter.post(
  "/profile/:userName/experiences/:expId/picture",
  cloudUploader,
  async (req, res, next) => {
    try {
      const user = await UserModel.findOne({ name: req.params.userName });
      if (user) {
        console.log(user);
        const experience = user.experiences.find((exp) =>
          exp._id.equals(req.params.expId)
        );
        if (experience) {
          const updatedProduct = await ExperienceModel.findByIdAndUpdate(
            req.params.expId,
            { image: req.file.path },
            { new: true, runValidators: true }
          );
          res.send(updatedProduct);
        } else {
          next(
            createHttpError(
              404,
              `Expirience with id ${req.params.expId} not found from user named ${req.params.userName}`
            )
          );
        }
      } else {
        next(
          createHttpError(404, `userName  ${req.params.userName} not found `)
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

export default fileExperienceRouter;
