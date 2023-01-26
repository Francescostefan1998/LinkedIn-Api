import mongoose from "mongoose";

const { Schema, model } = mongoose;

const commentSchema = new Schema(
  {
    post: { type: Schema.Types.ObjectId, ref: "Post" },
    comment: { type: String, required: true },

    username: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

commentSchema.static("findComments", async function (query) {
  const total = await this.countDocuments(query.criteria);
  const experiences = await this.find(query.criteria, query.criteria.fields)
    .limit(query.options.limit)
    .skip(query.options.skip)
    .sort(query.options.sort);

  return { total, experiences };
});

export default model("Comment", commentSchema);
