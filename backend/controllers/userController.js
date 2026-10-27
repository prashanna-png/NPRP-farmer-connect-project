import User from "../models/User.js";
import uploadImage from "../utils/uploadImage.js";

export const getExperts = async (req, res) => {
  try {
    const experts = await User.find({ role: "expert" })
      .select("_id name email profilePicture")
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

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (typeof req.body.name === "string" && req.body.name.trim()) {
      user.name = req.body.name.trim();
    }

    if (typeof req.body.phone === "string") {
      user.phone = req.body.phone.trim();
    }

    if (req.body.location) {
      user.location = {
        district: req.body.location.district ?? user.location?.district,
        municipality:
          req.body.location.municipality ?? user.location?.municipality,
        ward: req.body.location.ward ?? user.location?.ward,
      };
    }

    const updatedUser = await user.save();

    return res.status(200).json({
      message: "Profile updated",
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        phone: updatedUser.phone,
        location: updatedUser.location,
        profilePicture: updatedUser.profilePicture || "",
      },
    });
  } catch (error) {
    console.error("Update profile error:", error.message);

    return res.status(500).json({
      message: "Server error updating profile",
    });
  }
};

export const updateProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Please select a profile picture",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const uploadedImage = await uploadImage(
      req.file.buffer,
      "nprp-farmer-connect/profiles",
    );

    user.profilePicture = uploadedImage.url;

    await user.save();

    return res.status(200).json({
      message: "Profile picture updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        location: user.location,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    console.error("Update profile picture error:", error.message);

    return res.status(500).json({
      message: "Unable to update profile picture",
    });
  }
};

export const updateUserPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Current password and new password are required",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters",
      });
    }

    const user = await User.findById(req.user._id).select("+password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(401).json({
        message: "Incorrect current password",
      });
    }

    user.password = newPassword;

    await user.save();

    return res.status(200).json({
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Update password error:", error.message);

    return res.status(500).json({
      message: "Server error updating password",
    });
  }
};
