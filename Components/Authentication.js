import jwt from "jsonwebtoken";
import User from "./UserModel.js";

export const authenticateUser = async (req, res, next) => {
  try {
    console.log("Inside authenticateUser");
    const token = req.header("Authorization")?.split(" ")[1];
    // console.log("token..", token);

    if (!token) {
      return res
        .status(401)
        .json({ error: "Access denied, no token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("decoded..", decoded);
    const email = decoded.email;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    req.user = user;
    // console.log("req.user..", req.user);
    // console.log("somewhere");
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

export default authenticateUser;
