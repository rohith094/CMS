import express from "express";
import connection from '../db.js';
import FacultyLogin from './FacultyLogin.js';
import authRoute from "./authRoute.js";
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt';

const Router = express.Router();

Router.use("/", FacultyLogin);

const generateOTP = () => {
  const otpLength = 6;
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
    user: 'mendarohithkumarr@gmail.com',
    pass: 'czfg myjh ztfq zlvo'
  }
});

Router.get('/singlefaculty', authRoute, async (req, res) => {
  const query = 'SELECT * FROM faculty WHERE email = ?';

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
    const queryCheckUser = 'SELECT * FROM faculty WHERE email = ?';
    const [user] = await connection.execute(queryCheckUser, [email]);

    if (user.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = generateOTP();

    const queryUpdateOTP = 'UPDATE faculty SET reset_otp = ? WHERE email = ?';
    await connection.execute(queryUpdateOTP, [otp, email]);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Reset Password OTP',
      text: `OTP for Resetting Your Password:\n${otp}`
    };

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
    const queryCheckUser = 'SELECT * FROM faculty WHERE email = ?';
    const [user] = await connection.execute(queryCheckUser, [email]);

    if (user.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user[0].reset_otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const queryUpdatePassword = 'UPDATE faculty SET fpassword = ?, reset_otp = NULL WHERE email = ?';
    await connection.execute(queryUpdatePassword, [hashedPassword, email]);

    return res.json({ message: "OTP verified successfully and Password Updated Successfully" });

  } catch (err) {
    console.error("Error verifying OTP and updating password:", err);
    return res.status(500).json({ message: "Failed to verify OTP and update password" });
  }
});


Router.post('/addfaculty', async (req, res) => {
  const { first_name, last_name, email,password, phone_number, department, designation, date_of_birth, date_of_joining, address, city, state, zip_code, country, qualification, experience_years, experience_months, gender, profile_picture, workingstatus } = req.body;
  // const password = 'facultyPassword';
  
  if (!first_name || !last_name || !email || !password || !phone_number || !department || !designation || !date_of_birth || !date_of_joining || !address || !city || !state || !zip_code || !country || !qualification || !experience_years || !experience_months || !gender || !profile_picture || !workingstatus) {
    return res.status(400).send('Missing required fields');
  }

  const checkQuery = 'SELECT * FROM faculty WHERE email = ?';
  const query = 'INSERT INTO faculty (first_name, last_name, email, fpassword, phone_number, department, designation, date_of_birth, date_of_joining, address, city, state, zip_code, country, qualification, experience_years, experience_months, gender, profile_picture, workingstatus) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

  try {
    const [existingFaculty] = await connection.execute(checkQuery, [email]);

    if (existingFaculty.length > 0) {
      return res.status(409).send('A faculty member with the same email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("hashedPassword", hashedPassword);

    const [results] = await connection.execute(query, [first_name, last_name, email, hashedPassword, phone_number, department, designation, date_of_birth, date_of_joining, address, city, state, zip_code, country, qualification, experience_years, experience_months, gender, profile_picture, workingstatus]);

    res.status(201).send('Faculty member added successfully');
  } catch (error) {
    console.error('An error occurred while adding a faculty member:', error);
    res.status(500).send('An error occurred');
  }
});


export default Router;
