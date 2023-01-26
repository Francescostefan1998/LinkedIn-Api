import express from "express";
import pdfkit from "pdfkit";
import UserModel from "../../users/model.js";
const pdfRouter = express.Router();

pdfRouter.get("/profile/:userName/pdf", async (req, res) => {
  try {
    console.log("pdf download triggered");
    const user = await UserModel.findOne({
      name: req.params.userName,
    }).populate({
      path: "experiences",
      select: "username role description company area startDate endDate image",
    });
    console.log(user);
    if (user) {
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=${req.params.userName}.pdf`
      );

      const doc = new pdfkit();
      doc.pipe(res);

      // Add data to PDF
      user.experiences.forEach((experience) => {
        doc.text(`Username: ${experience.username}`);
        doc.text(`Role: ${experience.role}`);
        doc.text(`Description: ${experience.description}`);
        doc.text(`Company: ${experience.company}`);
        doc.text(`Area: ${experience.area}`);
        doc.text(`Start Date: ${experience.startDate}`);
        doc.text(`End Date: ${experience.endDate}`);
        doc.text(`Image: ${experience.image}`);
        doc.moveDown();
      });

      doc.end();
    } else {
      res.status(404).send("User not found");
    }
  } catch (err) {
    res.status(500).json({ message: "Error generating PDF file", error: err });
  }
});

export default pdfRouter;
