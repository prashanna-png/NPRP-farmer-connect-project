import Query from "../models/Query.js";

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
