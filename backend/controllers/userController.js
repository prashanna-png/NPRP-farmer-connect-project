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

export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;
    
    if (req.body.location) {
      user.location = {
        district: req.body.location.district || user.location?.district,
        municipality: req.body.location.municipality || user.location?.municipality,
        ward: req.body.location.ward || user.location?.ward,
      };
    }

    const updatedUser = await user.save();

    res.status(200).json({
      message: "Profile updated",
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        phone: updatedUser.phone,
        location: updatedUser.location,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error.message);
    res.status(500).json({ message: "Server error updating profile" });
  }
};

export const updateUserPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    const user = await User.findById(req.user._id).select("+password");

    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect current password" });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }

    user.password = newPassword;
    await user.save(); 

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Update password error:", error.message);
    res.status(500).json({ message: "Server error updating password" });
  }
};
