import express from "express";
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

export default fileUserRouter;

// filesRouter.get("/pdf", async (req, res, next) => {
//     res.setHeader("Content-Disposition", "attachment; filename=test.pdf")

//     const books = await getBooks()
//     const source = getPDFReadableStream(books)
//     const destination = res
//     pipeline(source, destination, err => {
//       if (err) console.log(err)
//     })
//   })
