import express from "express";

import User from "./UserModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const UserRouter = express.Router();

UserRouter.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log("Inside signup route");
    console.log("req.body..", req.body);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET
    );

    res.status(201).json({
      success: true,
      message: "User created successfully",
      token,
      name: user.name,
      email,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

UserRouter.post("/login", async (req, res) => {
  console.log("Inside login route");
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET);

    res.status(200).json({
      success: true,
      message: "Login successful. Use the token received during signup.",
      token,
      name: user.name,
      email,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default UserRouter;
