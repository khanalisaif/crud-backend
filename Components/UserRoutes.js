import express from 'express';

import User from './UserModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import authenticateUser from "./Authentication.js";


dotenv.config(); // .env file load karne ke liye

const UserRouter = express.Router();

UserRouter.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET, // secret key from .env
    );

    // Respond with token and user info
    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


UserRouter.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
  
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ error: 'Invalid email or password' });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: 'Invalid email or password' });
      }
  
      const token = jwt.sign(
        { email },
        process.env.JWT_SECRET,
      );

      // No new token generated here. User must already have token from signup.
      res.status(200).json({
        success: true,
        message: 'Login successful. Use the token received during signup.',
        token,
        name: user.name,
        email,
      });
  
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  export default UserRouter;