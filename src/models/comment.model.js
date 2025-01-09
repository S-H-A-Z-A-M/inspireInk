import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    bloggedAt: {
      type: Schema.Types.ObjectId,
      ref: "Blog",
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    likedby: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    NumberofLikes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// commentSchema.plugin(mongooseAggregatePaginate);

export const Comment = mongoose.model("Comment", commentSchema);
