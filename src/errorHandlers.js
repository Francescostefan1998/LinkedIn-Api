import mongoose from "mongoose";

export const badRequestErrorHandler = (err, req, res, next) => {
  if (err.status === 400) {
    res.status(400).send({ message: err.message });
  } else if (err instanceof mongoose.Error.ValidationError) {
    res.status(400).send({ message: err.message });
  } else if (err instanceof mongoose.Error.CastError) {
    res.status(400).send({
      message:
        "The ID cannot contain special characters or letters from g to z",
    });
  } else {
    next(err);
  }
};

export const notFoundErrorHandler = (err, req, res, next) => {
  if (err.status === 404) {
    res.status(404).send({ message: err.message });
  } else {
    next(err);
  }
};

export const genericErrorHandler = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({
    message: "Something bad happened on our end... but we are working on it",
  });
};
