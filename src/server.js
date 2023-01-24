import express from "express";
import listEndpoints from "express-list-endpoints";
import cors from "cors";
import mongoose from "mongoose";
import usersRouter from "./api/users/index.js";
import experienceRouter from "./api/experiences/index.js";
import {
  badRequestErrorHandler,
  notFoundErrorHandler,
  genericErrorHandler,
} from "./errorHandlers.js";
import csvRouter from "./api/experiences/csv/index.js";
const server = express();
const port = process.env.PORT || 3001;

//Middlewares
server.use(cors());
server.use(express.json());

//Endpoints
server.use("/users", usersRouter);
server.use("/users", experienceRouter);
server.use("/", csvRouter);

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
