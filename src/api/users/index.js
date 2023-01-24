import express from "express";
import createHttpError from "http-errors";
import UsersModel from "./model.js";

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
    const updatedUser = await UserssModel.findByIdAndUpdate(
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

// – POST https://yourapi.herokuapp.com/api/users/{userId}/picture

// Replace user profile picture (name = profile)

// – GET https://yourapi.herokuapp.com/api/profile/{userId}/CV

// Generates and download a PDF with the CV of the user (details, picture, experiences)
