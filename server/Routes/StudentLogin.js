

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
    // return res.status(400).send("Email and password are required");
    return res.json({"error" : "email and password are required"});
  }
  
  const query = "SELECT * FROM students WHERE email = ?";

  try {
    // Check if the student exists with the given email
    const [results] = await connection.execute(query, [email]);

    if (results.length === 0) {
      // return res.status(404).send("Student does not exist");
      return res.json({"error" : "student does not exist"});
    }

    const student = results[0];

    // Compare the provided password with the stored hashed password
    const passwordMatch = await bcrypt.compare(password, student.spassword);
    if (!passwordMatch) {
      // return res.status(401).send("password doesnot match");
      return res.json({"error" : "password not match"});
    }

    // Generate JWT token
    const token = jwt.sign({ email }, process.env.SECRET_KEY, { expiresIn: "3h" });
    console.log('token', token);
    return res.json({ token });
  } catch (error) {
    console.log("Error ", error);
    // return res.status(500).send("An error occurred");
    return res.json({"error" : "An error occured "});
  }
});

export default router;
