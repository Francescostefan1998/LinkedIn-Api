import express from "express";
import createHttpError from "http-errors";
import UsersModel from "./model.js";
import passport from "passport";
import { JWTAuthMiddleware } from "../../lib/auth/jwtAuth.js";
import { createAccessToken } from "../../lib/auth/tools.js";

const usersRouter = express.Router();

// USERS:
// – GET https://yourapi.herokuapp.com/api/users/
usersRouter.get("/", async (req, res, next) => {
  // Retrieves list of users
  try {
    const users = await UsersModel.find();
    res.send(users);
  } catch (error) {
    next(error);
  }
});
usersRouter.get(
  "/googleLogin",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
usersRouter.get(
  "/googleRedirect",
  passport.authenticate("google", { session: false }),
  async (req, res, next) => {
    console.log(req.user);
    res.send({ accessToken: req.user.accessToken });
    // res.redirect(`${process.env.FE_URL}?accessToken=${req.user.accessToken!}`);
  }
);

usersRouter.put("/me", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const updatedUser = await UsersModel.findByIdAndUpdate(
      req.user._id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    res.send(updatedUser);
  } catch (error) {
    next(error);
  }
});
usersRouter.delete("/me", JWTAuthMiddleware, async (req, res, next) => {
  try {
    await UsersModel.findByIdAndUpdate(req.user._id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});
usersRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await UsersModel.checkCredentials(email, password);

    if (user) {
      const payload = { _id: user._id, role: user.role };

      const accessToken = await createAccessToken(payload);
      res.send({ accessToken });
    } else {
      next(createHttpError(401, "Credentials are not ok!"));
    }
  } catch (error) {
    next(error);
  }
});

// – GET https://yourapi.herokuapp.com/api/users/{userId}

// Retrieves the user with userId = {userId}
usersRouter.get("/:userId", async (req, res, next) => {
  // Retrieves list of users
  try {
    const user = await UsersModel.findById(req.params.userId);
    //We need to retrieve the id from the params
    if (user) {
      res.send(user);
    } else {
      next(createHttpError(404, `User with ID ${req.params.userId} not found`));
    }
  } catch (error) {
    next(error);
  }
});

// – POST https://yourapi.herokuapp.com/api/users/
usersRouter.post("/", async (req, res, next) => {
  // Registers a new user with all his details
  try {
    const newUser = new UsersModel(req.body);
    const { _id } = await newUser.save();
    res.status(201).send({ _id });
  } catch (error) {
    next(error);
  }
});

// – PUT https://yourapi.herokuapp.com/api/users
usersRouter.put("/:userId", async (req, res, next) => {
  // Update current user profile details
  try {
    const updatedUser = await UsersModel.findByIdAndUpdate(
      req.params.userId, //Which one you want to modify
      req.body, //How you want to modify
      { new: true, runValidators: true } //Options
    );
    if (updatedUser) {
      res.send(updatedUser);
    } else {
      next(createHttpError(404, `User with ID ${req.params.userId} not found`));
    }
  } catch (error) {
    next(error);
  }
});

// - DELETE https://yourapi.herokuapp.com/api/users
usersRouter.delete("/:userId", async (req, res, next) => {
  try {
    const deletedUser = await UsersModel.findByIdAndDelete(req.params.userId);
    if (deletedUser) {
      res.status(204).send();
    } else {
      next(createHttpError(404, `User with ID ${req.params.userId} not found`));
    }
  } catch (error) {
    next(error);
  }
});

// – POST https://yourapi.herokuapp.com/api/users/{userId}/picture

// Replace user profile picture (name = profile)

// – GET https://yourapi.herokuapp.com/api/profile/{userId}/CV

// Generates and download a PDF with the CV of the user (details, picture, experiences)

export default usersRouter;
