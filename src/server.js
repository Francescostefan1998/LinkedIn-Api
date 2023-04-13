import express from "express";
import listEndpoints from "express-list-endpoints";
import cors from "cors";
import mongoose from "mongoose";
import fileUserRouter from "./api/users/file/index.js";
import usersRouter from "./api/users/index.js";
import experienceRouter from "./api/experiences/index.js";
import fileExperienceRouter from "./api/experiences/file/index.js";
import {
  badRequestErrorHandler,
  notFoundErrorHandler,
  genericErrorHandler,
} from "./errorHandlers.js";
import csvRouter from "./api/experiences/csv/index.js";
import filePostRouter from "./api/posts/file/index.js";
import postRouter from "./api/posts/index.js";
import pdfRouter from "./api/users/pdf/index.js";
import googleStrategy from "./lib/auth/google.js";
import passport from "passport";

passport.use("google", googleStrategy);
const server = express();

const port = process.env.PORT || 3001;
const mongoConnectionString = process.env.MONGO_CONNECTION_STRING;
console.log(mongoConnectionString);
const whitelist = [process.env.FE_DEV_URL, process.env.FE_PROD_URL];

const corsOpts = {
  origin: (origin, corsNext) => {
    console.log(origin);
    if (whitelist.indexOf(origin) !== -1) {
      corsNext(null, true);
    } else {
      corsNext(new Error("Not allowed by CORS"));
    }
  },
};

//Middlewares
server.use("/users", pdfRouter);

server.use(cors());
server.use(express.json());
//bbbb
//Endpoints
server.use("/users", usersRouter);
server.use("/users", experienceRouter);

server.use("/posts", postRouter);
server.use("/posts", filePostRouter);

server.use("/users", fileUserRouter);

server.use("/", csvRouter);
server.use("/", fileExperienceRouter);

//ErrorHandlers
server.use(badRequestErrorHandler);
server.use(notFoundErrorHandler);
server.use(genericErrorHandler);

mongoose.set("strictQuery", false);

mongoose.connect(process.env.MONGO_CONNECTION_STRING);

mongoose.connection.on("connected", () => {
  console.log(`Connected to Mongo`);
  server.listen(port, () => {
    console.table(listEndpoints(server));
    console.log(`Server running on Port: ${port}`);
  });
});
