import Query from "../models/Query.js";

import User from "../models/User.js";
import uploadImage from "../utils/uploadImage.js";

export const createQuery = async (req, res) => {
  try {
    const { title, category, description, location } = req.body;

    if (!title?.trim() || !category || !description?.trim()) {
      return res.status(400).json({
        message: "Title, category, and description are required",
      });
    }

    const allowedCategories = [
      "disease",
      "seed",
      "soil",
      "cultivation",
      "other",
    ];

    if (!allowedCategories.includes(category)) {
      return res.status(400).json({
        message: "Invalid query category",
      });
    }

    let imageUrl = null;

    if (req.file) {
      const uploadedImage = await uploadImage(req.file.buffer);
      imageUrl = uploadedImage.url;
    }

    const query = await Query.create({
      farmer: req.user._id,
      title: title.trim(),
      category,
      description: description.trim(),
      location: {
        district: location?.district?.trim(),
        municipality: location?.municipality?.trim(),
      },
      messages: [],
      status: "pending",
      imageUrl,
    });

    return res.status(201).json({
      message: "Agricultural query submitted successfully",
      query,
    });
  } catch (error) {
    console.error("Create query error:", error.message);

    return res.status(500).json({
      message: "Unable to submit query",
    });
  }
};

export const getMyQueries = async (req, res) => {
  try {
    const queries = await Query.find({
      farmer: req.user._id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      count: queries.length,
      queries,
    });
  } catch (error) {
    console.error("Get farmer queries error:", error.message);

    return res.status(500).json({
      message: "Unable to retrieve your queries",
    });
  }
};

export const getExpertQueries = async (req, res) => {
  try {
    const filter =
      req.user.role === "admin"
        ? {}
        : {
            $or: [{ status: "pending" }, { assignedExpert: req.user._id }],
          };

    const queries = await Query.find(filter)
      .populate("farmer", "name email")
      .populate("assignedExpert", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      count: queries.length,
      queries,
    });
  } catch (error) {
    console.error("Get expert queries error:", error.message);
    return res.status(500).json({
      message: "Unable to retrieve queries",
    });
  }
};

export const assignQuery = async (req, res) => {
  try {
    const { expertId } = req.body;

    if (!expertId) {
      return res.status(400).json({
        message: "Expert ID is required",
      });
    }

    const expert = await User.findOne({
      _id: expertId,
      role: "expert",
    });

    if (!expert) {
      return res.status(404).json({
        message: "Expert account not found",
      });
    }

    const query = await Query.findById(req.params.id);

    if (!query) {
      return res.status(404).json({
        message: "Query not found",
      });
    }

    if (query.status === "closed") {
      return res.status(400).json({
        message: "A closed query cannot be assigned",
      });
    }

    query.assignedExpert = expert._id;
    query.status = "assigned";

    await query.save();

    return res.status(200).json({
      message: "Query assigned successfully",
      query,
    });
  } catch (error) {
    console.error("Assign query error:", error.message);
    return res.status(500).json({
      message: "Unable to assign query",
    });
  }
};

export const replyToQuery = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message?.trim()) {
      return res.status(400).json({
        message: "Reply message is required",
      });
    }

    const query = await Query.findById(req.params.id);

    if (!query) {
      return res.status(404).json({
        message: "Query not found",
      });
    }

    const isAdmin = req.user.role === "admin";
    const isAssignedExpert =
      req.user.role === "expert" &&
      query.assignedExpert?.toString() === req.user._id.toString();

    if (!isAdmin && !isAssignedExpert) {
      return res.status(403).json({
        message: "You are not authorized to reply to this query",
      });
    }

    if (query.status === "closed") {
      return res.status(400).json({
        message: "Cannot reply to a closed query",
      });
    }

    query.messages.push({
      sender: req.user._id,
      message: message.trim(),
    });

    query.status = "answered";

    await query.save();

    return res.status(200).json({
      message: "Reply submitted successfully",
      query,
    });
  } catch (error) {
    console.error("Reply to query error:", error.message);
    return res.status(500).json({
      message: "Unable to submit reply",
    });
  }
};

export const updateQueryStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ["assigned", "answered", "closed"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid query status",
      });
    }

    const query = await Query.findById(req.params.id);

    if (!query) {
      return res.status(404).json({
        message: "Query not found",
      });
    }

    const isAdmin = req.user.role === "admin";
    const isAssignedExpert =
      req.user.role === "expert" &&
      query.assignedExpert?.toString() === req.user._id.toString();

    if (!isAdmin && !isAssignedExpert) {
      return res.status(403).json({
        message: "You are not authorized to update this query",
      });
    }

    query.status = status;
    await query.save();

    return res.status(200).json({
      message: "Query status updated successfully",
      query,
    });
  } catch (error) {
    console.error("Update query status error:", error.message);
    return res.status(500).json({
      message: "Unable to update query status",
    });
  }
};

export const getQueryById = async (req, res) => {
  try {
    const query = await Query.findById(req.params.id)
      .populate("farmer", "name email")
      .populate("assignedExpert", "name email")
      .populate("messages.sender", "name role");

    if (!query) {
      return res.status(404).json({
        message: "Query not found",
      });
    }

    const isOwner = query.farmer._id.toString() === req.user._id.toString();

    const isAssignedExpert =
      query.assignedExpert &&
      query.assignedExpert._id.toString() === req.user._id.toString();

    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAssignedExpert && !isAdmin) {
      return res.status(403).json({
        message: "You are not authorized to view this query",
      });
    }

    return res.status(200).json({ query });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid query ID",
      });
    }

    console.error("Get query details error:", error.message);

    return res.status(500).json({
      message: "Unable to retrieve query details",
    });
  }
};

export const addFarmerFollowUp = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message?.trim()) {
      return res.status(400).json({
        message: "Follow-up message is required",
      });
    }

    if (message.trim().length > 5000) {
      return res.status(400).json({
        message: "Message cannot exceed 5000 characters",
      });
    }

    const query = await Query.findById(req.params.id);

    if (!query) {
      return res.status(404).json({
        message: "Query not found",
      });
    }

    if (query.farmer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You can only follow up on your own queries",
      });
    }

    if (query.status === "closed") {
      return res.status(400).json({
        message: "This query is closed and cannot receive follow-ups",
      });
    }

    query.messages.push({
      sender: req.user._id,
      message: message.trim(),
    });

    await query.save();

    return res.status(201).json({
      message: "Follow-up submitted successfully",
      query,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid query ID",
      });
    }

    console.error("Farmer follow-up error:", error.message);

    return res.status(500).json({
      message: "Unable to submit follow-up",
    });
  }
};
