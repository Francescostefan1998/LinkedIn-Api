/*import express from "express";
import { pipeline } from "stream";
import json2csv from "json2csv";
import UserModel from "../../users/model.js";
import ExperienceModel from "../../experiences/model.js";
import { request } from "http";

const csvRouter = express.Router();

csvRouter.get("/profile/:userName/experiences/CSV", (req, res, next) => {
  try {
    console.log("csv download triggered");
    res.setHeader("Content-Disposition", "attachment; filename=books.csv");
    // SOURCE (readable stream on books.json) --> TRANSFORM (json into csv) --> DESTINATION (response)
    const source = UserModel.findOne({ name: req.params.userName });
    const transform = new json2csv.Transform({
      fields: ["category"],
    });
    const destination = res;
    pipeline(source, transform, destination, (err) => {
      if (err) console.log(err);
    });
  } catch (error) {
    next(error);
  }
});

export default csvRouter;

*/
import express from "express";
import { pipeline } from "stream";
import json2csv from "json2csv";
import UserModel from "../../users/model.js";
import ExperienceModel from "../../experiences/model.js";

const csvRouter = express.Router();

csvRouter.get("/profile/:userName/experiences/csv", async (req, res) => {
  try {
    console.log("csv download triggered");
    const user = await UserModel.findOne({
      name: req.params.userName,
    }).populate({
      path: "experiences",
      select: "role",
    });
    console.log(user);
    if (user) {
      const csv = json2csv.parse({ fields: user.name });
      res.setHeader("Content-Disposition", "attachment; filename=user.csv");
      res.set("Content-Type", "text/csv");
      res.status(200).send(csv);
    } else {
      res.status(404).send("User not found");
    }
  } catch (err) {
    res.status(500).json({ message: "Error generating CSV file", error: err });
  }
});

export default csvRouter;
