/*import express from "express";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import createHttpError from "http-errors";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const fileUserRouter = express.Router();

const cloudinaryUploader = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "users",
    },
  }),
}).single("picture");

// – POST https://yourapi.herokuapp.com/api/users/{userId}/picture
fileUserRouter.post(
  "users/:userId/picture",
  cloudinaryUploader,
  async (req, res, next) => {
    try {
      const index = users.findIndex((user) => user.id === req.params.userId);
      if (index !== -1) {
        const oldUser = users[index];
        const updatedUser = { ...oldUser, updatedAt: new Date() };
        users[index] = updatedUser;

        await writeUsers(users);
        res.send("Profile picture updated");
      } else {
        next(
          createHttpError(404, `User with ID ${req.params.userId} not found`)
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

export default fileUserRouter;*/

// filesRouter.get("/pdf", async (req, res, next) => {
//     res.setHeader("Content-Disposition", "attachment; filename=test.pdf")

//     const books = await getBooks()
//     const source = getPDFReadableStream(books)
//     const destination = res
//     pipeline(source, destination, err => {
//       if (err) console.log(err)
//     })
//   })

import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import UserModel from "../../users/model.js";
import createHttpError from "http-errors";

const fileUserRouter = express.Router();

const cloudUploader = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "users-s",
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
fileUserRouter.post(
  "/:userId/picture",

  cloudUploader,
  async (req, res, next) => {
    try {
      const user = await UserModel.findById(req.params.userId);

      if (user) {
        console.log(user);
        const updatedUser = await UserModel.findByIdAndUpdate(
          req.params.userId,
          { image: req.file.path },
          { new: true, runValidators: true }
        );
        res.send(updatedUser);
      } else {
        next(createHttpError(404, `userName  ${req.params.userId} not found `));
      }
    } catch (error) {
      next(error);
    }
  }
);

export default fileUserRouter;
