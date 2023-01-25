/*import express from "express";
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
      const fields = ["role", "description"];
      const data = user.experiences.map((experience) => {
        return {
          role: experience.role,
          description: experience.description,
        };
      });
      const csv = json2csv.parse({ fields, data });
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


*/
import express from "express";
import csv from "fast-csv";
import UserModel from "../../users/model.js";

const csvRouter = express.Router();

csvRouter.get("/profile/:userName/experiences/csv", async (req, res) => {
  try {
    console.log("csv download triggered");
    const user = await UserModel.findOne({
      name: req.params.userName,
    }).populate({
      path: "experiences",
      select: "username role description company area startDate endDate image",
    });
    console.log(user);
    if (user) {
      const fields = [
        "username",

        "role",
        "description",
        "company",
        "area",
        "startDate",
        "endDate",
        "image",
      ];

      const data = user.experiences;
      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=${req.params.userName}.csv`
      );
      csv.write(data, { headers: fields }).pipe(res);
    } else {
      res.status(404).send("User not found");
    }
  } catch (err) {
    res.status(500).json({ message: "Error generating CSV file", error: err });
  }
});

export default csvRouter;
