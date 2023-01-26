import { model, Schema } from "mongoose";

const postSection = new Schema(
  {
    text: { type: String, required: true },
    username: { type: String, required: true },
    image: { type: String, required: true },
    likes: [{ type: Schema.Types.ObjectId, ref: "Like" }],
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],

    users: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);
postSection.static("findPostsWithQuery", async function (query) {
  const total = await this.countDocuments(query.criteria);
  const experiences = await this.find(query.criteria, query.criteria.fields)
    .limit(query.options.limit)
    .skip(query.options.skip)
    .sort(query.options.sort);

  return { total, experiences };
});

export default model("posts", postSection);
