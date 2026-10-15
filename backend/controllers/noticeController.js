import mongoose from "mongoose";
import Notice from "../models/Notice.js";
import uploadImage from "../utils/uploadImage.js";

export const getNotices = async (req, res) => {
  try {
    const notices = await Notice.find({ published: true })
      .populate("createdBy", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: notices.length,
      notices,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch notices",
    });
  }
};

export const getNoticeById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid notice ID",
      });
    }

    const notice = await Notice.findById(id).populate("createdBy", "name");

    if (!notice) {
      return res.status(404).json({
        success: false,
        message: "Notice not found",
      });
    }

    // drafts must not be visible to unauthenticated users or farmers.
    if (!notice.published && req.user?.role !== "admin") {
      return res.status(404).json({
        success: false,
        message: "Notice not found",
      });
    }

    res.status(200).json({
      success: true,
      notice,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch notice",
    });
  }
};

export const createNotice = async (req, res) => {
  try {
    const {
      title,
      content,
      category,
      location,
      trainingDate,
      registrationDeadline,
      published,
    } = req.body;

    if (!title?.trim() || !content?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Title and content are required",
      });
    }

    let imageUrl = null;

    if (req.file) {
      const uploadedImage = await uploadImage(req.file.buffer);
      imageUrl = uploadedImage.url; // 👈 matches your helper's return shape
    }

    const notice = await Notice.create({
      title: title.trim(),
      content: content.trim(),
      category,
      location,
      trainingDate: trainingDate || null,
      registrationDeadline: registrationDeadline || null,
      imageUrl, // 👈 real Cloudinary URL
      published: published === "true" || published === true,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: notice.published
        ? "Notice created"
        : "Notice created as a draft",
      notice,
    });
  } catch (error) {
    console.error("createNotice error:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || "Failed to create notice",
    });
  }
};

export const updateNotice = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid notice ID" });
    }

    const allowedFields = [
      "title",
      "content",
      "category",
      "location",
      "trainingDate",
      "registrationDeadline",
      "published",
    ];

    const updates = {};
    for (const field of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        updates[field] = req.body[field];
      }
    }

    if (updates.title !== undefined && !updates.title?.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "Title cannot be empty" });
    }
    if (updates.content !== undefined && !updates.content?.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "Content cannot be empty" });
    }

    if (updates.published !== undefined) {
      updates.published =
        updates.published === "true" || updates.published === true;
    }
    if (updates.trainingDate === "") updates.trainingDate = null;
    if (updates.registrationDeadline === "")
      updates.registrationDeadline = null;

    // 👇 new image replaces the old one
    if (req.file) {
      const uploadedImage = await uploadImage(req.file.buffer);
      updates.imageUrl = uploadedImage.url;
    }

    const notice = await Notice.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).populate("createdBy", "name");

    if (!notice) {
      return res
        .status(404)
        .json({ success: false, message: "Notice not found" });
    }

    res.status(200).json({
      success: true,
      message: "Notice updated successfully",
      notice,
    });
  } catch (error) {
    console.error("updateNotice error:", error);
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid notice data" });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteNotice = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid notice ID",
      });
    }

    const notice = await Notice.findById(id);

    if (!notice) {
      return res.status(404).json({
        success: false,
        message: "Notice not found",
      });
    }

    await notice.deleteOne();

    res.status(200).json({
      success: true,
      message: "Notice deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete notice",
    });
  }
};
