import mongoose from "mongoose";

const noticeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Notice title is required"],
      trim: true,
      maxlength: 200,
    },

    content: {
      type: String,
      required: [true, "Notice content is required"],
      trim: true,
      maxlength: 10000,
    },

    category: {
      type: String,
      enum: ["training", "advisory", "event", "general"],
      default: "general",
      required: true,
    },

    location: {
      type: String,
      trim: true,
      maxlength: 200,
      default: "",
    },

    trainingDate: {
      type: Date,
      default: null,
    },

    registrationDeadline: {
      type: Date,
      default: null,
    },

    imageUrl: {
      type: String,
      default: null,
    },

    published: {
      type: Boolean,
      default: false,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Notice = mongoose.model("Notice", noticeSchema);

export default Notice;
