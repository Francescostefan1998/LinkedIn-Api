import mongoose from "mongoose";

const { Schema, model } = mongoose;

const experienceSchema = new Schema(
  {
    role: { type: String, required: true },
    company: { type: String, required: true },
    startDate: { type: String, required: true },
    endDate: { type: String },
    description: { type: String, required: true },
    area: { type: String, required: true },
    image: { type: String },
    user: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

experienceSchema.static("findExperiencesWithUsers", async function (query) {
  const total = await this.countDocuments(query.criteria);
  const experiences = await this.find(query.criteria, query.criteria.fields)
    .limit(query.options.limit)
    .skip(query.options.skip)
    .sort(query.options.sort);

  return { total, experiences };
});

export default model("Experience", experienceSchema);
