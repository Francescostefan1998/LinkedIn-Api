import { checkSchema, validationResult } from "express-validator";
import UsersModel from "./model.js";

//https://express-validator.github.io/docs/6.2.0/custom-validators-sanitizers

// const checkUsername = async ( newUsername ) => {
//     const user = await UsersModel.findOne({username: newUsername})
//     if (!user) {
//         return newUsername
//     } else {
//         next(createHttpError(404, `Username is already taken, please choose a different one`));
//     }
// }

const usersSchema = {
  name: {
    in: ["body"],
    isString: {
      errorMessage: "Name validation failed, type must be string",
    },
  },
  surname: {
    in: ["body"],
    isString: {
      errorMessage: "Name validation failed, type must be string",
    },
  },
  email: {
    in: ["body"],
    isEmail: {
      errorMessage:
        "Email validation failed, please check the spelling of the email",
    },
  },

  username: {
    in: ["body"],
    isString: {
      errorMessage: "Name validation failed, type must be string",
    },
    // checkValidationResult(username)
  },

  //   .custom(async (email) => {
  //     const existingUser =
  //         await repo.getOneBy({ email })
  //     if (existingUser) {
  //         throw new Error('Email already in use')
  //     }

  // email: { type: String, required: true, unique: true },
  // bio: { type: String, required: true },
  // title: { type: String, required: true },
  // area: { type: String, required: true },
  // image: { type: String, required: true },
  // username: { type: String, required: true, unique: true },
  // experiences:
};

export const checkUsersSchema = checkSchema(usersSchema);

export const checkValidationResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Blog post validation is failed");
    error.status = 400;
    error.errors = errors.array();
    next(error);
  }
  next();
};
