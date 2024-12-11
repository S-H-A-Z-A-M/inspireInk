// CRUD only for blog
import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    coverImage: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    likeBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    commentedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt fields
  }
);

blogSchema.plugin(mongooseAggregatePaginate);

export const Blog = mongoose.model("Blog", blogSchema);
