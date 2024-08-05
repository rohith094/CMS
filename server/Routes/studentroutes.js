import express from "express";
import connection from '../db.js';
import StudentLogin from './StudentLogin.js';
import authRoute from "./authRoute.js";
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt';

const Router = express.Router();


Router.use("/", StudentLogin);

const generateOTP = () => {
  // Define the length of the OTP
  const otpLength = 6;

  // Generate a random numeric string of specified length
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < otpLength; i++) {
      const randomIndex = Math.floor(Math.random() * digits.length);
      otp += digits[randomIndex];
  }

  return otp;
};


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'mahanthivikas965@gmail.com',
    pass: 'yvnw xnip hzmy yfgx'
    
  }
});




Router.get('/singlestudent', authRoute, async (req, res) => {
  const query = 'SELECT * FROM students WHERE email = ?';

  try {
    const [results] = await connection.execute(query, [req.user]);
    if (results.length === 0) {
      return res.status(404).send('User not found');
    }
    res.json(results[0]);
  } catch (error) {
    console.error('An error occurred while fetching user details:', error);
    res.status(500).send('An error occurred');
  }
});



Router.get("/sendotp/:email", async (req, res) => {
  const { email } = req.params;
  console.log(email);

  try {
      // Check if the user exists with the provided email
      const queryCheckUser = 'SELECT * FROM students WHERE email = ?';
    const [user] = await connection.execute(queryCheckUser, [email]);

    if (user.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
      // Generate a new OTP
      const otp = generateOTP();

      // Store the OTP in the database temporarily
      const queryUpdateOTP = 'UPDATE students SET reset_otp = ? WHERE email = ?';
    await connection.execute(queryUpdateOTP, [otp, email]);

      // Configure mail options
      const mailOptions = {
          from: process.env.EMAIL_USER,
          to: email,
          subject: 'Reset Password OTP',
          text: `OTP for Resetting Your Password:\n${otp}`
      };

      // Send the email with OTP
      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
              console.error('Error sending email:', error);
              return res.status(500).json({ message: "Failed to send OTP email" });
          } else {
              console.log('Email sent:', info.response);
              return res.json({ message: "OTP sent successfully" });
          }
      });

  } catch (err) {
      console.error("Error sending OTP:", err);
      return res.status(500).json({ message: "Failed to send OTP" });
  }
});


Router.post("/verifyotp", async (req, res) => {
  const { email, otp, password } = req.body;

  try {
    // Check if the user exists with the provided email
    const queryCheckUser = 'SELECT * FROM students WHERE email = ?';
    const [user] = await connection.execute(queryCheckUser, [email]);

    if (user.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the stored reset OTP matches the provided OTP
    if (user[0].reset_otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user's password with the hashed password and clear the resetOTP field
    const queryUpdatePassword = 'UPDATE students SET spassword = ?, reset_otp = NULL WHERE email = ?';
    await connection.execute(queryUpdatePassword, [hashedPassword, email]);

    return res.json({ message: "OTP verified successfully and Password Updated Successfully" });

  } catch (err) {
    console.error("Error verifying OTP and updating password:", err);
    return res.status(500).json({ message: "Failed to verify OTP and update password" });
  }
});

export default Router;






