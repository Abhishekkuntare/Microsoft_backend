import mongoose from "mongoose";

const appSchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please enter game title"],
    minLength: [4, "Title must be at least 4 characters"],
    maxLength: [80, "Title can't be exceed 80 characters"],
  },
  description: {
    type: String,
    required: [true, "Please enter game desc"],
    minLength: [20, "Title must be at least 20 characters"],
  },

  poster: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  views: {
    type: Number,
    default: 0,
  },

  ratings: {
    type: Number,
    default: 0,
  },
  category: {
    type: String,
    required: true,
  },
  createdBy: {
    type: String,
    required: [true, "Enter Game Creator name"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Apps= mongoose.model("Apps", appSchema);
