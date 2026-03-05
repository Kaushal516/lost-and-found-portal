import User from "../models/User.js";
import bcrypt from "bcryptjs";
import DeletionRequest from "../models/DeletionRequest.js";

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (user) {
            // Check if user has a pending deletion request
            const pendingRequest = await DeletionRequest.findOne({ user: user._id, status: "pending" });

            res.json({
                ...user.toObject(),
                deletionPending: !!pendingRequest
            });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (user) {
            user.firstName = req.body.firstName || user.firstName;
            user.lastName = req.body.lastName || user.lastName;
            user.username = req.body.username || user.username;

            if (req.body.profileImg !== undefined) {
                user.profileImg = req.body.profileImg;
            }

            if (req.body.settings) {
                user.settings = { ...user.settings, ...req.body.settings };
            }

            // Check username uniqueness if changed
            if (req.body.username && req.body.username !== user.username) {
                const existing = await User.findOne({ username: req.body.username });
                if (existing) {
                    return res.status(400).json({ message: "Username already taken" });
                }
            }

            const updatedUser = await user.save();

            res.json({
                id: updatedUser._id,
                firstName: updatedUser.firstName,
                lastName: updatedUser.lastName,
                username: updatedUser.username,
                email: updatedUser.email,
                profileImg: updatedUser.profileImg,
                settings: updatedUser.settings
            });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Request account deletion
// @route   POST /api/users/profile/deletion-request
// @access  Private
export const requestDeletion = async (req, res) => {
    try {
        const existing = await DeletionRequest.findOne({ user: req.user.id, status: "pending" });
        if (existing) {
            return res.status(400).json({ message: "Deletion request already pending" });
        }

        await DeletionRequest.create({
            user: req.user.id,
            reason: req.body.reason || "User requested deletion"
        });

        res.json({ message: "Deletion request submitted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
