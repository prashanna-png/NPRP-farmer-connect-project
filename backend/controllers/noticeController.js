import mongoose from "mongoose";
import Notice from "../models/Notice.js";

// @desc    get all published notices
// @route   GET /api/notices
// @access  public
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

// @desc    get a single notice
// @route   GET /api/notices/:id
// @access  public for published notices; admin can view drafts
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

// @desc    create a notice
// @route   POST /api/notices
// @access  admin
export const createNotice = async (req, res) => {
  try {
    const {
      title,
      content,
      category,
      location,
      trainingDate,
      registrationDeadline,
      imageUrl,
    } = req.body;

    if (!title?.trim() || !content?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Title and content are required",
      });
    }

    const notice = await Notice.create({
      title,
      content,
      category,
      location,
      trainingDate: trainingDate || null,
      registrationDeadline: registrationDeadline || null,
      imageUrl: imageUrl || null,
      published: false,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Notice created as a draft",
      notice,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to create notice",
    });
  }
};

// @desc    Update a notice
// @route   PATCH /api/notices/:id
// @access  Admin
export const updateNotice = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid notice ID",
      });
    }

    const allowedFields = [
      "title",
      "content",
      "category",
      "location",
      "trainingDate",
      "registrationDeadline",
      "imageUrl",
      "published",
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        updates[field] = req.body[field];
      }
    }

    if (updates.title !== undefined && !updates.title?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Title cannot be empty",
      });
    }

    if (updates.content !== undefined && !updates.content?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Content cannot be empty",
      });
    }

    if (updates.trainingDate === "") updates.trainingDate = null;
    if (updates.registrationDeadline === "") {
      updates.registrationDeadline = null;
    }

    const notice = await Notice.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).populate("createdBy", "name");

    if (!notice) {
      return res.status(404).json({
        success: false,
        message: "Notice not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Notice updated successfully",
      notice,
    });
  } catch (error) {
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid notice data",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update notice",
    });
  }
};

// @desc    delete a notice
// @route   dELETE /api/notices/:id
// @access  admin
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
