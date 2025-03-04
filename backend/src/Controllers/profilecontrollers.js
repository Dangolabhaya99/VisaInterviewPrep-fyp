const domain = "http://localhost:4000";
const UserProfiles = require("../Models/userProfile");
// Helper function to send error responses
const sendErrorResponse = (res, error, status = 500) => {
  console.error(error); // Log the error for debugging
  res.status(status).json({ msg: error.message || "An unexpected error occurred" });
};

// Update user profile as it is created during registration
const updateUserProfile = async (req, res) => {
  try {
    const { bio } = req.body;
    if (!bio) {
      return res.status(400).json({ msg: "Bio is required" });
    }

    let updateData = { bio };

    if (req.file) {
      const profileImage = `${domain}/uploads/profiles/${req.file.filename}`;
      updateData.profileImage = profileImage;
    }

    const profile = await UserProfiles.findOneAndUpdate(
      { user: req.user.id },
      updateData,
      { new: true, runValidators: true }
    );

    if (!profile) {
      return res.status(404).json({ msg: "Profile not found" });
    }

    res.status(200).json({ profile });
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const profile = await UserProfiles.findOne({ user: req.user.id }).populate(
      "user",
      ["name", "email", "phone", "address"]
    );
    if (!profile) {
      return res.status(404).json({ msg: "Profile not found" });
    }
    res.status(200).json({ profile });
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

// Get all user profiles
const getAllUserProfiles = async (req, res) => {
  try {
    const profiles = await UserProfiles.find().populate("user", [
      "name",
      "email",
      "phone",
      "address"
    ]);
    res.status(200).json({ profiles });
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

// Get user profile by ID
const getUserProfileById = async (req, res) => {
  try {
    const profile = await UserProfiles.findOne({
      user: req.params.id,
    }).populate("user", ["name", "email", "phone", "address"]);
    if (!profile) {
      return res.status(404).json({ msg: "Profile not found" });
    }
    res.status(200).json({ profile });
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

// Delete user profile
const deleteUserProfile = async (req, res) => {
  try {
    const profile = await UserProfiles.findOneAndDelete({ user: req.user._id });
    if (!profile) {
      return res.status(404).json({ msg: "Profile not found" });
    }
    res.status(200).json({ msg: "Profile deleted successfully" });
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

// Exporting the controller functions
module.exports = {
  updateUserProfile,
  getUserProfile,
  getAllUserProfiles,
  getUserProfileById,
  deleteUserProfile,
};
