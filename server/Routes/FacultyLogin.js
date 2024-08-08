import express from "express";
import jwt from 'jsonwebtoken';
import connection from "../db.js";
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

const router = express.Router();
dotenv.config();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.json({ "error": "email and password are required" });
  }

  const query = "SELECT * FROM faculty WHERE email = ?";

  try {
    // Check if the faculty exists with the given email
    const [results] = await connection.execute(query, [email]);

    if (results.length === 0) {
      return res.json({ "error": "faculty does not exist" });
    }

    const faculty = results[0];

    // Compare the provided password with the stored hashed password
    const passwordMatch = await bcrypt.compare(password, faculty.fpassword);
    if (!passwordMatch) {
      return res.json({ "error": "password not match" });
    }

    // Generate JWT token
    const token = jwt.sign({ email }, process.env.SECRET_KEY, { expiresIn: "3h" });
    console.log('token', token);
    return res.json({ token });
  } catch (error) {
    console.log("Error ", error);
    return res.json({ "error": "An error occurred" });
  }
});

export default router;
