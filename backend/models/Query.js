import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },
    sentAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true },
);

const querySchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    assignedExpert: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },
    category: {
      type: String,
      enum: ["disease", "seed", "soil", "cultivation", "other"],
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },
    location: {
      district: String,
      municipality: String,
    },
    imageUrl: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ["pending", "assigned", "answered", "closed"],
      default: "pending",
      index: true,
    },
    messages: {
      type: [messageSchema],
      default: [],
    },
  },
  { timestamps: true },
);

const Query = mongoose.model("Query", querySchema);

export default Query;
