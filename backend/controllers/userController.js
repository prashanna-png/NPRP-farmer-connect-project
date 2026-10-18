import User from "../models/User.js";

export const getExperts = async (req, res) => {
  try {
    const experts = await User.find({ role: "expert" })
      .select("_id name email")
      .sort({ name: 1 });

    return res.status(200).json({
      count: experts.length,
      experts,
    });
  } catch (error) {
    console.error("Get experts error:", error.message);

    return res.status(500).json({
      message: "Unable to retrieve experts",
    });
  }
};
