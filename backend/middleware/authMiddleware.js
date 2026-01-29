import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Admin from "../models/Admin.js";

// Any logged-in user (user or admin)
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (decoded.type === "admin") {
        req.user = await Admin.findById(decoded.id).select("-password");
      } else {
        req.user = await User.findById(decoded.id).select("-password");
      }

      if (!req.user) {
        return res.status(401).json({ message: "Not authorized" });
      }

      req.user.type = decoded.type;
      next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized" });
    }
  } else {
    return res.status(401).json({ message: "Not authorized" });
  }
};

// Admin-only access
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.type === "admin") {
    next();
  } else {
    return res.status(403).json({ message: "Admin access only" });
  }
};
